// src/pages/admin/InvoicesPage.tsx
import AdminLayout from "./AdminLayout";
import { useAction, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useState } from "react";
import { Mail, MessageSquare } from "lucide-react";

export default function InvoicesPage() {
  const [status, setStatus] = useState("draft");
  const rows = useQuery(api.invoices.listByStatus, { status, limit: 200 }) ?? [];

  const sendInvoiceSms = useAction(api.invoiceSend.sendInvoiceSms);
  const sendInvoiceEmail = useAction(api.emails.sendInvoice);
  const genPdf = useAction(api.invoicePdf.generateInvoicePdf);
  const [sendingEmail, setSendingEmail] = useState<string | null>(null);

  const handleSendEmail = async (invoiceId: string, paymentUrl?: string) => {
    setSendingEmail(invoiceId);
    try {
      const result: any = await sendInvoiceEmail({ invoiceId, paymentUrl });
      if (result.skipped) {
        alert("Email not sent: Lead has unsubscribed from invoice emails");
      } else if (result.success) {
        alert("Invoice email sent successfully!");
      } else {
        alert("Failed to send email: " + result.error);
      }
    } catch (e: any) {
      alert("Error: " + e.message);
    } finally {
      setSendingEmail(null);
    }
  };

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-serif font-bold text-slate-900">Invoices</h1>
        <select className="rounded-sm border border-slate-200 p-2 text-sm focus:border-elite-500 outline-none" value={status} onChange={(e) => setStatus(e.target.value)}>
          {["draft","sent","partially_paid","paid","void"].map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      <div className="space-y-3">
        {rows.map((inv: any) => (
          <div key={inv._id} className="rounded-sm border border-slate-200 bg-white p-6 shadow-sm hover:border-elite-300 transition-colors">
            <div className="flex justify-between items-start">
               <div>
                  <div className="text-sm font-bold text-slate-900 flex items-center gap-2">
                     <span>Invoice #{inv._id.slice(-6)}</span>
                     <span className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-sm border ${inv.status === 'paid' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-slate-50 text-slate-500 border-slate-200'}`}>
                        {inv.status}
                     </span>
                  </div>
                  <div className="text-lg font-serif font-bold text-slate-900 mt-1">${inv.total.toFixed(2)}</div>
                  {inv.balanceDue > 0 && inv.balanceDue < inv.total && (
                      <div className="text-xs text-amber-600 font-bold mt-1">Balance: ${inv.balanceDue.toFixed(2)}</div>
                  )}
               </div>
               <div className="text-right text-xs text-slate-500">
                  <div>Lead: {inv.leadId ?? "—"}</div>
                  <div>WO: {inv.workOrderId ?? "—"}</div>
               </div>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-50 flex justify-end gap-3 flex-wrap">
              <button
                className="rounded-sm border border-slate-200 px-3 py-2 text-xs font-bold uppercase tracking-widest hover:bg-slate-50 transition-colors"
                onClick={async () => {
                    const res: any = await genPdf({ invoiceId: inv._id });
                    alert(`PDF Generated.`);
                }}
              >
                Gen PDF
              </button>

              {inv.pdfUrl && (
                  <a
                    className="rounded-sm border border-slate-200 px-3 py-2 text-xs font-bold uppercase tracking-widest hover:bg-slate-50 transition-colors text-slate-700"
                    href={inv.pdfUrl} target="_blank" rel="noreferrer"
                  >
                    Open PDF
                  </a>
              )}

              {inv.status !== "paid" ? (
                <>
                  <button
                    className={`rounded-sm px-4 py-2 text-xs font-bold uppercase tracking-widest transition-colors flex items-center gap-2
                      ${sendingEmail === inv._id
                        ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                        : 'bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100'}`}
                    onClick={() => handleSendEmail(inv._id, inv.pdfUrl)}
                    disabled={sendingEmail === inv._id}
                  >
                    {sendingEmail === inv._id ? (
                      <>Sending...</>
                    ) : (
                      <>
                        <Mail className="w-3 h-3" /> Email Invoice
                      </>
                    )}
                  </button>
                  <button
                    className="rounded-sm bg-elite-900 text-white px-4 py-2 text-xs font-bold uppercase tracking-widest hover:bg-elite-800 transition-colors flex items-center gap-2"
                    onClick={async () => {
                      try {
                          const res: any = await sendInvoiceSms({ invoiceId: inv._id });
                          alert(`Sent invoice link via SMS.`);
                      } catch(e: any) {
                          alert("Failed to send: " + e.message);
                      }
                    }}
                  >
                    <MessageSquare className="w-3 h-3" /> SMS Invoice
                  </button>
                </>
              ) : (
                  <span className="text-xs text-emerald-600 font-bold uppercase tracking-widest flex items-center px-4 py-2">
                      Paid on {new Date(inv.paidAt).toLocaleDateString()}
                  </span>
              )}
            </div>
          </div>
        ))}
        {rows.length === 0 && (
            <div className="p-12 text-center text-slate-400 text-sm border border-dashed border-slate-200 rounded-sm">
                No invoices in '{status}' status.
            </div>
        )}
      </div>
    </AdminLayout>
  );
}