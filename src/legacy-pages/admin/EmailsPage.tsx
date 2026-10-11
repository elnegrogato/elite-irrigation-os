// src/pages/admin/EmailsPage.tsx
import { useState } from "react";
import AdminLayout from "./AdminLayout";
import { useQuery, useAction } from "convex/react";
import { api } from "../../../convex/_generated/api";
import {
  Mail,
  Send,
  CheckCircle,
  AlertCircle,
  Clock,
  RefreshCw,
  FileText,
  DollarSign,
  Calendar,
  Star,
  TrendingUp,
} from "lucide-react";

export default function EmailsPage() {
  const [filter, setFilter] = useState<string>("all");
  const [templateType, setTemplateType] = useState<string>("all");

  const emails = useQuery(api.emails.listEmails, { limit: 100, status: filter === "all" ? undefined : filter, templateType: templateType === "all" ? undefined : templateType }) ?? [];
  const stats = useQuery(api.emails.getEmailStats) ?? {
    sent: 0,
    delivered: 0,
    opened: 0,
    clicked: 0,
    bounced: 0,
    pending: 0,
    failed: 0,
  };
  const retryEmail = useAction(api.emails.retryEmail);
  const [retrying, setRetrying] = useState<string | null>(null);

  const handleRetry = async (messageId: string) => {
    setRetrying(messageId);
    try {
      const result: any = await retryEmail({ messageId });
      if (result.success) {
        alert("Email sent successfully!");
      } else {
        alert("Failed to send: " + result.error);
      }
    } catch (e: any) {
      alert("Error: " + e.message);
    } finally {
      setRetrying(null);
    }
  };

  const getTemplateIcon = (type?: string) => {
    switch (type) {
      case "estimate":
        return <FileText className="w-4 h-4" />;
      case "invoice":
        return <DollarSign className="w-4 h-4" />;
      case "reminder":
        return <Calendar className="w-4 h-4" />;
      case "review":
        return <Star className="w-4 h-4" />;
      default:
        return <Mail className="w-4 h-4" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const badges: Record<string, { className: string; icon: any; label: string }> = {
      sent: { className: "bg-emerald-50 text-emerald-700 border-emerald-100", icon: CheckCircle, label: "Sent" },
      delivered: { className: "bg-blue-50 text-blue-700 border-blue-100", icon: CheckCircle, label: "Delivered" },
      pending: { className: "bg-amber-50 text-amber-700 border-amber-100", icon: Clock, label: "Pending" },
      failed: { className: "bg-red-50 text-red-700 border-red-100", icon: AlertCircle, label: "Failed" },
      bounced: { className: "bg-red-50 text-red-700 border-red-100", icon: AlertCircle, label: "Bounced" },
    };

    const badge = badges[status] || badges.pending;
    const Icon = badge.icon;

    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 text-[10px] uppercase font-bold rounded-sm border ${badge.className}`}>
        <Icon className="w-3 h-3" /> {badge.label}
      </span>
    );
  };

  const openRate = stats.sent > 0 ? ((stats.opened / stats.sent) * 100).toFixed(1) : "0.0";
  const clickRate = stats.opened > 0 ? ((stats.clicked / stats.opened) * 100).toFixed(1) : "0.0";
  const deliveryRate = stats.sent > 0 ? ((stats.delivered / stats.sent) * 100).toFixed(1) : "0.0";

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-serif font-bold text-slate-900">Email Dashboard</h1>
            <p className="text-sm text-slate-500 mt-1">Track email delivery and engagement</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          <div className="rounded-sm border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Sent</span>
              <Send className="w-4 h-4 text-blue-500" />
            </div>
            <div className="text-2xl font-serif font-bold text-slate-900">{stats.sent}</div>
          </div>

          <div className="rounded-sm border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Delivered</span>
              <CheckCircle className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="text-2xl font-serif font-bold text-slate-900">{stats.delivered}</div>
            <div className="text-[10px] text-slate-400 mt-1">{deliveryRate}% rate</div>
          </div>

          <div className="rounded-sm border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Opened</span>
              <TrendingUp className="w-4 h-4 text-blue-500" />
            </div>
            <div className="text-2xl font-serif font-bold text-slate-900">{stats.opened}</div>
            <div className="text-[10px] text-slate-400 mt-1">{openRate}% rate</div>
          </div>

          <div className="rounded-sm border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Clicked</span>
              <TrendingUp className="w-4 h-4 text-purple-500" />
            </div>
            <div className="text-2xl font-serif font-bold text-slate-900">{stats.clicked}</div>
            <div className="text-[10px] text-slate-400 mt-1">{clickRate}% rate</div>
          </div>

          <div className="rounded-sm border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Pending</span>
              <Clock className="w-4 h-4 text-amber-500" />
            </div>
            <div className="text-2xl font-serif font-bold text-slate-900">{stats.pending}</div>
          </div>

          <div className="rounded-sm border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Failed</span>
              <AlertCircle className="w-4 h-4 text-red-500" />
            </div>
            <div className="text-2xl font-serif font-bold text-slate-900">{stats.failed + stats.bounced}</div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-3 flex-wrap">
          <select
            className="rounded-sm border border-slate-200 px-3 py-2 text-sm focus:border-elite-500 outline-none bg-white"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="sent">Sent</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
            <option value="bounced">Bounced</option>
          </select>

          <select
            className="rounded-sm border border-slate-200 px-3 py-2 text-sm focus:border-elite-500 outline-none bg-white"
            value={templateType}
            onChange={(e) => setTemplateType(e.target.value)}
          >
            <option value="all">All Types</option>
            <option value="estimate">Estimates</option>
            <option value="invoice">Invoices</option>
            <option value="reminder">Reminders</option>
            <option value="review">Reviews</option>
            <option value="welcome">Welcome</option>
          </select>
        </div>

        {/* Email List */}
        <div className="rounded-sm border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="grid grid-cols-12 gap-4 p-4 bg-slate-50 border-b border-slate-200 text-[10px] uppercase tracking-wider font-bold text-slate-500">
            <div className="col-span-1">Type</div>
            <div className="col-span-3">To</div>
            <div className="col-span-4">Subject</div>
            <div className="col-span-2">Status</div>
            <div className="col-span-2">Actions</div>
          </div>

          <div className="divide-y divide-slate-100">
            {emails.map((email: any) => (
              <div key={email._id} className="grid grid-cols-12 gap-4 p-4 hover:bg-slate-50 transition-colors items-center">
                <div className="col-span-1">
                  <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                    {getTemplateIcon(email.templateType)}
                  </div>
                </div>

                <div className="col-span-3">
                  <div className="text-sm font-medium text-slate-900 truncate">{email.to}</div>
                  <div className="text-[10px] text-slate-400">
                    {new Date(email.createdAt).toLocaleDateString()} {new Date(email.createdAt).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}
                  </div>
                </div>

                <div className="col-span-4">
                  <div className="text-sm text-slate-700 truncate">{email.subject}</div>
                  {email.templateType && (
                    <div className="text-[10px] text-slate-400 capitalize">{email.templateType}</div>
                  )}
                </div>

                <div className="col-span-2">
                  {getStatusBadge(email.status)}
                  {email.lastError && (
                    <div className="text-[9px] text-red-500 mt-1 truncate" title={email.lastError}>
                      {email.lastError}
                    </div>
                  )}
                </div>

                <div className="col-span-2 flex gap-2">
                  {(email.status === "failed" || email.status === "bounced") && (
                    <button
                      className="p-2 hover:bg-slate-100 rounded-sm text-slate-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={() => handleRetry(email._id)}
                      disabled={retrying === email._id}
                      title="Retry sending"
                    >
                      <RefreshCw className={`w-4 h-4 ${retrying === email._id ? 'animate-spin' : ''}`} />
                    </button>
                  )}
                  {email.messageId && (
                    <button
                      className="p-2 hover:bg-slate-100 rounded-sm text-slate-500 transition-colors"
                      title="View details"
                    >
                      <Mail className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}

            {emails.length === 0 && (
              <div className="p-12 text-center text-slate-400 text-sm">
                No emails found
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
