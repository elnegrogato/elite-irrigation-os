import { action, mutation, query } from "convex/server";
import { v } from "convex/values";
import { api } from "./_generated/api";
import {
  renderWorkflowEmail,
  sendEmailWithRetry,
  sendEstimateEmail,
  sendGenericNotificationEmail,
  sendInternalLeadAlertEmail,
  sendInvoiceEmail,
  sendPaymentReceiptEmail,
  sendPasswordResetEmail,
  sendReminderEmail,
  sendReviewRequestEmail,
  sendWelcomeEmail,
  sendWorkOrderCompletedEmail,
  sendWorkOrderScheduledEmail,
} from "./lib/email";

const TEMPLATE_CATEGORY: Record<string, string | null> = {
  estimate: "estimates",
  invoice: "invoices",
  paymentReceipt: "invoices",
  reminder: "reminders",
  appointmentReminder: "reminders",
  workOrderScheduled: "reminders",
  workOrderCompleted: "reminders",
  review: "reviews",
  reviewRequest: "reviews",
  welcome: null,
  passwordReset: null,
  internalLeadAlert: null,
  genericNotification: null,
};

async function canSend(ctx: any, leadId: any, templateType?: string) {
  const category = templateType ? TEMPLATE_CATEGORY[templateType] : null;
  if (!leadId || !category) return true;
  return await ctx.runQuery(api.emailPreferences.canSendEmail, { leadId, category });
}

async function canQueueFromMutation(ctx: any, leadId: any, templateType?: string) {
  const category = templateType ? TEMPLATE_CATEGORY[templateType] : null;
  if (!leadId || !category) return true;

  const preferences = await ctx.db
    .query("emailPreferences")
    .withIndex("by_lead", (q: any) => q.eq("leadId", leadId))
    .first();

  if (!preferences) return category !== "promotions";
  if (preferences.unsubscribed) return false;

  const categoryPreference = preferences[category as keyof typeof preferences] as boolean | undefined;
  return categoryPreference ?? true;
}

function outboundEmailPayload(args: {
  leadId?: any;
  to: string;
  subject: string;
  html: string;
  text?: string;
  templateType?: string;
  status?: string;
  scheduledFor?: number;
  messageIdProvider?: string;
  lastError?: string;
  meta?: any;
}) {
  const now = Date.now();
  const status = args.status ?? (args.scheduledFor && args.scheduledFor > now ? "scheduled" : "pending");

  return {
    createdAt: now,
    updatedAt: now,
    leadId: args.leadId,
    channel: "email",
    to: args.to,
    body: args.html,
    status,
    attempts: args.status ? 1 : 0,
    scheduledFor: args.scheduledFor,
    subject: args.subject,
    templateType: args.templateType,
    messageId: args.messageIdProvider,
    lastError: args.lastError,
    deliveredAt: status === "sent" ? now : undefined,
    meta: {
      ...(args.meta ?? {}),
      text: args.text,
    },
  };
}

async function recordSent(
  ctx: any,
  args: {
    leadId?: any;
    to: string;
    subject: string;
    html: string;
    text?: string;
    templateType: string;
    result: any;
    meta?: any;
  }
) {
  const id = await ctx.runMutation(api.emails.recordEmail, {
    leadId: args.leadId,
    to: args.to,
    subject: args.subject,
    html: args.html,
    text: args.text,
    templateType: args.templateType,
    status: args.result.success ? "sent" : "failed",
    messageIdProvider: args.result.messageId,
    lastError: args.result.error,
    meta: {
      ...(args.meta ?? {}),
      provider: args.result.provider,
    },
  });

  if (args.leadId && args.result.success) {
    await ctx.runMutation(api.emailPreferences.incrementEmailSent, { leadId: args.leadId });
    await ctx.runMutation(api.events.logEvent, {
      leadId: args.leadId,
      type: "email_sent",
      direction: "out",
      payload: {
        templateType: args.templateType,
        to: args.to,
        subject: args.subject,
        provider: args.result.provider,
        messageId: args.result.messageId,
      },
    });
  }

  return id;
}

export const recordEmail = mutation({
  args: {
    leadId: v.optional(v.id("leads")),
    to: v.string(),
    subject: v.string(),
    html: v.string(),
    text: v.optional(v.string()),
    templateType: v.optional(v.string()),
    status: v.optional(v.string()),
    scheduledFor: v.optional(v.number()),
    messageIdProvider: v.optional(v.string()),
    lastError: v.optional(v.string()),
    meta: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("outboundMessages", outboundEmailPayload(args));
  },
});

