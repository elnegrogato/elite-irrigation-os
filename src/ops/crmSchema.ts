// src/ops/crmSchema.ts
import type { LeadSurface, LeadIntent, LeadEntityType } from "./sources";
import type { UTM } from "./utm";

export type LeadStage =
  | "awareness"
  | "interest"
  | "consideration"
  | "intent"
  | "lead"
  | "contacted"
  | "inspected"
  | "estimated"
  | "booked"
  | "inProgress"
  | "completed"
  | "reviewed"
  | "member_referrer";

export type Lead = {
  id: string;
  createdAt: number;
  updatedAt: number;

  // Identity
  name?: string;
  phone?: string;
  email?: string;

  // Context
  surface: LeadSurface;
  utm?: UTM;
  referrer?: string;

  // Qualification
  entityType: LeadEntityType;
  intent: LeadIntent;
  serviceSlug?: string;
  locationSlug?: string;
  addressText?: string;
  urgency?: "low" | "medium" | "high" | "emergency";

  // Enrichment
  notes?: string;
  photos?: Array<{ url: string; caption?: string }>;

  // Pipeline
  stage: LeadStage;
  sla: {
    respondBy: number; // timestamp
    estimateBy?: number;
  };

  // Ownership
  assignedTo?: string; // user id
  tags?: string[];
};

export type CrmEvent =
  | { id: string; ts: number; leadId: string; type: "web_view"; path: string; }
  | { id: string; ts: number; leadId: string; type: "form_submit"; fields: Record<string, any>; }
  | { id: string; ts: number; leadId: string; type: "chat_message"; direction: "in" | "out"; text: string; }
  | { id: string; ts: number; leadId: string; type: "sms"; direction: "in" | "out"; text: string; }
  | { id: string; ts: number; leadId: string; type: "email"; direction: "in" | "out"; subject: string; snippet: string; }
  | { id: string; ts: number; leadId: string; type: "call"; direction: "in" | "out"; durationSec?: number; recordingUrl?: string; transcript?: string; }
  | { id: string; ts: number; leadId: string; type: "stage_change"; from: LeadStage; to: LeadStage; by: "human" | "agent" | "system"; };

export type Appointment = {
  id: string;
  leadId: string;
  scheduledFor: number;
  windowMins: number;
  status: "proposed" | "confirmed" | "completed" | "canceled";
  crewId?: string;
  notes?: string;
};

export type Estimate = {
  id: string;
  leadId: string;
  createdAt: number;
  status: "draft" | "sent" | "accepted" | "rejected" | "expired";
  items: Array<{ sku: string; name: string; qty: number; unit: string; unitPrice: number }>;
  total: number;
  goodBetterBest?: Array<{ tier: "Good" | "Better" | "Best" | "Elite"; total: number; summary: string }>;
};