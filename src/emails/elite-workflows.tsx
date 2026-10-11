import * as React from "react";
import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import { render } from "@react-email/render";

export type WorkflowEmailType =
  | "welcome"
  | "estimate"
  | "invoice"
  | "appointmentReminder"
  | "reviewRequest"
  | "passwordReset"
  | "internalLeadAlert"
  | "workOrderScheduled"
  | "workOrderCompleted"
  | "paymentReceipt"
  | "genericNotification";

export type WorkflowEmailData = {
  leadName?: string;
  leadEmail?: string;
  leadPhone?: string;
  service?: string;
  message?: string;
  addressText?: string;
  estimate?: any;
  invoice?: any;
  appointment?: any;
  workOrder?: any;
  paymentUrl?: string;
  receiptUrl?: string;
  resetUrl?: string;
  reviewUrl?: string;
  ctaUrl?: string;
  ctaLabel?: string;
  title?: string;
  body?: string;
  siteUrl?: string;
};

type EmailModel = {
  subject: string;
  preview: string;
  eyebrow: string;
  title: string;
  intro: string;
  ctaUrl?: string;
  ctaLabel?: string;
  rows?: Array<[string, string]>;
  bullets?: string[];
  note?: string;
};

const BRAND = "Elite Irrigation & Landscaping";
const PHONE_DISPLAY = "(704) 886-4240";
const PHONE_HREF = "tel:+17048864240";
const DEFAULT_SITE_URL = "https://eliteirrigation.com";

const colors = {
  forest: "#166534",
  dark: "#151513",
  green: "#16a34a",
  stone: "#57534e",
  light: "#f7f7f4",
  border: "#e7e5e4",
};

function money(value?: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(value ?? 0);
}

