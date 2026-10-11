// convex/http.ts
import { httpRouter } from "convex/server";
import { httpAction } from "convex/server";
import { api } from "./_generated/api";
import { normalizePhone, inferUrgencyFromText, inferIntent, inferEntityType, defaultSla } from "./lib/normalize";
import Stripe from "stripe";
import { getStripe } from "./lib/stripe";
import { validateOrThrow } from "./lib/validation";

// Helper: Twilio sends application/x-www-form-urlencoded
function parseForm(body: string) {
  const params = new URLSearchParams(body);
  const obj: Record<string, string> = {};
  params.forEach((v, k) => (obj[k] = v));
  return obj;
}

// Minimal TwiML response helper
function twiml(xmlBody: string) {
  return new Response(xmlBody, { headers: { "Content-Type": "text/xml" } });
}

const twilioSms = httpAction(async (ctx, req) => {
  const raw = await req.text();
  const f = parseForm(raw);

  const from = normalizePhone(f.From);
  const body = f.Body ?? "";

  const urgency = inferUrgencyFromText(body);
  const intent = inferIntent(undefined, body);
  const entityType = inferEntityType(body);

  await ctx.runMutation(api.leads.createLead, {
    phone: from,
    surfaceHint: "sms",
    message: body,
    urgency,
    intent,
    entityType,
  });

  return twiml(`
<Response>
  <Message>Thanks — Elite received your message. If this is urgent (flooding / zone won’t stop), reply URGENT. Otherwise, share your city and what service you need.</Message>
</Response>`);
});

const twilioVoice = httpAction(async (ctx, req) => {
  const raw = await req.text();
  const f = parseForm(raw);

  const from = normalizePhone(f.From);
  const speech = f.SpeechResult ?? "";
  const digits = f.Digits ?? "";

  if (!speech && !digits) {
    return twiml(`
<Response>
  <Say voice="alice">Thanks for calling Elite Irrigation and Landscaping.</Say>
  <Say voice="alice">For sprinkler repair press 1. For drainage press 2. For hardscape press 3. For lighting press 4.</Say>
  <Gather input="dtmf speech" timeout="6" numDigits="1" action="/twilio/voice" method="POST">
    <Say voice="alice">You can also say: sprinkler repair, drainage, patio, or lighting.</Say>
  </Gather>
</Response>`);
  }

  let serviceSlug: string | undefined;
  const s = (speech || "").toLowerCase();

  if (digits === "1" || s.includes("sprink") || s.includes("irrig")) serviceSlug = "sprinkler-repair";
  else if (digits === "2" || s.includes("drain")) serviceSlug = "drainage-assessment";
  else if (digits === "3" || s.includes("paver") || s.includes("hardscape")) serviceSlug = "paver-patio-installation";
  else if (digits === "4" || s.includes("light")) serviceSlug = "landscape-lighting-installation";

  const urgency = inferUrgencyFromText(speech);
  const intent = inferIntent(serviceSlug, speech);
  const entityType = inferEntityType(speech);

  await ctx.runMutation(api.leads.createLead, {
    phone: from,
    surfaceHint: "phone",
    message: speech ? `Call transcript: ${speech}` : "Call captured via Twilio",
    urgency,
    intent,
    serviceSlug,
    entityType,
  });

  return twiml(`
<Response>
  <Say voice="alice">Thanks. We’ve captured your request. We'll text you shortly.</Say>
</Response>`);
});

const stripeWebhook = httpAction(async (ctx, req) => {
  const sig = req.headers.get("stripe-signature");
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!sig || !secret) return new Response("Missing signature/secret", { status: 400 });

  const rawBody = await req.text();
  const stripe = getStripe();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, secret);
  } catch (err: any) {
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const invoiceId = session.metadata?.invoiceId;
    const paymentIntent = session.payment_intent;

    const payerEmail =
      session.customer_details?.email ||
      (typeof session.customer_email === "string" ? session.customer_email : undefined);

    if (invoiceId) {
      // Use the payments module to handle partials/deposits correctly
      await ctx.runMutation(api.payments.recordStripePayment, {
        invoiceId: invoiceId as any,
        stripeSessionId: session.id,
        stripePaymentIntentId: typeof paymentIntent === "string" ? paymentIntent : undefined,
        payerEmail: payerEmail ?? undefined,
        amount: (session.amount_total ?? 0) / 100,
      });
    }
  }

  return new Response("ok", { status: 200 });
});

const http = httpRouter();

// Health check endpoint
const healthCheck = httpAction(async (ctx, req) => {
  try {
    // Validate configuration on health check
    validateOrThrow();

    const health = await ctx.runQuery(api.system.getHealthOverview);

    return new Response(JSON.stringify(health), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    return new Response(
      JSON.stringify({
        status: "unhealthy",
        error: error.message,
      }),
      {
        status: 503,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
});

http.route({
  path: "/health",
  method: "GET",
  handler: healthCheck,
});

http.route({
  path: "/twilio/sms",
  method: "POST",
  handler: twilioSms,
});

http.route({
  path: "/twilio/voice",
  method: "POST",
  handler: twilioVoice,
});

http.route({
  path: "/stripe/webhook",
  method: "POST",
  handler: stripeWebhook,
});

export default http;
export { twilioSms, twilioVoice, stripeWebhook };