// convex/crons.ts
import { cronJobs } from "convex/server";
import { api } from "./_generated/api";

const crons = cronJobs();

// send queued outbound every minute
crons.interval("process outbound queue", { minutes: 1 }, api.automations.processOutboundQueue, { limit: 20 });

// SLA watcher every 5 minutes
crons.interval("sla watcher", { minutes: 5 }, api.slaWatcher.run, { limit: 200 });

// estimate followups daily (approx every 6 hours check)
crons.interval("estimate followups", { hours: 6 }, api.followUps.runEstimateFollowUps, { limit: 200 });

// review requests hourly
crons.interval("review requests", { hours: 1 }, api.followUps.runReviewRequests, { limit: 200 });

// auto case-study drafts
crons.interval("auto case-study drafts", { hours: 2 }, api.caseStudyAutomation.run, { limit: 200 });

// compliance expiry check daily
crons.daily("compliance check", { hourUTC: 8, minuteUTC: 0 }, api.compliance.checkExpiry);

// configuration validation check daily
crons.daily("config validation", { hourUTC: 9, minuteUTC: 0 }, api.system.validateConfigDaily, { limit: 10 });

export default crons;