function dateTime(value?: number) {
  if (!value) return "To be scheduled";
  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

function label(value?: string) {
  if (!value) return "Outdoor service";
  return value.replace(/[-_]/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
}

function estimateRows(estimate: any): Array<[string, string]> {
  const rows: Array<[string, string]> = [
    ["Estimate", `#${String(estimate?._id ?? "draft").slice(-6).toUpperCase()}`],
    ["Total", money(estimate?.total)],
  ];
  if (estimate?.expiresAt) rows.push(["Valid Until", new Date(estimate.expiresAt).toLocaleDateString("en-US")]);
  return rows;
}

function invoiceRows(invoice: any): Array<[string, string]> {
  return [
    ["Invoice", `#${String(invoice?._id ?? "draft").slice(-6).toUpperCase()}`],
    ["Status", label(invoice?.status)],
    ["Subtotal", money(invoice?.subtotal)],
    ["Tax", money(invoice?.tax)],
    ["Total", money(invoice?.total)],
    ["Balance Due", money(invoice?.balanceDue ?? invoice?.total)],
  ];
}

function getModel(type: WorkflowEmailType, data: WorkflowEmailData): EmailModel {
  const name = data.leadName || "there";
  const service = label(data.service || data.estimate?.items?.[0]?.name || data.workOrder?.serviceSlug || data.appointment?.serviceSlug);

  switch (type) {
    case "welcome":
      return {
        subject: "We received your outdoor service request",
        preview: "Elite has your request and will help route the right next step.",
        eyebrow: "Request received",
        title: "We have your request. Now we route the right fix.",
        intro: `Hi ${name}, thanks for reaching out to Elite. We received your ${service.toLowerCase()} request and will review the details so we can recommend the right next step.`,
        ctaUrl: data.ctaUrl || `${data.siteUrl || DEFAULT_SITE_URL}/quick-quote`,
        ctaLabel: "Add More Details",
        rows: [
          ["Service", service],
          ["Phone", PHONE_DISPLAY],
          ["Next Step", "Review, triage, and follow-up"],
        ],
        bullets: ["Reply with photos if you have them.", "Call us if water is actively running or flooding.", "We keep the request attached to your property record."],
      };
    case "estimate":
      return {
        subject: `Your Elite estimate is ready - ${money(data.estimate?.total)}`,
        preview: "Review the estimate, scope, and next steps for your outdoor service.",
        eyebrow: "Estimate ready",
        title: "Your estimate is ready for review.",
        intro: `Hi ${name}, we prepared your estimate for ${service.toLowerCase()}. Review the scope and reply with any questions before we schedule the work.`,
        ctaUrl: data.ctaUrl,
        ctaLabel: data.ctaLabel || "Review Estimate",
        rows: estimateRows(data.estimate),
        bullets: (data.estimate?.items ?? []).slice(0, 6).map((item: any) => `${item.name}: ${item.qty} ${item.unit} at ${money(item.unitPrice)}`),
        note: data.estimate?.notes,
      };
    case "invoice":
      return {
        subject: `Invoice from Elite - ${money(data.invoice?.total)}`,
        preview: "Your invoice is ready with payment details and balance information.",
        eyebrow: "Invoice ready",
        title: "Your invoice is ready.",
        intro: `Hi ${name}, thank you for choosing Elite. Your invoice is ready. You can pay online using the secure link below or contact us with any questions.`,
        ctaUrl: data.paymentUrl,
        ctaLabel: "Pay Invoice",
        rows: invoiceRows(data.invoice),
        note: data.invoice?.notes,
      };
    case "paymentReceipt":
      return {
        subject: `Payment received - ${money(data.invoice?.amountPaid ?? data.invoice?.total)}`,
        preview: "Payment has been recorded for your Elite invoice.",
        eyebrow: "Payment received",
        title: "Payment received. Thank you.",
        intro: `Hi ${name}, your payment has been recorded. Keep this email for your records.`,
        ctaUrl: data.receiptUrl,
        ctaLabel: "View Receipt",
        rows: invoiceRows(data.invoice),
      };
    case "appointmentReminder":
      return {
        subject: `Reminder: Elite visit on ${dateTime(data.appointment?.scheduledFor)}`,
        preview: "Your upcoming Elite appointment details are inside.",
        eyebrow: "Appointment reminder",
        title: "Your service visit is coming up.",
        intro: `Hi ${name}, this is a reminder for your upcoming ${service.toLowerCase()} visit. Please make sure the crew can access the work area and any controller, valve box, gate, or problem spot we need to inspect.`,
        rows: [
          ["Scheduled For", dateTime(data.appointment?.scheduledFor)],
          ["Time Window", data.appointment?.windowMins ? `${data.appointment.windowMins} minutes` : "Standard arrival window"],
          ["Service", service],
          ["Address", data.appointment?.addressText || data.addressText || "On file"],
        ],
        bullets: ["Secure pets before arrival.", "Share any photos or notes before the visit.", "Call us if the issue changes before we arrive."],
      };
    case "reviewRequest":
      return {
        subject: "How did Elite do?",
        preview: "Your feedback helps us improve and helps neighbors find a dependable outdoor crew.",
        eyebrow: "Project feedback",
        title: "How did the work turn out?",
        intro: `Hi ${name}, thanks again for trusting Elite with your property. If the work solved the problem and the experience felt clear, a quick review helps a lot.`,
        ctaUrl: data.reviewUrl || "https://www.google.com/search?q=Elite+Irrigation+%26+Landscaping+reviews",
        ctaLabel: "Leave a Review",
        rows: [
          ["Service", service],
          ["Completed", data.workOrder?.closedAt ? new Date(data.workOrder.closedAt).toLocaleDateString("en-US") : "Recently"],
        ],
        note: "If anything still needs attention, reply to this email before leaving a review and we will help make it right.",
      };
    case "passwordReset":
      return {
        subject: "Reset your Elite portal password",
        preview: "Use the secure link to reset your portal password.",
        eyebrow: "Security",
        title: "Reset your password.",
        intro: `Hi ${name}, use the button below to reset your Elite portal password. If you did not request this, you can ignore this email.`,
        ctaUrl: data.resetUrl,
        ctaLabel: "Reset Password",
        note: "This link should be treated as private. Do not forward it.",
      };
    case "internalLeadAlert":
      return {
        subject: `New lead: ${service}`,
        preview: "A new customer request needs review.",
        eyebrow: "New lead",
        title: "A new outdoor service request came in.",
        intro: "Review the request, assign urgency, and follow up while the customer is still warm.",
        ctaUrl: data.ctaUrl || `${data.siteUrl || DEFAULT_SITE_URL}/admin`,
        ctaLabel: "Open Admin",
        rows: [
          ["Customer", data.leadName || "Name not provided"],
          ["Email", data.leadEmail || "Not provided"],
          ["Phone", data.leadPhone || "Not provided"],
          ["Service", service],
          ["Address", data.addressText || "Not provided"],
        ],
        note: data.message,
      };
    case "workOrderScheduled":
      return {
        subject: `Work scheduled: ${service}`,
        preview: "Your Elite work order has been scheduled.",
        eyebrow: "Work scheduled",
        title: "Your work is on the schedule.",
        intro: `Hi ${name}, your ${service.toLowerCase()} work order is scheduled. We will document the work and keep the next step clear.`,
        rows: [
          ["Scheduled For", dateTime(data.workOrder?.scheduledFor)],
          ["Service", service],
          ["Address", data.workOrder?.addressText || data.addressText || "On file"],
          ["Priority", label(data.workOrder?.priority)],
        ],
      };
    case "workOrderCompleted":
      return {
        subject: `Work completed: ${service}`,
        preview: "Your Elite work order has been completed.",
        eyebrow: "Work completed",
        title: "The work order is complete.",
        intro: `Hi ${name}, your ${service.toLowerCase()} work has been marked complete. The crew notes and proof are attached to the job record.`,
        rows: [
          ["Service", service],
          ["Completed", data.workOrder?.closedAt ? new Date(data.workOrder.closedAt).toLocaleDateString("en-US") : "Today"],
          ["Proof", data.workOrder?.proofComplete ? "Before/after proof complete" : "Crew notes on file"],
        ],
        ctaUrl: data.ctaUrl,
        ctaLabel: data.ctaLabel || "View Project Notes",
      };
    case "genericNotification":
    default:
      return {
        subject: data.title || "Elite Irrigation & Landscaping update",
        preview: data.body || "You have a new update from Elite.",
        eyebrow: "Elite update",
        title: data.title || "You have a new update.",
        intro: data.body || "Here is the latest update from Elite Irrigation & Landscaping.",
        ctaUrl: data.ctaUrl,
        ctaLabel: data.ctaLabel,
      };
  }
}

function DetailRows({ rows = [] }: { rows?: Array<[string, string]> }) {
  if (!rows.length) return null;
  return (
    <Section style={card}>
      {rows.map(([key, value]) => (
        <Section key={key} style={row}>
          <Text style={rowLabel}>{key}</Text>
          <Text style={rowValue}>{value}</Text>
        </Section>
      ))}
    </Section>
  );
}

function BulletList({ bullets = [] }: { bullets?: string[] }) {
  if (!bullets.length) return null;
  return (
    <Section style={card}>
      {bullets.map((item) => (
        <Text key={item} style={bullet}>
          {"\u2022"} {item}
        </Text>
      ))}
    </Section>
  );
}

function WorkflowEmail({ type, data }: { type: WorkflowEmailType; data: WorkflowEmailData }) {
  const model = getModel(type, data);
  const siteUrl = data.siteUrl || DEFAULT_SITE_URL;

  return (
    <Html lang="en">
      <Head />
      <Preview>{model.preview}</Preview>
      <Body style={body}>
        <Container style={container}>
          <Section style={header}>
            <Img
              src={`${siteUrl}/Elite-Irrigation-and-Landscaping-optimized.png`}
              alt={BRAND}
              width="220"
              style={logo}
            />
            <Text style={headerText}>Charlotte Metro Outdoor Services</Text>
          </Section>
          <Section style={content}>
            <Text style={eyebrow}>{model.eyebrow}</Text>
            <Heading as="h1" style={heading}>
              {model.title}
            </Heading>
            <Text style={intro}>{model.intro}</Text>
            {model.ctaUrl && model.ctaLabel ? (
              <Button href={model.ctaUrl} style={button}>
                {model.ctaLabel}
              </Button>
            ) : null}
            <DetailRows rows={model.rows} />
            <BulletList bullets={model.bullets} />
            {model.note ? (
              <Section style={note}>
                <Text style={noteText}>{model.note}</Text>
              </Section>
            ) : null}
            <Hr style={hr} />
            <Text style={supportText}>
              Need help now? Call <Link href={PHONE_HREF} style={inlineLink}>{PHONE_DISPLAY}</Link> or reply to this email.
            </Text>
          </Section>
          <Section style={footer}>
            <Text style={footerBrand}>{BRAND}</Text>
            <Text style={footerText}>Harrisburg, NC • Serving Charlotte, Concord, Lake Norman, Matthews, and nearby communities.</Text>
            <Text style={footerText}>
              <Link href={siteUrl} style={footerLink}>Website</Link> {" | "}
              <Link href={`${siteUrl}/privacy`} style={footerLink}>Privacy</Link> {" | "}
              <Link href={`${siteUrl}/contact`} style={footerLink}>Contact</Link>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

export async function buildWorkflowEmail(type: WorkflowEmailType, data: WorkflowEmailData = {}) {
  const siteUrl = data.siteUrl || process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL || DEFAULT_SITE_URL;
  const normalizedData = { ...data, siteUrl };
  const model = getModel(type, normalizedData);
  const element = <WorkflowEmail type={type} data={normalizedData} />;

  return {
    subject: model.subject,
    html: await render(element),
    text: await render(element, { plainText: true }),
  };
}

const body: React.CSSProperties = {
  margin: 0,
  backgroundColor: colors.light,
  fontFamily: "Arial, Helvetica, sans-serif",
};

const container: React.CSSProperties = {
  width: "100%",
  maxWidth: "640px",
  margin: "0 auto",
  backgroundColor: "#ffffff",
};

const header: React.CSSProperties = {
  padding: "28px 28px 22px",
  backgroundColor: colors.dark,
  textAlign: "center",
};

const logo: React.CSSProperties = {
  margin: "0 auto",
  display: "block",
};

const headerText: React.CSSProperties = {
  margin: "12px 0 0",
  color: "#bbf7d0",
  fontSize: "12px",
  fontWeight: 700,
  textTransform: "uppercase",
};

const content: React.CSSProperties = {
  padding: "36px 28px 28px",
};

const eyebrow: React.CSSProperties = {
  margin: "0 0 10px",
  color: colors.forest,
  fontSize: "12px",
  fontWeight: 700,
  textTransform: "uppercase",
};

const heading: React.CSSProperties = {
  margin: "0 0 16px",
  color: colors.dark,
  fontSize: "30px",
  lineHeight: "38px",
  fontFamily: "Georgia, 'Times New Roman', serif",
};

const intro: React.CSSProperties = {
  margin: "0 0 22px",
  color: colors.stone,
  fontSize: "16px",
  lineHeight: "26px",
};

const button: React.CSSProperties = {
  display: "inline-block",
  margin: "4px 0 24px",
  padding: "14px 22px",
  borderRadius: "8px",
  backgroundColor: colors.forest,
  color: "#ffffff",
  fontSize: "14px",
  fontWeight: 700,
  textDecoration: "none",
};

const card: React.CSSProperties = {
  margin: "0 0 20px",
  padding: "18px 20px",
  border: `1px solid ${colors.border}`,
  borderRadius: "10px",
  backgroundColor: "#ffffff",
};

const row: React.CSSProperties = {
  display: "block",
  padding: "10px 0",
  borderBottom: `1px solid ${colors.border}`,
};

const rowLabel: React.CSSProperties = {
  display: "inline-block",
  width: "42%",
  margin: 0,
  color: "#78716c",
  fontSize: "13px",
  verticalAlign: "top",
};

const rowValue: React.CSSProperties = {
  display: "inline-block",
  width: "58%",
  margin: 0,
  color: colors.dark,
  fontSize: "14px",
  fontWeight: 700,
  textAlign: "right",
  verticalAlign: "top",
};

const bullet: React.CSSProperties = {
  margin: "0 0 10px",
  color: colors.stone,
  fontSize: "14px",
  lineHeight: "22px",
};

const note: React.CSSProperties = {
  margin: "0 0 20px",
  padding: "16px 18px",
  borderLeft: `4px solid ${colors.green}`,
  borderRadius: "8px",
  backgroundColor: "#f0fdf4",
};

const noteText: React.CSSProperties = {
  margin: 0,
  color: "#14532d",
  fontSize: "14px",
  lineHeight: "22px",
};

const hr: React.CSSProperties = {
  margin: "28px 0 18px",
  borderColor: colors.border,
};

const supportText: React.CSSProperties = {
  margin: 0,
  color: colors.stone,
  fontSize: "14px",
  lineHeight: "22px",
};

const inlineLink: React.CSSProperties = {
  color: colors.forest,
  fontWeight: 700,
  textDecoration: "none",
};

const footer: React.CSSProperties = {
  padding: "24px 28px 34px",
  backgroundColor: colors.light,
  textAlign: "center",
};

const footerBrand: React.CSSProperties = {
  margin: "0 0 8px",
  color: colors.dark,
  fontSize: "14px",
  fontWeight: 700,
};

const footerText: React.CSSProperties = {
  margin: "0 0 8px",
  color: "#78716c",
  fontSize: "12px",
  lineHeight: "20px",
};

const footerLink: React.CSSProperties = {
  color: colors.forest,
  textDecoration: "none",
};
