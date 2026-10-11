// src/pages/admin/LeadDetailDrawer.tsx
import { useQuery, useMutation, useAction } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { X, Phone, Mail, MapPin, MessageSquare } from 'lucide-react';

export default function LeadDetailDrawer(props: {
  open: boolean;
  onClose: () => void;
  lead: any | null;
  onMoveStage: (to: string) => Promise<void>;
}) {
  const addNote = useMutation(api.leads.addNote);
  const sendSmsNow = useAction(api.messages.sendSmsNow);

  const events = useQuery(api.events.listForLead, props.lead?._id ? { leadId: props.lead._id, limit: 100 } : "skip" as any) ?? [];

  if (!props.open) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity" onClick={props.onClose} />
      <div className="absolute right-0 top-0 h-full w-full max-w-xl bg-white shadow-2xl transform transition-transform duration-300 flex flex-col">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex justify-between items-start bg-slate-50">
          <div>
             <h2 className="text-2xl font-serif font-bold text-slate-900">{props.lead?.name || "Loading..."}</h2>
             <div className="flex items-center gap-2 mt-2 text-xs font-bold uppercase tracking-widest text-slate-500">
                <span className="px-2 py-1 bg-white border border-slate-200 rounded-sm">{props.lead?.stage}</span>
                <span>•</span>
                <span>{props.lead?.urgency}</span>
             </div>
          </div>
          <button onClick={props.onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          {!props.lead ? (
            <div className="text-sm text-zinc-600">Loading…</div>
          ) : (
            <>
              {/* Contact Info & Quick Actions */}
              <div className="bg-slate-50 rounded-sm border border-slate-100 p-6">
                 <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                        <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Phone</div>
                        <div className="flex items-center text-sm font-bold text-slate-900">
                           <Phone className="w-3 h-3 mr-2" /> {props.lead.phone ?? "—"}
                        </div>
                    </div>
                    <div>
                        <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Email</div>
                        <div className="flex items-center text-sm font-bold text-slate-900">
                           <Mail className="w-3 h-3 mr-2" /> {props.lead.email ?? "—"}
                        </div>
                    </div>
                 </div>
                 
                 <div className="grid grid-cols-3 gap-3">
                    {props.lead.phone && (
                      <a href={`tel:${props.lead.phone}`} className="flex items-center justify-center py-2 bg-white border border-slate-200 rounded-sm text-xs font-bold uppercase tracking-wider hover:border-elite-500 hover:text-elite-600 transition-all">
                        <Phone className="w-3 h-3 mr-2" /> Call
                      </a>
                    )}
                    {props.lead.phone && (
                      <button 
                        onClick={async () => {
                          const body = `Elite here — we received your request. What city are you in, and is this sprinkler repair, drainage, patio, or lighting?`;
                          await sendSmsNow({ to: props.lead.phone, body, leadId: props.lead._id });
                          alert("SMS sent.");
                        }}
                        className="flex items-center justify-center py-2 bg-white border border-slate-200 rounded-sm text-xs font-bold uppercase tracking-wider hover:border-elite-500 hover:text-elite-600 transition-all"
                      >
                        <MessageSquare className="w-3 h-3 mr-2" /> SMS
                      </button>
                    )}
                    {props.lead.email && (
                      <a href={`mailto:${props.lead.email}`} className="flex items-center justify-center py-2 bg-white border border-slate-200 rounded-sm text-xs font-bold uppercase tracking-wider hover:border-elite-500 hover:text-elite-600 transition-all">
                        <Mail className="w-3 h-3 mr-2" /> Email
                      </a>
                    )}
                 </div>
              </div>

              <div className="p-4 bg-white rounded-sm border border-slate-200">
                <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Context</div>
                <div className="text-sm font-medium text-slate-700 mb-1">{props.lead.serviceSlug}</div>
                <div className="flex items-center text-sm text-slate-500">
                    <MapPin className="w-3 h-3 mr-2" /> {props.lead.locationSlug ?? "—"}
                </div>
              </div>

              {/* Message Body */}
              {props.lead.message && (
                <div className="bg-white border border-slate-200 p-4 rounded-sm shadow-sm">
                   <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Inquiry Message</div>
                   <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">{props.lead.message}</p>
                </div>
              )}

              {/* Pipeline Actions */}
              <div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3">Move Stage</div>
                <div className="grid grid-cols-3 gap-2">
                  {["contacted","inspected","estimated","booked","inProgress","completed"].map(s => (
                    <button
                      key={s}
                      onClick={() => props.onMoveStage(s)}
                      className="rounded-sm border border-slate-200 px-3 py-2 text-xs font-bold uppercase tracking-wider hover:bg-elite-50 hover:text-elite-700 hover:border-elite-200 transition-colors"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Notes */}
              <div className="bg-slate-50 p-4 border border-slate-200 rounded-sm">
                <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Add Internal Note</div>
                <textarea id="note" className="w-full bg-white border border-slate-200 p-3 text-sm rounded-sm focus:outline-none focus:border-elite-500" rows={3} placeholder="Type a note..." />
                <div className="flex justify-end mt-2">
                  <button
                    className="bg-slate-900 text-white px-4 py-2 text-xs font-bold uppercase tracking-widest rounded-sm hover:bg-slate-800"
                    onClick={async () => {
                      const el = document.getElementById("note") as HTMLTextAreaElement | null;
                      const note = el?.value?.trim();
                      if (!note) return;
                      await addNote({ leadId: props.lead._id, note });
                      el.value = "";
                    }}
                  >
                    Save Note
                  </button>
                </div>
              </div>

              {/* Timeline */}
              <div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-4">Activity Timeline</div>
                <div className="relative border-l-2 border-slate-100 ml-2 space-y-6 pb-2">
                  {events.map((e: any) => (
                    <div key={e._id} className="pl-6 relative">
                      <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-white border-2 border-slate-200"></div>
                      <div className="text-[10px] text-slate-400 mb-1">{new Date(e.ts).toLocaleString()}</div>
                      <div className="text-sm font-bold text-slate-900">{e.type} {e.direction ? `(${e.direction})` : ""}</div>
                      {e.payload?.note && <div className="mt-1 text-sm text-slate-600 bg-slate-50 p-2 rounded-sm border border-slate-100">{e.payload.note}</div>}
                      {e.payload?.body && <div className="mt-1 text-sm text-slate-600 italic">"{e.payload.body}"</div>}
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}