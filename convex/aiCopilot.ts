import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Get chat history for a user
export const getChatHistory = query({
  args: {
    userId: v.string(),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const conversations = await ctx.db
      .query("aiConversations")
      .withIndex("by_user", (q) =>
        q.eq("userId", args.userId).order("desc")
      )
      .first();

    if (!conversations) {
      return [];
    }

    const messages = conversations.messages.slice(-args.limit || conversations.messages.length);
    return messages;
  },
});

// Save a chat message
export const saveChatMessage = mutation({
  args: {
    userId: v.string(),
    role: v.string(),
    content: v.string(),
    context: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();

    // Get existing conversation
    const existing = await ctx.db
      .query("aiConversations")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .first();

    const newMessage = {
      role: args.role,
      content: args.content,
      timestamp: now,
    };

    if (existing) {
      // Update existing conversation
      await ctx.db.patch(existing._id, {
        messages: [...existing.messages, newMessage],
        updatedAt: now,
        context: args.context || existing.context,
      });
      return existing._id;
    } else {
      // Create new conversation
      const conversationId = await ctx.db.insert("aiConversations", {
        userId: args.userId,
        messages: [newMessage],
        context: args.context,
        createdAt: now,
        updatedAt: now,
      });
      return conversationId;
    }
  },
});

// Clear chat history for a user
export const clearChatHistory = mutation({
  args: {
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("aiConversations")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, {
        messages: [],
        updatedAt: Date.now(),
      });
    }
  },
});

