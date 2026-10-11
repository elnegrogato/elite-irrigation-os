import { Resend } from "resend";
import {
  buildWorkflowEmail,
  type WorkflowEmailData,
  type WorkflowEmailType,
} from "../../src/emails/elite-workflows";

export interface SendEmailParams {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  from?: string;
  replyTo?: string;
  cc?: string | string[];
  bcc?: string | string[];
  tags?: Array<{ name: string; value: string }>;
}

export interface EmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
  provider?: string;
  subject?: string;
  html?: string;
  text?: string;
}

function sender(params: SendEmailParams) {
  const fromAddress = params.from || process.env.EMAIL_FROM || "noreply@eliteirrigation.com";
  const fromName = process.env.EMAIL_FROM_NAME || "Elite Irrigation & Landscaping";
  return fromAddress.includes("<") ? fromAddress : `${fromName} <${fromAddress}>`;
}

/**
 * Send email via Resend. If RESEND_API_KEY is not configured, render the email
 * and return a mock success so local workflows can still be tested safely.
 */
export async function sendEmail(params: SendEmailParams): Promise<EmailResult> {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    console.warn("[Email] RESEND_API_KEY not set. Email rendered but not sent.", {
      to: params.to,
      subject: params.subject,
    });
    return {
      success: true,
      messageId: `mock_${Date.now()}`,
      provider: "mock",
    };
  }

  try {
    const resend = new Resend(apiKey);
    const { data, error } = await resend.emails.send({
      from: sender(params),
      to: params.to,
      cc: params.cc,
      bcc: params.bcc,
      replyTo: params.replyTo || process.env.EMAIL_REPLY_TO || process.env.EMAIL_FROM,
      subject: params.subject,
      html: params.html,
      text: params.text,
      tags: params.tags,
    });

    if (error) {
      return {
        success: false,
        error: error.message,
        provider: "resend",
      };
    }

    return {
      success: true,
      messageId: data?.id,
      provider: "resend",
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown Resend error",
      provider: "resend",
    };
  }
}

export async function sendEmailWithRetry(
  params: SendEmailParams,
  maxRetries = 3,
  delayMs = 1000
): Promise<EmailResult> {
  let lastError: string | undefined;

  for (let attempt = 1; attempt <= maxRetries; attempt += 1) {
    const result = await sendEmail(params);
    if (result.success) return result;

    lastError = result.error;
    if (attempt < maxRetries) {
      await new Promise((resolve) => setTimeout(resolve, delayMs * attempt));
    }
  }

  return {
    success: false,
    error: `Failed after ${maxRetries} attempts: ${lastError}`,
    provider: "resend",
  };
}

export async function renderWorkflowEmail(type: WorkflowEmailType, data: WorkflowEmailData = {}) {
  return buildWorkflowEmail(type, data);
}

async function sendWorkflowEmail(type: WorkflowEmailType, to: string, data: WorkflowEmailData, tags?: SendEmailParams["tags"]) {
  const rendered = await renderWorkflowEmail(type, data);
  const result = await sendEmailWithRetry({
    to,
    subject: rendered.subject,
    html: rendered.html,
    text: rendered.text,
    tags: [{ name: "workflow", value: type }, ...(tags ?? [])],
  });

  return {
    ...result,
    subject: rendered.subject,
    html: rendered.html,
    text: rendered.text,
  };
}

export async function sendEstimateEmail(estimate: any, leadEmail: string, leadName?: string, estimateUrl?: string) {
  return sendWorkflowEmail("estimate", leadEmail, {
    estimate,
    leadName,
    service: estimate?.items?.[0]?.name,
    ctaUrl: estimateUrl,
    ctaLabel: estimateUrl ? "Review Estimate" : undefined,
  });
}

export async function sendInvoiceEmail(invoice: any, leadEmail: string, leadName?: string, paymentUrl?: string) {
  return sendWorkflowEmail("invoice", leadEmail, {
    invoice,
    leadName,
    paymentUrl,
  });
}

export async function sendPaymentReceiptEmail(invoice: any, leadEmail: string, leadName?: string, receiptUrl?: string) {
  return sendWorkflowEmail("paymentReceipt", leadEmail, {
    invoice,
    leadName,
    receiptUrl,
  });
}

export async function sendReminderEmail(appointment: any, leadEmail: string, leadName?: string) {
  return sendWorkflowEmail("appointmentReminder", leadEmail, {
    appointment,
    leadName,
    service: appointment?.serviceSlug,
    addressText: appointment?.addressText,
  });
}

export async function sendReviewRequestEmail(workOrder: any, leadEmail: string, leadName?: string, reviewUrl?: string) {
  return sendWorkflowEmail("reviewRequest", leadEmail, {
    workOrder,
    leadName,
    service: workOrder?.serviceSlug,
    reviewUrl,
  });
}

export async function sendWelcomeEmail(leadName: string, leadEmail: string, service?: string) {
  return sendWorkflowEmail("welcome", leadEmail, {
    leadName,
    service,
  });
}

export async function sendPasswordResetEmail(to: string, leadName: string | undefined, resetUrl: string) {
  return sendWorkflowEmail("passwordReset", to, {
    leadName,
    resetUrl,
  });
}

export async function sendInternalLeadAlertEmail(to: string, data: WorkflowEmailData) {
  return sendWorkflowEmail("internalLeadAlert", to, data);
}

export async function sendWorkOrderScheduledEmail(workOrder: any, leadEmail: string, leadName?: string) {
  return sendWorkflowEmail("workOrderScheduled", leadEmail, {
    workOrder,
    leadName,
    service: workOrder?.serviceSlug,
    addressText: workOrder?.addressText,
  });
}

export async function sendWorkOrderCompletedEmail(workOrder: any, leadEmail: string, leadName?: string, ctaUrl?: string) {
  return sendWorkflowEmail("workOrderCompleted", leadEmail, {
    workOrder,
    leadName,
    service: workOrder?.serviceSlug,
    ctaUrl,
  });
}

export async function sendGenericNotificationEmail(to: string, data: WorkflowEmailData) {
  return sendWorkflowEmail("genericNotification", to, data);
}
