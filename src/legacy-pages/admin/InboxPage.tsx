// src/pages/admin/InboxPage.tsx
import { useState, useEffect, useRef } from "react";
import AdminLayout from "./AdminLayout";
import { useQuery, useAction } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { MessageSquare, Phone, MoreHorizontal, Send, User, Clock, CheckCircle2, AlertCircle } from 'lucide-react';

export default function InboxPage() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [composeText, setComposeText] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  const conversations = useQuery(api.inbox.listConversations, { limit: 50 }) ?? [];
  const activeThread = useQuery(api.inbox.getThread, selectedId ? { leadId: selectedId as any } : "skip" as any);
  const sendSms = useAction(api.messages.sendSmsNow);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [activeThread?.thread]);

  async function handleSend() {
    if (!selectedId || !composeText.trim() || !activeThread?.lead?.phone) return;
    
    try {
      await sendSms({
        leadId: selectedId as any,
        to: activeThread.lead.phone,
        body: composeText
      });
      setComposeText("");
    } catch (e: any) {
      alert("Failed to send: " + e.message);
    }
  }

  return (
    <AdminLayout>
      <div className="h-[calc(100vh-100px)] flex flex-col">
        <h1 className="text-2xl font-serif font-bold text-slate-900 mb-1">Unified Inbox</h1>
        <p className="text-sm text-slate-500 mb-6">Real-time streams: SMS, form submissions, and system alerts.</p>

        <div className="bg-white rounded-sm border border-slate-200 shadow-sm flex-1 overflow-hidden flex">
           {/* List */}
           <div className="w-full md:w-1/3 border-r border-slate-200 flex flex-col">
              <div className="p-4 border-b border-slate-100 bg-slate-50/50">
                 <input type="text" placeholder="Filter conversations..." className="w-full bg-white border border-slate-200 rounded-sm px-3 py-2 text-sm outline-none focus:border-elite-500 transition-colors" />
              </div>
              <div className="flex-1 overflow-y-auto">
                 {conversations.map((c: any) => (
                   <div 
                     key={c._id} 
                     onClick={() => setSelectedId(c._id)}
                     className={`p-4 border-b border-slate-50 hover:bg-slate-50 cursor-pointer transition-all group ${selectedId === c._id ? 'bg-elite-50/40 border-elite-100' : ''}`}
                   >
                      <div className="flex justify-between mb-1">
                         <span className={`font-bold text-sm ${selectedId === c._id ? 'text-elite-800' : 'text-slate-900'}`}>
                           {c.name}
                         </span>
                         <span className="text-[10px] text-slate-400">
                           {new Date(c.lastActivityAt).toLocaleDateString(undefined, {month:'short', day:'numeric'})}
                         </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-slate-500 truncate">{c.serviceSlug || "Inquiry"}</span>
                        <span className="text-[10px] px-1.5 py-0.5 bg-slate-100 rounded-sm text-slate-500 uppercase tracking-wide border border-slate-200">{c.stage}</span>
                      </div>
                   </div>
                 ))}
                 {conversations.length === 0 && (
                   <div className="p-8 text-center text-slate-400 text-xs">No active conversations.</div>
                 )}
              </div>
           </div>
           
           {/* Thread */}
           {selectedId && activeThread ? (
             <div className="hidden md:flex flex-1 flex-col bg-slate-50/30">
                {/* Thread Header */}
                <div className="p-6 border-b border-slate-200 bg-white flex justify-between items-center">
                   <div>
                      <h3 className="font-bold text-slate-900 text-lg">{activeThread.lead.name}</h3>
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        {activeThread.lead.phone && <span>{activeThread.lead.phone}</span>}
                        <span>•</span>
                        <span>{activeThread.lead.locationSlug ?? "Unknown Loc"}</span>
                      </div>
                   </div>
                   <div className="flex gap-2">
                      <button className="p-2 hover:bg-slate-100 rounded-sm text-slate-500 transition-colors" title="Call"><Phone className="w-4 h-4" /></button>
                      <button className="p-2 hover:bg-slate-100 rounded-sm text-slate-500 transition-colors"><MoreHorizontal className="w-4 h-4" /></button>
                   </div>
                </div>

                {/* Messages Area */}
                <div className="flex-1 p-6 space-y-6 overflow-y-auto" ref={scrollRef}>
                   {activeThread.thread.map((msg: any) => {
                     const isOut = msg.direction === 'out';
                     const isSystem = msg.type === 'stage_change' || msg.type === 'note' || msg.type.includes('event');
                     
                     if (isSystem) {
                       return (
                         <div key={msg._id} className="flex justify-center my-4">
                           <div className="bg-slate-100 text-slate-500 text-[10px] px-3 py-1 rounded-full uppercase tracking-wider font-bold flex items-center gap-2">
                             {msg.type === 'note' && <User className="w-3 h-3" />}
                             {msg.type === 'stage_change' && <Clock className="w-3 h-3" />}
                             <span>{msg.body}</span>
                             <span className="opacity-50">• {new Date(msg.ts).toLocaleTimeString([], {hour:'numeric', minute:'2-digit'})}</span>
                           </div>
                         </div>
                       );
                     }

                     return (
                       <div key={msg._id} className={`flex ${isOut ? 'justify-end' : 'justify-start'}`}>
                          <div className={`
                            max-w-[70%] p-4 rounded-sm shadow-sm text-sm relative group
                            ${isOut ? 'bg-elite-900 text-white rounded-tr-none' : 'bg-white border border-slate-200 text-slate-700 rounded-tl-none'}
                          `}>
                             <div className="leading-relaxed whitespace-pre-wrap">{msg.body}</div>
                             
                             <div className={`text-[9px] mt-2 flex items-center justify-end opacity-70 ${isOut ? 'text-elite-200' : 'text-slate-400'}`}>
                                {new Date(msg.ts).toLocaleTimeString([], {hour:'numeric', minute:'2-digit'})}
                                {isOut && (
                                  <span className="ml-1">
                                    {msg.status === 'sent' && <CheckCircle2 className="w-3 h-3" />}
                                    {msg.status === 'failed' && <AlertCircle className="w-3 h-3 text-red-300" />}
                                    {msg.status === 'pending' && <Clock className="w-3 h-3" />}
                                  </span>
                                )}
                             </div>
                          </div>
                       </div>
                     );
                   })}
                   {activeThread.thread.length === 0 && (
                     <div className="text-center text-slate-400 py-12 italic text-sm">No message history yet.</div>
                   )}
                </div>

                {/* Compose Area */}
                <div className="p-4 bg-white border-t border-slate-200">
                   <div className="flex gap-2">
                      <input 
                        type="text" 
                        placeholder="Type a message..." 
                        className="flex-1 border border-slate-200 rounded-sm px-4 py-3 text-sm focus:outline-none focus:border-elite-500 transition-colors bg-slate-50 focus:bg-white"
                        value={composeText}
                        onChange={(e) => setComposeText(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                      />
                      <button 
                        className="bg-elite-900 text-white px-6 font-bold uppercase text-xs tracking-widest rounded-sm hover:bg-elite-800 transition-all flex items-center"
                        onClick={handleSend}
                      >
                        Send <Send className="w-3 h-3 ml-2" />
                      </button>
                   </div>
                </div>
             </div>
           ) : (
             <div className="hidden md:flex flex-1 flex-col bg-slate-50 items-center justify-center text-slate-400">
                <MessageSquare className="w-16 h-16 mb-4 opacity-10" />
                <p className="text-sm font-medium">Select a conversation to start messaging</p>
             </div>
           )}
        </div>
      </div>
    </AdminLayout>
  );
}