export const queueEmail = mutation({
  args: {
    leadId: v.optional(v.id("leads")),
    to: v.string(),
    subject: v.string(),
    html: v.string(),
    text: v.optional(v.string()),
    templateType: v.optional(v.string()),
    scheduledFor: v.optional(v.number()),
    meta: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    const allowed = await canQueueFromMutation(ctx, args.leadId, args.templateType);
    if (!allowed) return null;
    return await ctx.db.insert("outboundMessages", outboundEmailPayload(args));
  },
});

export const renderTemplatePreview = action({
  args: {
    templateType: v.union(
      v.literal("welcome"),
      v.literal("estimate"),
      v.literal("invoice"),
      v.literal("appointmentReminder"),
      v.literal("reviewRequest"),
      v.literal("passwordReset"),
      v.literal("internalLeadAlert"),
      v.literal("workOrderScheduled"),
      v.literal("workOrderCompleted"),
      v.literal("paymentReceipt"),
      v.literal("genericNotification")
    ),
    data: v.optional(v.any()),
  },
  handler: async (_ctx, { templateType, data }) => {
    return await renderWorkflowEmail(templateType, data ?? {});
  },
});

export const sendEstimate = action({
  args: {
    estimateId: v.id("estimates"),
    estimateUrl: v.optional(v.string()),
  },
  handler: async (ctx, { estimateId, estimateUrl }) => {
    const estimate = await ctx.runQuery(api.estimates.get, { id: estimateId });
    if (!estimate) throw new Error("Estimate not found");

    const lead = await ctx.runQuery(api.leads.get, { leadId: estimate.leadId });
    if (!lead?.email) throw new Error("Lead not found or has no email");

    if (!(await canSend(ctx, estimate.leadId, "estimate"))) {
      return { skipped: true, reason: "unsubscribed" };
    }

    const result = await sendEstimateEmail(estimate, lead.email, lead.name, estimateUrl);
    await recordSent(ctx, {
      leadId: estimate.leadId,
      to: lead.email,
      subject: result.subject || `Your Estimate #${String(estimate._id).slice(-6)}`,
      html: result.html || "",
      text: result.text,
      templateType: "estimate",
      result,
      meta: { estimateId, estimateUrl },
    });
    return result;
  },
});

export const sendInvoice = action({
  args: {
    invoiceId: v.id("invoices"),
    paymentUrl: v.optional(v.string()),
  },
  handler: async (ctx, { invoiceId, paymentUrl }) => {
    const invoice = await ctx.runQuery(api.invoices.get, { invoiceId });
    if (!invoice) throw new Error("Invoice not found");

    let lead = null as any;
    if (invoice.leadId) lead = await ctx.runQuery(api.leads.get, { leadId: invoice.leadId });
    const to = lead?.email || invoice.customerEmail;
    if (!to) throw new Error("No customer email found for invoice");

    if (invoice.leadId && !(await canSend(ctx, invoice.leadId, "invoice"))) {
      return { skipped: true, reason: "unsubscribed" };
    }

    const result = await sendInvoiceEmail(invoice, to, lead?.name, paymentUrl);
    await recordSent(ctx, {
      leadId: invoice.leadId,
      to,
      subject: result.subject || `Invoice #${String(invoice._id).slice(-6)}`,
      html: result.html || "",
      text: result.text,
      templateType: "invoice",
      result,
      meta: { invoiceId, paymentUrl },
    });
    return result;
  },
});

export const sendPaymentReceipt = action({
  args: {
    invoiceId: v.id("invoices"),
    receiptUrl: v.optional(v.string()),
  },
  handler: async (ctx, { invoiceId, receiptUrl }) => {
    const invoice = await ctx.runQuery(api.invoices.get, { invoiceId });
    if (!invoice) throw new Error("Invoice not found");

    let lead = null as any;
    if (invoice.leadId) lead = await ctx.runQuery(api.leads.get, { leadId: invoice.leadId });
    const to = lead?.email || invoice.customerEmail;
    if (!to) throw new Error("No customer email found for receipt");

    const result = await sendPaymentReceiptEmail(invoice, to, lead?.name, receiptUrl);
    await recordSent(ctx, {
      leadId: invoice.leadId,
      to,
      subject: result.subject || "Payment received",
      html: result.html || "",
      text: result.text,
      templateType: "paymentReceipt",
      result,
      meta: { invoiceId, receiptUrl },
    });
    return result;
  },
});

