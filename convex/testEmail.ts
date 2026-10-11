// convex/testEmail.ts
// Test file for email integration - DO NOT use in production
import { action } from "convex/server";
import { v } from "convex/values";
import { sendEmail, sendGenericNotificationEmail } from "./lib/email";

/**
 * TEST ACTION - Send a test email
 * This is for testing the email integration only
 * Remove or disable in production
 */
export const sendTestEmail = action({
  args: {
    to: v.string(),
  },
  handler: async (_ctx, { to }) => {
    const result = await sendGenericNotificationEmail(to, {
      title: "Resend + React Email test",
      body: "This confirms the Elite email workflow renderer can create branded HTML and plain-text output, then hand it to Resend for delivery.",
      ctaUrl: process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL || "https://eliteirrigation.com",
      ctaLabel: "Open Website",
    });

    return {
      ...result,
      sentBy: "sendGenericNotificationEmail",
    };
  },
});

export const sendRawTestEmail = action({
  args: {
    to: v.string(),
    subject: v.string(),
    html: v.string(),
    text: v.optional(v.string()),
  },
  handler: async (_ctx, { to, subject, html, text }) => {
    return await sendEmail({
      to,
      subject,
      html,
      text,
    });
  },
});
