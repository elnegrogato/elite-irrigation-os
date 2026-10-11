// src/pages/admin/CompliancePage.tsx
import { useState } from "react";
import AdminLayout from "./AdminLayout";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { ShieldCheck, Plus, FileText, Trash2, AlertTriangle, CheckCircle, AlertOctagon, UploadCloud } from "lucide-react";
import { uploadToConvex } from "../tech/upload";

export default function CompliancePage() {
  const docs = useQuery(api.compliance.list) ?? [];
  const create = useMutation(api.compliance.create);
  const remove = useMutation(api.compliance.remove);
  const generateUploadUrl = useMutation(api.files.generateUploadUrl);

  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState({
    name: "",
    type: "License",
    identifier: "",
    expiryDate: "",
    notes: "",
  });
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);

  const stats = {
    total: docs.length,
    valid: docs.filter(d => d.status === "valid").length,
    expiring: docs.filter(d => d.status === "expiring").length,
    expired: docs.filter(d => d.status === "expired").length,
  };

  async function handleSubmit() {
    if (!form.name || !form.expiryDate) return;
    setBusy(true);
    try {
      let storageId: string | undefined = undefined;
      if (file) {
        const url = await generateUploadUrl({});
        storageId = await uploadToConvex(url as any, file);
      }

      await create({
        name: form.name,
        type: form.type,
        identifier: form.identifier || undefined,
        expiryDate: new Date(form.expiryDate).getTime(),
        notes: form.notes || undefined,
        storageId,
      });
      setIsOpen(false);
      setForm({ name: "", type: "License", identifier: "", expiryDate: "", notes: "" });
      setFile(null);
    } catch (e: any) {
      alert("Error: " + e.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-serif font-bold text-slate-900">Compliance & Assets</h1>
          <p className="text-sm text-zinc-500 mt-1">Manage licenses, insurance, certifications, and vehicle registrations.</p>
        </div>
        <button 
          className="bg-elite-900 text-white px-4 py-2 rounded-sm text-xs font-bold uppercase tracking-widest hover:bg-elite-800 flex items-center transition-colors"
          onClick={() => setIsOpen(true)}
        >
          <Plus className="w-4 h-4 mr-2" /> Add Document
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-4 rounded-sm border border-slate-200 shadow-sm">
           <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Total Assets</div>
           <div className="text-2xl font-bold text-slate-900">{stats.total}</div>
        </div>
        <div className="bg-emerald-50 p-4 rounded-sm border border-emerald-100 shadow-sm">
           <div className="text-xs font-bold text-emerald-600 uppercase tracking-widest mb-1">Valid</div>
           <div className="text-2xl font-bold text-emerald-800">{stats.valid}</div>
        </div>
        <div className="bg-amber-50 p-4 rounded-sm border border-amber-100 shadow-sm">
           <div className="text-xs font-bold text-amber-600 uppercase tracking-widest mb-1">Expiring Soon</div>
           <div className="text-2xl font-bold text-amber-800">{stats.expiring}</div>
        </div>
        <div className="bg-red-50 p-4 rounded-sm border border-red-100 shadow-sm">
           <div className="text-xs font-bold text-red-600 uppercase tracking-widest mb-1">Expired</div>
           <div className="text-2xl font-bold text-red-800">{stats.expired}</div>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-sm shadow-sm overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-[10px] tracking-widest border-b border-slate-200">
            <tr>
              <th className="p-4">Document Name</th>
              <th className="p-4">Type</th>
              <th className="p-4">Identifier</th>
              <th className="p-4">Expiry Date</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {docs.map((doc: any) => (
              <tr key={doc._id} className="hover:bg-slate-50 transition-colors">
                <td className="p-4">
                  <div className="font-bold text-slate-900">{doc.name}</div>
                  {doc.notes && <div className="text-xs text-slate-500 mt-0.5">{doc.notes}</div>}
                </td>
                <td className="p-4 text-slate-600">{doc.type}</td>
                <td className="p-4 font-mono text-xs text-slate-600">{doc.identifier || "—"}</td>
                <td className="p-4 text-slate-700">{new Date(doc.expiryDate).toLocaleDateString()}</td>
                <td className="p-4">
                  <span className={`inline-flex items-center px-2 py-1 rounded-sm text-[10px] font-bold uppercase tracking-wide border ${
                    doc.status === 'valid' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                    doc.status === 'expiring' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                    'bg-red-50 text-red-700 border-red-100'
                  }`}>
                    {doc.status === 'valid' && <CheckCircle className="w-3 h-3 mr-1.5" />}
                    {doc.status === 'expiring' && <AlertTriangle className="w-3 h-3 mr-1.5" />}
                    {doc.status === 'expired' && <AlertOctagon className="w-3 h-3 mr-1.5" />}
                    {doc.status}
                  </span>
                </td>
                <td className="p-4 text-right flex justify-end gap-3">
                  {doc.fileUrl && (
                    <a href={doc.fileUrl} target="_blank" className="text-slate-400 hover:text-elite-600" title="View File">
                      <FileText className="w-4 h-4" />
                    </a>
                  )}
                  <button 
                    onClick={async () => {
                      if (confirm("Delete this document?")) await remove({ id: doc._id });
                    }}
                    className="text-slate-400 hover:text-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
            {docs.length === 0 && (
              <tr><td colSpan={6} className="p-8 text-center text-slate-400 italic">No compliance documents tracked yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white w-full max-w-lg rounded-sm shadow-2xl overflow-hidden">
            <div className="p-6 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
              <h2 className="font-serif font-bold text-xl text-slate-900">Add Document</h2>
              <button onClick={() => setIsOpen(false)}><ShieldCheck className="w-5 h-5 text-slate-400" /></button>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-1">Name</label>
                <input 
                  className="w-full border border-slate-200 rounded-sm p-2 text-sm focus:border-elite-500 outline-none"
                  value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="e.g. General Liability Policy"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-1">Type</label>
                  <select 
                    className="w-full border border-slate-200 rounded-sm p-2 text-sm focus:border-elite-500 outline-none"
                    value={form.type} onChange={e => setForm({...form, type: e.target.value})}
                  >
                    <option>License</option>
                    <option>Insurance</option>
                    <option>Registration</option>
                    <option>Certification</option>
                    <option>Permit</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-1">Identifier (Optional)</label>
                  <input 
                    className="w-full border border-slate-200 rounded-sm p-2 text-sm focus:border-elite-500 outline-none"
                    value={form.identifier} onChange={e => setForm({...form, identifier: e.target.value})} placeholder="Lic #"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-1">Expiry Date</label>
                <input 
                  type="date"
                  className="w-full border border-slate-200 rounded-sm p-2 text-sm focus:border-elite-500 outline-none"
                  value={form.expiryDate} onChange={e => setForm({...form, expiryDate: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-1">Scan / File (PDF/Image)</label>
                <div className="border-2 border-dashed border-slate-200 rounded-sm p-4 text-center cursor-pointer hover:bg-slate-50 transition-colors relative">
                  <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={e => setFile(e.target.files?.[0] || null)} />
                  <div className="flex flex-col items-center text-slate-400">
                    <UploadCloud className="w-6 h-6 mb-2" />
                    <span className="text-xs font-medium">{file ? file.name : "Click to upload file"}</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-1">Notes</label>
                <textarea 
                  className="w-full border border-slate-200 rounded-sm p-2 text-sm focus:border-elite-500 outline-none"
                  rows={2}
                  value={form.notes} onChange={e => setForm({...form, notes: e.target.value})}
                />
              </div>
            </div>

            <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
              <button onClick={() => setIsOpen(false)} className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-slate-500 hover:bg-slate-200 rounded-sm">Cancel</button>
              <button 
                onClick={handleSubmit} 
                disabled={busy || !form.name || !form.expiryDate}
                className="bg-elite-900 text-white px-6 py-2 text-xs font-bold uppercase tracking-wider rounded-sm hover:bg-elite-800 disabled:opacity-50"
              >
                {busy ? "Saving..." : "Save Document"}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}