export const sendAppointmentReminder = action({
  args: { appointmentId: v.id("appointments") },
  handler: async (ctx, { appointmentId }) => {
    const appointment = await ctx.runQuery(api.appointments.get, { id: appointmentId });
    if (!appointment) throw new Error("Appointment not found");

    const lead = await ctx.runQuery(api.leads.get, { leadId: appointment.leadId });
    if (!lead?.email) throw new Error("Lead not found or has no email");

    if (!(await canSend(ctx, appointment.leadId, "appointmentReminder"))) {
      return { skipped: true, reason: "unsubscribed" };
    }

    const result = await sendReminderEmail(appointment, lead.email, lead.name);
    await recordSent(ctx, {
      leadId: appointment.leadId,
      to: lead.email,
      subject: result.subject || "Appointment reminder",
      html: result.html || "",
      text: result.text,
      templateType: "appointmentReminder",
      result,
      meta: { appointmentId },
    });
    return result;
  },
});

export const sendReviewRequest = action({
  args: {
    workOrderId: v.id("workOrders"),
    reviewUrl: v.optional(v.string()),
  },
  handler: async (ctx, { workOrderId, reviewUrl }) => {
    const detail = await ctx.runQuery(api.workOrders.get, { workOrderId });
    const workOrder = detail?.wo ?? detail;
    if (!workOrder) throw new Error("Work order not found");
    if (!workOrder.leadId) throw new Error("Work order has no lead");

    const lead = await ctx.runQuery(api.leads.get, { leadId: workOrder.leadId });
    if (!lead?.email) throw new Error("Lead not found or has no email");

    if (!(await canSend(ctx, workOrder.leadId, "reviewRequest"))) {
      return { skipped: true, reason: "unsubscribed" };
    }

    const result = await sendReviewRequestEmail(workOrder, lead.email, lead.name, reviewUrl);
    await recordSent(ctx, {
      leadId: workOrder.leadId,
      to: lead.email,
      subject: result.subject || "How did we do?",
      html: result.html || "",
      text: result.text,
      templateType: "reviewRequest",
      result,
      meta: { workOrderId, reviewUrl },
    });
    return result;
  },
});

export const sendWelcome = action({
  args: { leadId: v.id("leads") },
  handler: async (ctx, { leadId }) => {
    const lead = await ctx.runQuery(api.leads.get, { leadId });
    if (!lead?.email) throw new Error("Lead not found or has no email");

    const result = await sendWelcomeEmail(lead.name || "there", lead.email, lead.serviceSlug);
    await recordSent(ctx, {
      leadId,
      to: lead.email,
      subject: result.subject || "We received your request",
      html: result.html || "",
      text: result.text,
      templateType: "welcome",
      result,
      meta: { serviceSlug: lead.serviceSlug },
    });
    return result;
  },
});

export const sendPasswordReset = action({
  args: {
    to: v.string(),
    name: v.optional(v.string()),
    resetUrl: v.string(),
  },
  handler: async (ctx, { to, name, resetUrl }) => {
    const result = await sendPasswordResetEmail(to, name, resetUrl);
    await recordSent(ctx, {
      to,
      subject: result.subject || "Reset your password",
      html: result.html || "",
      text: result.text,
      templateType: "passwordReset",
      result,
      meta: { resetUrl },
    });
    return result;
  },
});

export const sendInternalLeadAlert = action({
  args: {
    leadId: v.id("leads"),
    to: v.optional(v.string()),
  },
  handler: async (ctx, { leadId, to }) => {
    const lead = await ctx.runQuery(api.leads.get, { leadId });
    if (!lead) throw new Error("Lead not found");

    const recipient = to || process.env.INTERNAL_LEAD_ALERT_EMAIL || process.env.EMAIL_FROM;
    if (!recipient) throw new Error("No internal lead alert recipient configured");

    const result = await sendInternalLeadAlertEmail(recipient, {
      leadName: lead.name,
      leadEmail: lead.email,
      leadPhone: lead.phone,
      service: lead.serviceSlug,
      addressText: lead.addressText,
      message: lead.message,
      ctaUrl: `${process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL || "https://eliteirrigation.com"}/admin`,
    });
    await recordSent(ctx, {
      leadId,
      to: recipient,
      subject: result.subject || "New lead",
      html: result.html || "",
      text: result.text,
      templateType: "internalLeadAlert",
      result,
      meta: { leadId },
    });
    return result;
  },
});

export const sendWorkOrderScheduled = action({
  args: { workOrderId: v.id("workOrders") },
  handler: async (ctx, { workOrderId }) => {
    const detail = await ctx.runQuery(api.workOrders.get, { workOrderId });
    const workOrder = detail?.wo ?? detail;
    if (!workOrder) throw new Error("Work order not found");
    if (!workOrder.leadId) throw new Error("Work order has no lead");

    const lead = await ctx.runQuery(api.leads.get, { leadId: workOrder.leadId });
    if (!lead?.email) throw new Error("Lead not found or has no email");

    if (!(await canSend(ctx, workOrder.leadId, "workOrderScheduled"))) {
      return { skipped: true, reason: "unsubscribed" };
    }

    const result = await sendWorkOrderScheduledEmail(workOrder, lead.email, lead.name);
    await recordSent(ctx, {
      leadId: workOrder.leadId,
      to: lead.email,
      subject: result.subject || "Work scheduled",
      html: result.html || "",
      text: result.text,
      templateType: "workOrderScheduled",
      result,
      meta: { workOrderId },
    });
    return result;
  },
});

