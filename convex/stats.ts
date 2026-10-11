// convex/stats.ts
import { query } from "convex/server";
import { v } from "convex/values";
import { requireRoleQuery } from "./lib/authMiddleware";

export const getDashboardStats = query({
  args: { token: v.string() },
  handler: requireRoleQuery(["admin", "manager", "foreman"], async (ctx) => {
    const now = Date.now();
    const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1).getTime();
    
    // 1. Revenue (Paid Invoices this month)
    const invoices = await ctx.db.query("invoices").order("desc").take(500);
    const paidInvoices = invoices.filter(i => i.status === "paid" && i.paidAt && i.paidAt >= startOfMonth);
    const revenue = paidInvoices.reduce((sum, inv) => sum + (inv.total ?? 0), 0);

    // 2. Active Leads (New this month)
    const leads = await ctx.db.query("leads").withIndex("by_createdAt").order("desc").take(500);
    const newLeads = leads.filter(l => l.createdAt >= startOfMonth);
    const activeLeadsCount = leads.filter(l => l.stage !== "completed" && l.stage !== "reviewed").length;

    // 3. Alerts
    const pendingApprovals = await ctx.db.query("approvalRequests").withIndex("by_status", q => q.eq("status", "pending")).collect();
    const failedMessages = await ctx.db.query("outboundMessages").withIndex("by_status", q => q.eq("status", "failed")).take(50);
    const urgentLeads = leads.filter(l => l.urgency === "emergency" && l.stage === "lead");
    
    // Compliance alerts
    const expiringDocs = await ctx.db.query("complianceDocs").withIndex("by_status", q => q.eq("status", "expiring")).collect();
    const expiredDocs = await ctx.db.query("complianceDocs").withIndex("by_status", q => q.eq("status", "expired")).collect();

    const alerts = [
      ...pendingApprovals.map(a => ({ id: a._id, type: "approval", msg: `${a.kind} approval needed: $${a.amount}` })),
      ...urgentLeads.map(l => ({ id: l._id, type: "urgent_lead", msg: `Emergency lead: ${l.name}` })),
      ...failedMessages.map(m => ({ id: m._id, type: "failed_sms", msg: `SMS failed to ${m.to}` })),
      ...expiringDocs.map(d => ({ id: d._id, type: "compliance_expiring", msg: `${d.name} expiring soon` })),
      ...expiredDocs.map(d => ({ id: d._id, type: "compliance_expired", msg: `${d.name} EXPIRED` })),
    ];

    // 4. Route Efficiency (Mock logic based on appt density)
    const efficiency = 92; 

    // 5. Chart Data (Last 6 months revenue mock)
    const chartData = [
      { name: 'May', revenue: 155000 },
      { name: 'Jun', revenue: 130000 },
      { name: 'Jul', revenue: 110000 },
      { name: 'Aug', revenue: 115000 },
      { name: 'Sep', revenue: 125000 },
      { name: 'Oct', revenue: Math.max(140000, revenue) }, 
    ];

    return {
      revenue,
      revenueGrowth: 12,
      newLeadsCount: newLeads.length,
      activeLeadsCount,
      efficiency,
      alerts: alerts.slice(0, 8), // Increased limit for alerts
      chartData
    };
  }),
});
