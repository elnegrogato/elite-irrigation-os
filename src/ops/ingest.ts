// src/ops/ingest.ts
import { normalizeSurface, type UTM } from "./utm";
import type { Lead, CrmEvent } from "./crmSchema";
import type { LeadEntityType, LeadIntent } from "./sources";

// naive id generator (replace later)
const id = () => Math.random().toString(36).slice(2);

function now() { return Date.now(); }

function defaultSla(urgency: Lead["urgency"]) {
  const t = now();
  const mins = urgency === "emergency" ? 10 : urgency === "high" ? 30 : 60;
  return { respondBy: t + mins * 60 * 1000, estimateBy: t + 24 * 60 * 60 * 1000 };
}

export type IngestInput = {
  sourceHint?: string;
  referrer?: string;
  utm?: UTM;
  name?: string;
  phone?: string;
  email?: string;
  message?: string;
  serviceSlug?: string;
  locationSlug?: string;
  addressText?: string;
  urgency?: Lead["urgency"];
  entityType?: LeadEntityType;
  intent?: LeadIntent;
  photos?: Lead["photos"];
  raw?: Record<string, any>;
};

export function ingestLead(input: IngestInput): { lead: Lead; events: CrmEvent[] } {
  const surface = normalizeSurface(input.utm ?? {}, input.referrer);
  const leadId = id();
  const createdAt = now();

  const lead: Lead = {
    id: leadId,
    createdAt,
    updatedAt: createdAt,
    name: input.name,
    phone: input.phone,
    email: input.email,
    surface,
    utm: input.utm,
    referrer: input.referrer,
    entityType: input.entityType ?? "unknown",
    intent: input.intent ?? "unknown",
    serviceSlug: input.serviceSlug,
    locationSlug: input.locationSlug,
    addressText: input.addressText,
    urgency: input.urgency ?? "medium",
    notes: input.message,
    photos: input.photos,
    stage: "lead",
    sla: defaultSla(input.urgency ?? "medium"),
  };

  const events: CrmEvent[] = [
    { id: id(), ts: createdAt, leadId, type: "stage_change", from: "intent", to: "lead", by: "system" },
  ];

  if (input.message) {
    events.push({ id: id(), ts: createdAt, leadId, type: "form_submit", fields: { message: input.message, ...(input.raw ?? {}) } });
  }

  return { lead, events };
}