export const sendWorkOrderCompleted = action({
  args: {
    workOrderId: v.id("workOrders"),
    ctaUrl: v.optional(v.string()),
  },
  handler: async (ctx, { workOrderId, ctaUrl }) => {
    const detail = await ctx.runQuery(api.workOrders.get, { workOrderId });
    const workOrder = detail?.wo ?? detail;
    if (!workOrder) throw new Error("Work order not found");
    if (!workOrder.leadId) throw new Error("Work order has no lead");

    const lead = await ctx.runQuery(api.leads.get, { leadId: workOrder.leadId });
    if (!lead?.email) throw new Error("Lead not found or has no email");

    if (!(await canSend(ctx, workOrder.leadId, "workOrderCompleted"))) {
      return { skipped: true, reason: "unsubscribed" };
    }

    const result = await sendWorkOrderCompletedEmail(workOrder, lead.email, lead.name, ctaUrl);
    await recordSent(ctx, {
      leadId: workOrder.leadId,
      to: lead.email,
      subject: result.subject || "Work completed",
      html: result.html || "",
      text: result.text,
      templateType: "workOrderCompleted",
      result,
      meta: { workOrderId, ctaUrl },
    });
    return result;
  },
});

export const sendGenericNotification = action({
  args: {
    to: v.string(),
    subject: v.string(),
    title: v.string(),
    body: v.string(),
    leadId: v.optional(v.id("leads")),
    ctaUrl: v.optional(v.string()),
    ctaLabel: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const result = await sendGenericNotificationEmail(args.to, {
      title: args.title,
      body: args.body,
      ctaUrl: args.ctaUrl,
      ctaLabel: args.ctaLabel,
    });
    await recordSent(ctx, {
      leadId: args.leadId,
      to: args.to,
      subject: args.subject || result.subject || args.title,
      html: result.html || "",
      text: result.text,
      templateType: "genericNotification",
      result: { ...result, subject: args.subject || result.subject },
      meta: { ctaUrl: args.ctaUrl },
    });
    return result;
  },
});

export const listEmails = query({
  args: {
    limit: v.optional(v.number()),
    status: v.optional(v.string()),
    templateType: v.optional(v.string()),
  },
  handler: async (ctx, { limit = 50, status, templateType }) => {
    const emails = await ctx.db
      .query("outboundMessages")
      .withIndex("by_channel", (q) => q.eq("channel", "email"))
      .order("desc")
      .take(limit);

    return emails.filter((email) => {
      if (status && email.status !== status) return false;
      if (templateType && email.templateType !== templateType) return false;
      return true;
    });
  },
});

export const getEmailStats = query({
  args: {},
  handler: async (ctx) => {
    const emails = await ctx.db
      .query("outboundMessages")
      .withIndex("by_channel", (q) => q.eq("channel", "email"))
      .take(1000);

    return emails.reduce(
      (stats, email) => {
        stats.total += 1;
        if (email.status === "sent") stats.sent += 1;
        if (email.status === "pending" || email.status === "scheduled") stats.pending += 1;
        if (email.status === "failed") stats.failed += 1;
        if (email.status === "bounced") stats.bounced += 1;
        if (email.deliveredAt) stats.delivered += 1;
        if (email.openedAt) stats.opened += 1;
        if (email.clickedAt) stats.clicked += 1;
        return stats;
      },
      { total: 0, sent: 0, delivered: 0, opened: 0, clicked: 0, bounced: 0, pending: 0, failed: 0 }
    );
  },
});

export const retryEmail = action({
  args: { messageId: v.id("outboundMessages") },
  handler: async (ctx, { messageId }) => {
    const message = await ctx.runQuery(api.messages.get, { id: messageId });
    if (!message || message.channel !== "email") throw new Error("Email not found");

    const result = await sendEmailWithRetry({
      to: message.to,
      subject: message.subject || "Elite Irrigation & Landscaping",
      html: message.body,
      text: message.meta?.text,
    });

    await ctx.runMutation(api.messages.updateStatus, {
      messageId,
      status: result.success ? "sent" : "failed",
      lastError: result.error,
      messageIdProvider: result.messageId,
      deliveredAt: result.success ? Date.now() : undefined,
    });

    return result;
  },
});