// Generate AI response (keyword-based for now)
export const generateAIResponse = mutation({
  args: {
    message: v.string(),
    context: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { message, context } = args;
    const lowerMessage = message.toLowerCase();

    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Keyword-based responses
    if (lowerMessage.includes('lead') || lowerMessage.includes('crm')) {
      return `Here's what I found for leads:

**New Leads Today:** 5
**Total Active Leads:** 48
**Hot Leads:** 12

Top priorities:
• 3 leads need follow-up within 2 hours
• 2 high-value estimates pending review
• 1 lead from Ring 1 ready to schedule

Would you like me to pull details on any specific lead?`;
    }

    if (lowerMessage.includes('schedule') || lowerMessage.includes('appointment') || lowerMessage.includes('calendar')) {
      return `**Today's Schedule Overview:**

• 8 appointments scheduled
• 3 crews active
• 2 time-sensitive requests

**Upcoming:**
• 9:00 AM - Irrigation repair (123 Main St)
• 11:00 AM - Spring activation startup (456 Oak Ave)
• 2:00 PM - Drainage consultation (789 Pine Rd)

**Alerts:**
• 1 crew running 30 min behind
• 2 pending reschedule requests

Need me to adjust anything?`;
    }

    if (lowerMessage.includes('report') || lowerMessage.includes('analytics') || lowerMessage.includes('stats')) {
      return `**Quick Analytics Report:**

**Revenue (MTD):** $142,000 (+12% vs last month)
**Conversion Rate:** 34%
**Avg Response Time:** 2.4 hours

**Top Performing Services:**
1. Spring Activation - $45,200
2. Irrigation Repair - $28,500
3. Drainage Installation - $21,800

**Crew Performance:**
• Alpha Crew: 98% on-time rate
• Beta Crew: 94% on-time rate
• Gamma Crew: 91% on-time rate

Want me to dive deeper into any metric?`;
    }

    if (lowerMessage.includes('help') || lowerMessage.includes('command') || lowerMessage.includes('what can you do')) {
      return `I can help you with:

**Data & Reports:**
• "Show me leads" - View lead pipeline
• "Today's schedule" - See appointments
• "Generate report" - Get analytics
• "Crew status" - Check team availability

**Actions:**
• "Create work order" - Start a new job
• "Schedule appointment" - Book a slot
• "Approve estimate" - Review pending estimates
• "Check compliance" - View license status

**Quick Info:**
• "Weather forecast" - Check conditions
• "Route status" - See crew locations
• "Inventory levels" - Check parts availability

Just ask me anything!`;
    }

    if (lowerMessage.includes('crew') || lowerMessage.includes('staff') || lowerMessage.includes('team')) {
      return `**Crew Status Overview:**

**Alpha Crew** (Foreman: Mike)
• Status: On route in Ring 2
• Jobs today: 6
• Current: 456 Oak Ave

**Beta Crew** (Foreman: Sarah)
• Status: On route in Ring 1
• Jobs today: 5
• Running 30 min behind

**Gamma Crew** (Foreman: Carlos)
• Status: Between jobs
• Jobs today: 4
• Next: 789 Pine Rd @ 2:00 PM

All crews have adequate inventory and equipment.
2 reschedule requests pending approval.`;
    }

    if (lowerMessage.includes('weather') || lowerMessage.includes('forecast')) {
      return `**Weather Impact Analysis:**

**Today:** 72°F, Partly cloudy
**Wind:** 8-12 mph (good for spraying)
**Precipitation:** 0% chance

**Tomorrow:** 68°F, Light rain expected 2-4 PM
**Impact:** Schedule outdoor work before noon

**Recommendation:**
• Move irrigation audits to morning
• Spring activations safe to continue
• Drainage work can proceed

Would you like me to suggest schedule adjustments?`;
    }

    if (lowerMessage.includes('route') || lowerMessage.includes('density')) {
      return `**Route Density Analysis:**

**Ring 1 (0-5 miles):** High Priority
• 8 active jobs
• 3 new leads
• Optimal for Alpha Crew tomorrow

**Ring 2 (5-10 miles):** Medium Priority
• 5 active jobs
• 2 new leads
• Beta Crew covering today

**Ring 3 (10-15 miles):** Low Priority
• 2 active jobs
• 1 new lead
• Consider batching for Thursday

**Efficiency Tip:** Schedule 2 more Ring 1 jobs for tomorrow to maximize Alpha Crew's route efficiency.`;
    }

    if (lowerMessage.includes('compliance') || lowerMessage.includes('license') || lowerMessage.includes('cert')) {
      return `**Compliance Status:**

**✓ Pesticide Applicator License**
• Expires: 22 days
• Status: Action needed
• Renew via: NC Agriculture Portal

**✓ Irrigation Contractor License**
• Expires: 180 days
• Status: Valid

**✓ Backflow Tester Certification**
• Expires: 45 days
• Status: Valid

**⚠ Backflow Registry Sync**
• Last sync: Today 6:00 AM
• Status: Active

**Action Required:** Initiate pesticide license renewal this week to avoid lapse.`;
    }

    if (lowerMessage.includes('inventory') || lowerMessage.includes('parts') || lowerMessage.includes('stock')) {
      return `**Inventory Status:**

**Low Stock Alerts:**
• Sprinkler Heads (Hunter PGP): 12 units (min: 20)
• 1" PVC Fittings: 45 units (min: 50)
• Irrigation Wire: 3 rolls (min: 5)

**Well Stocked:**
• Rain Sensors: 85 units
• Controller Modules: 24 units
• Nozzles (various): 200+ units

**On Order:**
• Sprinkler Heads - ETA: Friday
• PVC Fittings - ETA: Thursday

**Recommendation:** Approve reorder for sprinkler heads and PVC fittings today to prevent stockouts.`;
    }

    // Default response
    return `I understand you're asking about "${message}".

Based on current context (${context || 'dashboard'}), I can help you with:

• **Leads & CRM** - View and manage customer leads
• **Schedule** - Check appointments and crew availability
• **Reports** - Generate analytics and performance data
• **Routes** - Optimize crew scheduling and density
• **Compliance** - Monitor licenses and certifications
• **Inventory** - Check parts and equipment levels

Try asking "help" to see all available commands, or be more specific about what you'd like to know!`;
  },
});
