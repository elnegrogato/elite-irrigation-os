type EventName =
  | "call_click"
  | "sms_click"
  | "outdoor_list_started"
  | "outdoor_list_submitted"
  | "quote_started"
  | "quote_service_selected"
  | "quote_step_completed"
  | "quote_submitted"
  | "photo_upload_started"
  | "photo_upload_completed"
  | "drainage_assessment_submitted"
  | "facility_review_submitted"
  | "board_report_interest_clicked"
  | "maintenance_plan_clicked"
  | "guide_downloaded"
  | "guide_interest_clicked"
  | "qr_landing_viewed"
  | "project_gallery_filter_used"
  | "commercial_inquiry_submitted"
  | "emergency_sprinkler_clicked"
  | "partner_inquiry_submitted"
  | "contact_form_submitted"
  | "issue_review_started"
  | "issue_review_submitted"
  | "property_issue_submitted"
  | "post_storm_inspection_requested"
  | "site_review_requested"
  | "property_review_requested";

interface AnalyticsEvent {
  event: EventName;
  properties?: Record<string, string | number | boolean>;
  timestamp?: string;
}

const ANALYTICS_ENABLED = typeof window !== "undefined" && !!window.dataLayer;

function getOrCreateQueue(): AnalyticsEvent[] {
  if (typeof window === "undefined") return [];
  if (!Array.isArray((window as any).__eq)) {
    (window as any).__eq = [];
  }
  return (window as any).__eq;
}

export function trackEvent(event: EventName, properties?: Record<string, string | number | boolean>): void {
  const payload: AnalyticsEvent = {
    event,
    properties: properties || {},
    timestamp: new Date().toISOString(),
  };

  getOrCreateQueue().push(payload);

  if (ANALYTICS_ENABLED) {
    (window as any).dataLayer.push(payload);
  }

  if (process.env.NODE_ENV === "development") {
    console.log("[analytics]", event, properties);
  }
}

export function trackPageView(path: string): void {
  trackEvent("qr_landing_viewed" as EventName, { path });
}

export function getEventQueue(): AnalyticsEvent[] {
  return getOrCreateQueue();
}

declare global {
  interface Window {
    dataLayer?: any[];
  }
}
