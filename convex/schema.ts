// convex/schema.ts
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  leads: defineTable({
    createdAt: v.number(),
    updatedAt: v.number(),
    name: v.optional(v.string()),
    phone: v.optional(v.string()),
    email: v.optional(v.string()),
    surface: v.string(),                 
    sourceHint: v.optional(v.string()),  
    referrer: v.optional(v.string()),
    utm: v.optional(v.any()),
    entityType: v.string(),              
    intent: v.string(),                  
    urgency: v.optional(v.string()),     
    serviceSlug: v.optional(v.string()),
    locationSlug: v.optional(v.string()),
    addressText: v.optional(v.string()),
    message: v.optional(v.string()),
    photos: v.optional(v.array(v.object({ url: v.string(), caption: v.optional(v.string()) }))),
    stage: v.string(),                   
    respondBy: v.number(),               
    estimateBy: v.optional(v.number()),  
    assignedTo: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
    lastInboundAt: v.optional(v.number()),
    lastOutboundAt: v.optional(v.number()),
  })
    .index("by_stage", ["stage"])
    .index("by_surface", ["surface"])
    .index("by_assigned", ["assignedTo"])
    .index("by_phone", ["phone"])
    .index("by_createdAt", ["createdAt"]),

  events: defineTable({
    ts: v.number(),
    leadId: v.id("leads"),
    type: v.string(),
    direction: v.optional(v.string()),
    payload: v.any(),
  })
    .index("by_lead", ["leadId", "ts"])
    .index("by_ts", ["ts"])
    .index("by_type", ["type"]),

  appointments: defineTable({
    leadId: v.id("leads"),
    createdAt: v.number(),
    scheduledFor: v.number(),
    windowMins: v.number(),
    status: v.string(),
    crewId: v.optional(v.string()),
    notes: v.optional(v.string()),
    locationSlug: v.optional(v.string()),
    addressText: v.optional(v.string()),
    serviceSlug: v.optional(v.string()),
    // Google Calendar integration
    googleCalendarEventId: v.optional(v.string()),
    calendarSyncedAt: v.optional(v.number()),
    calendarSyncStatus: v.string(), // "not_synced", "synced", "error"
  })
    .index("by_time", ["scheduledFor"])
    .index("by_lead", ["leadId", "scheduledFor"])
    .index("by_sync_status", ["calendarSyncStatus", "scheduledFor"]),

  estimates: defineTable({
    leadId: v.id("leads"),
    createdAt: v.number(),
    updatedAt: v.number(),
    status: v.string(),
    items: v.array(v.object({
      sku: v.string(),
      name: v.string(),
      qty: v.number(),
      unit: v.string(),
      unitPrice: v.number(),
    })),
    total: v.number(),
    tierOptions: v.optional(v.array(v.object({
      tier: v.string(),
      total: v.number(),
      summary: v.string(),
    }))),
    expiresAt: v.optional(v.number()),
    notes: v.optional(v.string()),
  })
    .index("by_lead", ["leadId", "createdAt"])
    .index("by_status", ["status"]),

  outboundMessages: defineTable({
    createdAt: v.number(),
    updatedAt: v.number(),
    leadId: v.optional(v.id("leads")),
    channel: v.string(),
    to: v.string(),
    body: v.string(),
    status: v.string(),
    attempts: v.number(),
    lastError: v.optional(v.string()),
    scheduledFor: v.optional(v.number()),
    meta: v.optional(v.any()),

    // Email-specific tracking
    subject: v.optional(v.string()),
    templateType: v.optional(v.string()), // "estimate", "invoice", "reminder", "review", "welcome"

    // Delivery tracking (for emails)
    messageId: v.optional(v.string()), // Provider message ID
    deliveredAt: v.optional(v.number()),
    openedAt: v.optional(v.number()),
    clickedAt: v.optional(v.number()),
    bouncedAt: v.optional(v.number()),
    bounceReason: v.optional(v.string()),
  })
    .index("by_status", ["status", "createdAt"])
    .index("by_scheduled", ["scheduledFor"])
    .index("by_lead", ["leadId", "createdAt"])
    .index("by_channel", ["channel", "createdAt"]),

  policies: defineTable({
    key: v.string(),
    updatedAt: v.number(),
    updatedBy: v.optional(v.string()),
    value: v.any(),
  }).index("by_key", ["key"]),

  agentRuns: defineTable({
    ts: v.number(),
    agentName: v.string(),
    action: v.string(),
    status: v.string(),
    policyKey: v.optional(v.string()),
    leadId: v.optional(v.id("leads")),
    payload: v.any(),
    error: v.optional(v.string()),
  })
    .index("by_ts", ["ts"])
    .index("by_agent", ["agentName", "ts"])
    .index("by_lead", ["leadId", "ts"]),

  approvalRequests: defineTable({
    createdAt: v.number(),
    updatedAt: v.number(),
    kind: v.string(),
    entityId: v.optional(v.string()),
    leadId: v.optional(v.id("leads")),
    amount: v.number(),
    currency: v.string(),
    reason: v.string(),
    details: v.optional(v.any()),
    policyKey: v.optional(v.string()),
    threshold: v.optional(v.number()),
    status: v.string(),
    requestedBy: v.optional(v.string()),
    decidedBy: v.optional(v.string()),
    decidedAt: v.optional(v.number()),
    decisionNote: v.optional(v.string()),
  })
    .index("by_status", ["status", "createdAt"])
    .index("by_lead", ["leadId", "createdAt"])
    .index("by_kind", ["kind", "createdAt"]),

  caseStudies: defineTable({
    createdAt: v.number(),
    updatedAt: v.number(),
    serviceSlug: v.string(),
    locationSlug: v.string(),
    neighborSlugs: v.optional(v.array(v.string())),
    title: v.string(),
    summary: v.string(),
    scopeBullets: v.array(v.string()),
    outcomeBullets: v.array(v.string()),
    media: v.array(v.object({
      url: v.string(),
      kind: v.string(),
      caption: v.optional(v.string()),
    })),
    jobDate: v.optional(v.number()),
    tags: v.optional(v.array(v.string())),
    publish: v.boolean(),
    verifiedBy: v.optional(v.string()),
    verifiedAt: v.optional(v.number()),
  })
    .index("by_service_location", ["serviceSlug", "locationSlug", "createdAt"])
    .index("by_publish", ["publish", "createdAt"])
    .index("by_service", ["serviceSlug", "createdAt"])
    .index("by_location", ["locationSlug", "createdAt"]),

  workOrders: defineTable({
    createdAt: v.number(),
    updatedAt: v.number(),
    leadId: v.optional(v.id("leads")),
    estimateId: v.optional(v.id("estimates")),
    serviceSlug: v.string(),
    locationSlug: v.optional(v.string()),
    addressText: v.optional(v.string()),
    priority: v.string(),
    category: v.string(),
    status: v.string(),
    assignedTo: v.optional(v.string()),
    scheduledFor: v.optional(v.number()),
    windowMins: v.optional(v.number()),
    scope: v.optional(v.array(v.string())),
    notes: v.optional(v.string()),
    proofRequired: v.boolean(),
    proofComplete: v.boolean(),
    notToExceed: v.optional(v.number()),
    approvedBudget: v.optional(v.number()),
    managerOverrideClose: v.optional(v.boolean()),
    managerOverrideSchedule: v.optional(v.boolean()), // New override
    closedAt: v.optional(v.number()),
  })
    .index("by_status", ["status", "createdAt"])
    .index("by_lead", ["leadId", "createdAt"])
    .index("by_scheduled", ["scheduledFor"])
    .index("by_service_location", ["serviceSlug", "locationSlug", "createdAt"])
    .index("by_assigned", ["assignedTo", "updatedAt"]),

  workOrderMedia: defineTable({
    createdAt: v.number(),
    workOrderId: v.id("workOrders"),
    kind: v.string(),
    url: v.string(),
    storageId: v.optional(v.string()),
    caption: v.optional(v.string()),
  })
    .index("by_workorder", ["workOrderId", "createdAt"])
    .index("by_kind", ["kind", "createdAt"]),

  invoices: defineTable({
    createdAt: v.number(),
    updatedAt: v.number(),
    leadId: v.optional(v.id("leads")),
    workOrderId: v.optional(v.id("workOrders")),
    status: v.string(),
    subtotal: v.number(),
    tax: v.number(),
    total: v.number(),
    notes: v.optional(v.string()),

    // Stripe & Email
    stripeCustomerId: v.optional(v.string()),
    customerEmail: v.optional(v.string()),
    stripeSessionId: v.optional(v.string()),
    stripePaymentIntentId: v.optional(v.string()),
    paidAt: v.optional(v.number()),

    // Payments ledger
    amountPaid: v.optional(v.number()),
    balanceDue: v.optional(v.number()),

    // PDF
    pdfStorageId: v.optional(v.string()),
    pdfUrl: v.optional(v.string()),
  })
    .index("by_workorder", ["workOrderId", "createdAt"])
    .index("by_status", ["status", "createdAt"]),

  invoiceTokens: defineTable({
    createdAt: v.number(),
    updatedAt: v.number(),
    invoiceId: v.id("invoices"),
    token: v.string(),
    expiresAt: v.optional(v.number()),
    status: v.string(), 
  })
    .index("by_token", ["token"])
    .index("by_invoice", ["invoiceId", "createdAt"])
    .index("by_status", ["status", "createdAt"]),

  payments: defineTable({
    createdAt: v.number(),
    invoiceId: v.id("invoices"),
    leadId: v.optional(v.id("leads")),
    workOrderId: v.optional(v.id("workOrders")),
    amount: v.number(),
    currency: v.string(), // USD
    method: v.string(),   // "stripe"
    status: v.string(),   // "succeeded" | "failed"
    stripeSessionId: v.optional(v.string()),
    stripePaymentIntentId: v.optional(v.string()),
    payerEmail: v.optional(v.string()),
  })
    .index("by_invoice", ["invoiceId", "createdAt"])
    .index("by_status", ["status", "createdAt"]),

  complianceDocs: defineTable({
    createdAt: v.number(),
    updatedAt: v.number(),
    name: v.string(),
    type: v.string(), // License, Insurance, Registration, Certification
    identifier: v.optional(v.string()),
    expiryDate: v.number(),
    status: v.string(), // valid, expiring, expired
    storageId: v.optional(v.string()),
    fileUrl: v.optional(v.string()),
    notes: v.optional(v.string()),
  })
    .index("by_status", ["status"])
    .index("by_expiry", ["expiryDate"]),

  fleet: defineTable({
    createdAt: v.number(),
    updatedAt: v.number(),
    name: v.string(),
    type: v.string(), // "vehicle" | "trailer" | "equipment"
    status: v.string(), // "active" | "maintenance" | "out_of_service" | "retired"
    make: v.optional(v.string()),
    model: v.optional(v.string()),
    year: v.optional(v.number()),
    vin: v.optional(v.string()),
    licensePlate: v.optional(v.string()),
    assignedTo: v.optional(v.string()),
    currentReading: v.optional(v.number()), // mileage or hours
    readingType: v.optional(v.string()), // "miles" | "hours"
    purchaseDate: v.optional(v.number()),
    cost: v.optional(v.number()),
    notes: v.optional(v.string()),
    nextServiceDue: v.optional(v.number()), // timestamp
  }).index("by_type", ["type"]).index("by_status", ["status"]),

  maintenanceLogs: defineTable({
    createdAt: v.number(),
    fleetId: v.id("fleet"),
    date: v.number(),
    serviceType: v.string(), // "oil", "tires", "repair", "pm", "inspection"
    description: v.string(),
    cost: v.number(),
    vendor: v.optional(v.string()),
    readingAtService: v.optional(v.number()), // mileage/hours at time of service
    attachmentUrl: v.optional(v.string()),
  }).index("by_fleet", ["fleetId", "date"]),

  staff: defineTable({
    name: v.string(),
    role: v.string(), // "admin", "manager", "foreman", "tech", "labor"
    email: v.optional(v.string()),
    phone: v.optional(v.string()),
    status: v.string(), // "active", "inactive"
    joinedAt: v.number(),
  }).index("by_status", ["status"]),

  crews: defineTable({
    name: v.string(),
    color: v.string(),
    foremanId: v.optional(v.id("staff")),
    memberIds: v.array(v.id("staff")),
    fleetId: v.optional(v.id("fleet")),
    active: v.boolean(),
  }).index("by_active", ["active"]),

  inventory: defineTable({
    name: v.string(),
    sku: v.string(),
    category: v.string(), // Irrigation, Lighting, Drainage, Hardscape, Bulk, Tools
    description: v.optional(v.string()),
    onHand: v.number(),
    minLevel: v.optional(v.number()),
    unit: v.string(), // ea, ft, roll, bag
    cost: v.number(),
    price: v.number(),
    binLocation: v.optional(v.string()),
    supplier: v.optional(v.string()),
    updatedAt: v.number(),
  })
    .index("by_category", ["category"])
    .index("by_sku", ["sku"]),

  // Authentication tables
  users: defineTable({
    name: v.string(),
    email: v.string(),
    phone: v.optional(v.string()),
    passwordHash: v.string(),
    passwordSalt: v.string(),
    passwordChangedAt: v.optional(v.number()),
    failedLoginAttempts: v.optional(v.number()),
    lockedUntil: v.optional(v.number()),
    role: v.string(), // "admin" | "manager" | "foreman" | "tech"
    status: v.string(), // "active" | "inactive" | "suspended"
    createdAt: v.number(),
    updatedAt: v.optional(v.number()),
    // Google Calendar integration
    googleCalendarConnected: v.boolean(),
    googleCalendarAccessToken: v.optional(v.string()),
    googleCalendarRefreshToken: v.optional(v.string()),
    googleCalendarTokenExpiry: v.optional(v.number()),
    calendarAutoSync: v.boolean(),
  })
    .index("by_email", ["email"])
    .index("by_status", ["status"]),

  sessions: defineTable({
    userId: v.id("users"),
    token: v.string(),
    expiresAt: v.number(),
    createdAt: v.number(),
    lastActiveAt: v.number(),
    ipAddress: v.optional(v.string()),
    userAgent: v.optional(v.string()),
  })
    .index("by_token", ["token"])
    .index("by_user", ["userId"])
    .index("by_expiresAt", ["expiresAt"]),

  rateLimits: defineTable({
    identifier: v.string(),
    action: v.string(),
    timestamp: v.number(),
    metadata: v.optional(v.any()),
  })
    .index("by_identifier_action", ["identifier", "action"])
    .index("by_timestamp", ["timestamp"]),

  blockedIPs: defineTable({
    ip: v.string(),
    reason: v.string(),
    expiresAt: v.optional(v.number()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_ip", ["ip"]),

  auditLogs: defineTable({
    action: v.string(),
    userId: v.optional(v.id("users")),
    details: v.optional(v.any()),
    severity: v.string(),
    ipAddress: v.optional(v.string()),
    userAgent: v.optional(v.string()),
    resourceId: v.optional(v.string()),
    timestamp: v.number(),
  })
    .index("by_user", ["userId", "timestamp"])
    .index("by_action", ["action", "timestamp"])
    .index("by_severity", ["severity", "timestamp"])
    .index("by_timestamp", ["timestamp"]),

  emailPreferences: defineTable({
    leadId: v.id("leads"),
    createdAt: v.number(),
    updatedAt: v.number(),

    // Email categories - true means they WANT to receive these emails
    estimates: v.boolean(), // Estimate notifications
    invoices: v.boolean(), // Invoice and payment reminders
    reminders: v.boolean(), // Appointment reminders
    promotions: v.boolean(), // Promotional emails
    reviews: v.boolean(), // Review requests

    // Global unsubscribe
    unsubscribed: v.boolean(),
    unsubscribedAt: v.optional(v.number()),

    // Email engagement tracking
    lastOpenedAt: v.optional(v.number()),
    lastClickedAt: v.optional(v.number()),
    totalEmailsSent: v.number(),
    totalEmailsOpened: v.number(),
  })
    .index("by_lead", ["leadId"])
    .index("by_unsubscribed", ["unsubscribed"]),

  // AI Copilot conversations
  aiConversations: defineTable({
    userId: v.string(),
    messages: v.array(v.object({
      role: v.string(), // "user" | "assistant"
      content: v.string(),
      timestamp: v.number(),
    })),
    context: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_user", ["userId", "updatedAt"]),

  // System health and configuration tracking
  systemHealth: defineTable({
    type: v.string(), // "config_validation", "api_test", etc.
    timestamp: v.number(),
    valid: v.optional(v.boolean()),
    errors: v.optional(v.array(v.string())),
    warnings: v.optional(v.array(v.string())),
    missing: v.optional(v.array(v.string())),
    environment: v.optional(v.string()),
  })
    .index("by_type", ["type", "timestamp"])
    .index("by_timestamp", ["timestamp"]),

  // Route optimization tables
  routes: defineTable({
    createdAt: v.number(),
    updatedAt: v.number(),
    crewId: v.optional(v.string()),
    date: v.number(), // Unix timestamp for the route date
    name: v.string(),
    status: v.string(), // "draft", "active", "completed", "cancelled"

    // Route data
    stops: v.array(v.object({
      id: v.string(),
      name: v.string(),
      latitude: v.number(),
      longitude: v.number(),
      address: v.optional(v.string()),
      order: v.number(),
      estimatedArrival: v.number(),
      estimatedDeparture: v.number(),
      serviceTime: v.number(),
      priority: v.number(),
      timeWindowStart: v.optional(v.number()),
      timeWindowEnd: v.optional(v.number()),
      leadId: v.optional(v.id("leads")),
      workOrderId: v.optional(v.id("workOrders")),
      appointmentId: v.optional(v.string()),
    })),

    // Optimization data
    isOptimized: v.boolean(),
    optimizationScore: v.number(),
    manualOverride: v.boolean(),
    totalDistance: v.number(), // miles
    totalTravelTime: v.number(), // minutes
    totalServiceTime: v.number(), // minutes

    // Start/end locations
    startLatitude: v.optional(v.number()),
    startLongitude: v.optional(v.number()),
    endLatitude: v.optional(v.number()),
    endLongitude: v.optional(v.number()),

    // Metadata
    notes: v.optional(v.string()),
    createdBy: v.optional(v.string()),
    completedAt: v.optional(v.number()),
  })
    .index("by_date", ["date"])
    .index("by_crew", ["crewId", "date"])
    .index("by_status", ["status", "date"]),

  optimizationSuggestions: defineTable({
    createdAt: v.number(),
    updatedAt: v.number(),
    crewId: v.optional(v.string()),
    date: v.number(),
    status: v.string(), // "pending", "accepted", "rejected", "expired"

    // Original route data
    originalRouteId: v.optional(v.id("routes")),
    originalStops: v.array(v.id("leads")),

    // Suggested optimization
    suggestedRoute: v.array(v.object({
      id: v.string(),
      name: v.string(),
      latitude: v.number(),
      longitude: v.number(),
      order: v.number(),
      estimatedArrival: v.number(),
      estimatedDeparture: v.number(),
    })),

    // Metrics comparison
    originalDistance: v.number(),
    originalTime: v.number(),
    suggestedDistance: v.number(),
    suggestedTime: v.number(),
    improvementPercent: v.number(),

    // Decision tracking
    reviewedAt: v.optional(v.number()),
    reviewedBy: v.optional(v.string()),
    rejectionReason: v.optional(v.string()),
  })
    .index("by_date", ["date"])
    .index("by_crew", ["crewId", "date"])
    .index("by_status", ["status", "createdAt"]),

  routeAnalytics: defineTable({
    date: v.number(),
    crewId: v.optional(v.string()),

    // Daily metrics
    totalRoutes: v.number(),
    totalStops: v.number(),
    totalDistance: v.number(),
    totalTravelTime: v.number(),
    totalServiceTime: v.number(),

    // Averages
    avgStopsPerRoute: v.number(),
    avgTravelTime: v.number(),
    avgServiceTime: v.number(),
    avgEfficiencyScore: v.number(),

    // Optimization metrics
    optimizedRoutes: v.number(),
    manualRoutes: v.number(),
    avgOptimizedScore: v.number(),
    avgManualScore: v.number(),

    // Performance
    onTimeArrivals: v.number(),
    timeWindowViolations: v.number(),

    createdAt: v.number(),
  })
    .index("by_date", ["date"])
    .index("by_crew", ["crewId", "date"]),
});
