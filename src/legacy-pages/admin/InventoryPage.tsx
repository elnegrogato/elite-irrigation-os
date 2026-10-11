// src/pages/admin/InventoryPage.tsx
import { useState, useMemo } from "react";
import AdminLayout from "./AdminLayout";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Plus, Search, AlertTriangle, Package, DollarSign, Tag, MoreHorizontal, ArrowUp, ArrowDown, Edit2, Trash2 } from "lucide-react";

const CATEGORIES = ["Irrigation", "Drainage", "Lighting", "Hardscape", "Turf", "Tools", "Bulk"];

export default function InventoryPage() {
  const [catFilter, setCatFilter] = useState("All");
  const [search, setSearch] = useState("");
  const items = useQuery(api.inventory.list, { category: catFilter === "All" ? undefined : catFilter }) ?? [];
  
  const upsert = useMutation(api.inventory.upsert);
  const adjust = useMutation(api.inventory.adjustStock);
  const remove = useMutation(api.inventory.remove);

  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState<any>({
    name: "", sku: "", category: "Irrigation", onHand: 0, minLevel: 5, unit: "ea", cost: 0, price: 0, binLocation: "", supplier: ""
  });
  const [editId, setEditId] = useState<string | null>(null);

  // Stats
  const stats = useMemo(() => {
    const totalVal = items.reduce((sum: number, i: any) => sum + (i.onHand * i.cost), 0);
    const retailVal = items.reduce((sum: number, i: any) => sum + (i.onHand * i.price), 0);
    const lowStock = items.filter((i: any) => i.minLevel !== undefined && i.onHand <= i.minLevel).length;
    return { totalVal, retailVal, lowStock };
  }, [items]);

  const filtered = items.filter((i: any) => 
    i.name.toLowerCase().includes(search.toLowerCase()) || 
    i.sku.toLowerCase().includes(search.toLowerCase())
  );

  async function handleSave() {
    if (!form.name || !form.sku) return;
    try {
      await upsert({
        id: editId ? (editId as any) : undefined,
        name: form.name,
        sku: form.sku,
        category: form.category,
        onHand: Number(form.onHand),
        minLevel: Number(form.minLevel),
        unit: form.unit,
        cost: Number(form.cost),
        price: Number(form.price),
        binLocation: form.binLocation,
        supplier: form.supplier
      });
      setIsOpen(false);
      setForm({ name: "", sku: "", category: "Irrigation", onHand: 0, minLevel: 5, unit: "ea", cost: 0, price: 0, binLocation: "", supplier: "" });
      setEditId(null);
    } catch (e: any) {
      alert(e.message);
    }
  }

  function openEdit(item: any) {
    setForm({ ...item });
    setEditId(item._id);
    setIsOpen(true);
  }

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-serif font-bold text-slate-900">Inventory & Parts</h1>
          <p className="text-sm text-zinc-500 mt-1">Manage stock levels, pricing, and reordering.</p>
        </div>
        <button 
          className="bg-elite-900 text-white px-4 py-2 rounded-sm text-xs font-bold uppercase tracking-widest hover:bg-elite-800 flex items-center transition-colors"
          onClick={() => {
            setEditId(null);
            setForm({ name: "", sku: "", category: "Irrigation", onHand: 0, minLevel: 5, unit: "ea", cost: 0, price: 0, binLocation: "", supplier: "" });
            setIsOpen(true);
          }}
        >
          <Plus className="w-4 h-4 mr-2" /> Add Item
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-sm border border-slate-200 shadow-sm flex items-center justify-between">
           <div>
              <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Total Valuation (Cost)</div>
              <div className="text-2xl font-bold text-slate-900 font-serif">${stats.totalVal.toLocaleString()}</div>
           </div>
           <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
              <DollarSign className="w-5 h-5" />
           </div>
        </div>
        <div className="bg-white p-6 rounded-sm border border-slate-200 shadow-sm flex items-center justify-between">
           <div>
              <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Potential Revenue</div>
              <div className="text-2xl font-bold text-slate-900 font-serif">${stats.retailVal.toLocaleString()}</div>
           </div>
           <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
              <Tag className="w-5 h-5" />
           </div>
        </div>
        <div className="bg-white p-6 rounded-sm border border-slate-200 shadow-sm flex items-center justify-between">
           <div>
              <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Low Stock Alerts</div>
              <div className={`text-2xl font-bold font-serif ${stats.lowStock > 0 ? 'text-red-600' : 'text-slate-900'}`}>{stats.lowStock}</div>
           </div>
           <div className={`w-10 h-10 rounded-full flex items-center justify-center ${stats.lowStock > 0 ? 'bg-red-50 text-red-600' : 'bg-slate-100 text-slate-400'}`}>
              <AlertTriangle className="w-5 h-5" />
           </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex bg-white rounded-sm border border-slate-200 p-1">
           <button onClick={() => setCatFilter("All")} className={`px-4 py-1.5 text-xs font-bold uppercase tracking-wide rounded-sm ${catFilter === "All" ? 'bg-slate-900 text-white' : 'text-slate-500 hover:bg-slate-50'}`}>All</button>
           {CATEGORIES.slice(0,4).map(c => (
             <button key={c} onClick={() => setCatFilter(c)} className={`px-4 py-1.5 text-xs font-bold uppercase tracking-wide rounded-sm ${catFilter === c ? 'bg-slate-900 text-white' : 'text-slate-500 hover:bg-slate-50'}`}>{c}</button>
           ))}
        </div>
        <div className="flex-1 relative">
           <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
           <input 
             className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-sm text-sm focus:border-elite-500 outline-none"
             placeholder="Search SKU or Name..."
             value={search}
             onChange={e => setSearch(e.target.value)}
           />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-sm border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-[10px] tracking-widest border-b border-slate-200">
            <tr>
              <th className="p-4">Item</th>
              <th className="p-4">SKU / Bin</th>
              <th className="p-4 text-center">Stock Level</th>
              <th className="p-4 text-right">Cost</th>
              <th className="p-4 text-right">Retail</th>
              <th className="p-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map((item: any) => {
              const isLow = item.minLevel !== undefined && item.onHand <= item.minLevel;
              return (
                <tr key={item._id} className={`hover:bg-slate-50 transition-colors ${isLow ? 'bg-red-50/30' : ''}`}>
                  <td className="p-4">
                    <div className="font-bold text-slate-900">{item.name}</div>
                    <div className="text-xs text-slate-500">{item.category} • {item.supplier || "No Supplier"}</div>
                  </td>
                  <td className="p-4 font-mono text-xs text-slate-600">
                    <div>{item.sku}</div>
                    {item.binLocation && <div className="text-[10px] text-slate-400">Bin: {item.binLocation}</div>}
                  </td>
                  <td className="p-4 text-center">
                    <div className="flex items-center justify-center gap-3">
                       <button onClick={() => adjust({ id: item._id, delta: -1 })} className="p-1 hover:bg-slate-200 rounded text-slate-400 hover:text-slate-700"><ArrowDown className="w-3 h-3" /></button>
                       <div className="w-16 text-center">
                          <div className={`font-bold text-lg ${isLow ? 'text-red-600' : 'text-slate-900'}`}>{item.onHand}</div>
                          <div className="text-[10px] text-slate-400 uppercase tracking-wide">{item.unit}</div>
                       </div>
                       <button onClick={() => adjust({ id: item._id, delta: 1 })} className="p-1 hover:bg-slate-200 rounded text-slate-400 hover:text-slate-700"><ArrowUp className="w-3 h-3" /></button>
                    </div>
                    {isLow && <div className="text-[9px] font-bold text-red-600 uppercase tracking-widest mt-1">Low Stock (Min {item.minLevel})</div>}
                  </td>
                  <td className="p-4 text-right font-mono text-slate-600">${item.cost.toFixed(2)}</td>
                  <td className="p-4 text-right font-mono text-slate-900 font-bold">${item.price.toFixed(2)}</td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => openEdit(item)} className="text-slate-400 hover:text-elite-600"><Edit2 className="w-4 h-4" /></button>
                      <button onClick={() => { if(confirm("Delete item?")) remove({ id: item._id }); }} className="text-slate-400 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr><td colSpan={6} className="p-12 text-center text-slate-400 italic">No inventory found.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Drawer / Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white w-full max-w-lg rounded-sm shadow-2xl p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="font-serif font-bold text-xl text-slate-900 mb-6">{editId ? "Edit Item" : "New Inventory Item"}</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-1">Item Name</label>
                <input className="w-full border p-2 rounded-sm text-sm" value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="e.g. Rain Bird 5000 Rotor" />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-1">SKU</label>
                  <input className="w-full border p-2 rounded-sm text-sm" value={form.sku} onChange={e => setForm({...form, sku: e.target.value})} placeholder="RB-5004" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-1">Category</label>
                  <select className="w-full border p-2 rounded-sm text-sm" value={form.category} onChange={e => setForm({...form, category: e.target.value})}>
                    {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-1">Current Qty</label>
                  <input type="number" className="w-full border p-2 rounded-sm text-sm" value={form.onHand} onChange={e => setForm({...form, onHand: e.target.value})} />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-1">Min Level</label>
                  <input type="number" className="w-full border p-2 rounded-sm text-sm" value={form.minLevel} onChange={e => setForm({...form, minLevel: e.target.value})} />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-1">Unit</label>
                  <input className="w-full border p-2 rounded-sm text-sm" value={form.unit} onChange={e => setForm({...form, unit: e.target.value})} placeholder="ea" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-1">Unit Cost ($)</label>
                  <input type="number" className="w-full border p-2 rounded-sm text-sm" value={form.cost} onChange={e => setForm({...form, cost: e.target.value})} />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-1">Retail Price ($)</label>
                  <input type="number" className="w-full border p-2 rounded-sm text-sm" value={form.price} onChange={e => setForm({...form, price: e.target.value})} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-1">Bin / Location</label>
                  <input className="w-full border p-2 rounded-sm text-sm" value={form.binLocation} onChange={e => setForm({...form, binLocation: e.target.value})} placeholder="Row 3, Shelf B" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-1">Supplier</label>
                  <input className="w-full border p-2 rounded-sm text-sm" value={form.supplier} onChange={e => setForm({...form, supplier: e.target.value})} placeholder="SiteOne" />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-8">
              <button onClick={() => setIsOpen(false)} className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-slate-500 hover:bg-slate-100 rounded-sm">Cancel</button>
              <button onClick={handleSave} className="bg-elite-900 text-white px-6 py-2 text-xs font-bold uppercase tracking-wider rounded-sm hover:bg-elite-800">
                {editId ? "Update Item" : "Create Item"}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}