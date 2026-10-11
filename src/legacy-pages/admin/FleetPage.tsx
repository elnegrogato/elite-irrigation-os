// src/pages/admin/FleetPage.tsx
import { useState } from "react";
import AdminLayout from "./AdminLayout";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Truck, Wrench, Gauge, Calendar, Plus, MoreHorizontal, User, AlertTriangle, CheckCircle, Car } from "lucide-react";

export default function FleetPage() {
  const fleet = useQuery(api.fleet.list) ?? [];
  const createAsset = useMutation(api.fleet.create);
  const logService = useMutation(api.fleet.logMaintenance);
  const updateAsset = useMutation(api.fleet.update);
  const removeAsset = useMutation(api.fleet.remove);

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [selectedAssetId, setSelectedAssetId] = useState<string | null>(null);
  
  // For creating asset
  const [form, setForm] = useState({
    name: "", type: "vehicle", status: "active", make: "", model: "", year: "",
    vin: "", licensePlate: "", assignedTo: "", currentReading: "", readingType: "miles", notes: ""
  });

  // For maintenance log
  const [serviceForm, setServiceForm] = useState({
    date: new Date().toISOString().slice(0, 10),
    serviceType: "oil",
    description: "",
    cost: "",
    vendor: "",
    readingAtService: "",
  });

  const selectedAsset = fleet.find(f => f._id === selectedAssetId);
  const logs = useQuery(api.fleet.getLogs, selectedAssetId ? { fleetId: selectedAssetId as any } : "skip" as any) ?? [];

  const stats = {
    total: fleet.length,
    active: fleet.filter(f => f.status === "active").length,
    maintenance: fleet.filter(f => f.status === "maintenance").length,
    costYTD: 0, // Placeholder, would need aggregation query
  };

  async function handleCreate() {
    if (!form.name) return;
    await createAsset({
      name: form.name,
      type: form.type,
      status: form.status,
      make: form.make || undefined,
      model: form.model || undefined,
      year: form.year ? parseInt(form.year) : undefined,
      vin: form.vin || undefined,
      licensePlate: form.licensePlate || undefined,
      assignedTo: form.assignedTo || undefined,
      currentReading: form.currentReading ? parseInt(form.currentReading) : undefined,
      readingType: form.readingType || undefined,
      notes: form.notes || undefined,
    });
    setIsAddOpen(false);
    setForm({ name: "", type: "vehicle", status: "active", make: "", model: "", year: "", vin: "", licensePlate: "", assignedTo: "", currentReading: "", readingType: "miles", notes: "" });
  }

  async function handleLogService() {
    if (!selectedAssetId || !serviceForm.description || !serviceForm.cost) return;
    await logService({
      fleetId: selectedAssetId as any,
      date: new Date(serviceForm.date).getTime(),
      serviceType: serviceForm.serviceType,
      description: serviceForm.description,
      cost: parseFloat(serviceForm.cost),
      vendor: serviceForm.vendor || undefined,
      readingAtService: serviceForm.readingAtService ? parseInt(serviceForm.readingAtService) : undefined,
    });
    setServiceForm({ date: new Date().toISOString().slice(0, 10), serviceType: "oil", description: "", cost: "", vendor: "", readingAtService: "" });
    alert("Service logged.");
  }

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-serif font-bold text-slate-900">Fleet & Equipment</h1>
          <p className="text-sm text-zinc-500 mt-1">Track vehicles, trailers, heavy equipment, and service history.</p>
        </div>
        <button 
          className="bg-elite-900 text-white px-4 py-2 rounded-sm text-xs font-bold uppercase tracking-widest hover:bg-elite-800 flex items-center transition-colors"
          onClick={() => setIsAddOpen(true)}
        >
          <Plus className="w-4 h-4 mr-2" /> Add Asset
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-4 rounded-sm border border-slate-200 shadow-sm">
           <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Total Assets</div>
           <div className="text-2xl font-bold text-slate-900">{stats.total}</div>
        </div>
        <div className="bg-emerald-50 p-4 rounded-sm border border-emerald-100 shadow-sm">
           <div className="text-xs font-bold text-emerald-600 uppercase tracking-widest mb-1">Active</div>
           <div className="text-2xl font-bold text-emerald-800">{stats.active}</div>
        </div>
        <div className="bg-amber-50 p-4 rounded-sm border border-amber-100 shadow-sm">
           <div className="text-xs font-bold text-amber-600 uppercase tracking-widest mb-1">In Maintenance</div>
           <div className="text-2xl font-bold text-amber-800">{stats.maintenance}</div>
        </div>
        <div className="bg-slate-50 p-4 rounded-sm border border-slate-200 shadow-sm">
           <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Fleet Health</div>
           <div className="text-2xl font-bold text-slate-700">Good</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* List */}
        <div className="lg:col-span-2 space-y-4">
          {fleet.map((item: any) => (
            <div 
              key={item._id} 
              className={`bg-white border rounded-sm p-4 cursor-pointer transition-all hover:shadow-md ${selectedAssetId === item._id ? 'border-elite-500 ring-1 ring-elite-500' : 'border-slate-200'}`}
              onClick={() => setSelectedAssetId(item._id)}
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-sm flex items-center justify-center ${item.type === 'vehicle' ? 'bg-blue-50 text-blue-600' : 'bg-orange-50 text-orange-600'}`}>
                    {item.type === 'vehicle' ? <Truck className="w-5 h-5" /> : <Wrench className="w-5 h-5" />}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">{item.name}</h3>
                    <div className="text-xs text-slate-500">{item.make} {item.model} {item.year ? `(${item.year})` : ''}</div>
                  </div>
                </div>
                <span className={`px-2 py-1 rounded-sm text-[10px] font-bold uppercase tracking-wide border ${
                  item.status === 'active' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                  item.status === 'maintenance' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                  'bg-slate-50 text-slate-600 border-slate-200'
                }`}>
                  {item.status.replace('_', ' ')}
                </span>
              </div>
              
              <div className="flex items-center gap-6 text-xs text-slate-500 pl-13">
                <div className="flex items-center gap-1.5">
                  <Gauge className="w-3 h-3" />
                  {item.currentReading ? item.currentReading.toLocaleString() : '—'} {item.readingType}
                </div>
                <div className="flex items-center gap-1.5">
                  <User className="w-3 h-3" />
                  {item.assignedTo || 'Unassigned'}
                </div>
                {item.licensePlate && (
                  <div className="flex items-center gap-1.5 font-mono bg-slate-100 px-1.5 rounded">
                    {item.licensePlate}
                  </div>
                )}
              </div>
            </div>
          ))}
          {fleet.length === 0 && <div className="text-slate-400 text-sm italic text-center py-8">No assets in fleet.</div>}
        </div>

        {/* Detail Panel */}
        <div className="bg-white border border-slate-200 rounded-sm p-6 shadow-sm h-fit sticky top-8">
          {!selectedAsset ? (
            <div className="text-center text-slate-400 text-sm py-12 flex flex-col items-center">
              <Car className="w-12 h-12 mb-3 opacity-20" />
              Select an asset to view details
            </div>
          ) : (
            <>
              <div className="flex justify-between items-start mb-6 pb-6 border-b border-slate-100">
                <div>
                  <h2 className="font-serif font-bold text-xl text-slate-900">{selectedAsset.name}</h2>
                  <div className="text-xs text-slate-500 mt-1 uppercase tracking-wider">{selectedAsset.vin || "No VIN"}</div>
                </div>
                <button 
                  onClick={() => {
                    if (confirm("Delete this asset?")) {
                      removeAsset({ id: selectedAsset._id as any });
                      setSelectedAssetId(null);
                    }
                  }}
                  className="text-slate-400 hover:text-red-600"
                >
                  <MoreHorizontal className="w-5 h-5" />
                </button>
              </div>

              <div className="mb-6 space-y-3">
                <div className="bg-slate-50 p-4 rounded-sm border border-slate-100">
                  <h3 className="font-bold text-xs uppercase tracking-widest text-slate-500 mb-3">Status & Assignment</h3>
                  <select 
                    className="w-full mb-2 text-sm p-2 border border-slate-200 rounded-sm"
                    value={selectedAsset.status}
                    onChange={(e) => updateAsset({ id: selectedAsset._id as any, status: e.target.value })}
                  >
                    <option value="active">Active</option>
                    <option value="maintenance">Maintenance</option>
                    <option value="out_of_service">Out of Service</option>
                    <option value="retired">Retired</option>
                  </select>
                  <input 
                    className="w-full text-sm p-2 border border-slate-200 rounded-sm"
                    placeholder="Assigned To (Crew/Person)"
                    value={selectedAsset.assignedTo || ""}
                    onChange={(e) => updateAsset({ id: selectedAsset._id as any, assignedTo: e.target.value })}
                  />
                </div>

                <div className="bg-slate-50 p-4 rounded-sm border border-slate-100">
                  <h3 className="font-bold text-xs uppercase tracking-widest text-slate-500 mb-3">Log Maintenance</h3>
                  <div className="grid grid-cols-2 gap-2 mb-2">
                    <input type="date" className="p-2 border border-slate-200 rounded-sm text-xs" value={serviceForm.date} onChange={e => setServiceForm({...serviceForm, date: e.target.value})} />
                    <select className="p-2 border border-slate-200 rounded-sm text-xs" value={serviceForm.serviceType} onChange={e => setServiceForm({...serviceForm, serviceType: e.target.value})}>
                      <option value="oil">Oil Change</option>
                      <option value="tires">Tires</option>
                      <option value="repair">Repair</option>
                      <option value="inspection">Inspection</option>
                      <option value="pm">PM Service</option>
                    </select>
                  </div>
                  <input className="w-full mb-2 p-2 border border-slate-200 rounded-sm text-xs" placeholder="Description" value={serviceForm.description} onChange={e => setServiceForm({...serviceForm, description: e.target.value})} />
                  <div className="grid grid-cols-2 gap-2 mb-2">
                    <input type="number" className="p-2 border border-slate-200 rounded-sm text-xs" placeholder="Cost $" value={serviceForm.cost} onChange={e => setServiceForm({...serviceForm, cost: e.target.value})} />
                    <input type="number" className="p-2 border border-slate-200 rounded-sm text-xs" placeholder="Mileage/Hrs" value={serviceForm.readingAtService} onChange={e => setServiceForm({...serviceForm, readingAtService: e.target.value})} />
                  </div>
                  <button onClick={handleLogService} className="w-full bg-elite-900 text-white py-2 rounded-sm text-xs font-bold uppercase tracking-wider hover:bg-elite-800">
                    Save Log
                  </button>
                </div>
              </div>

              <div>
                <h3 className="font-bold text-sm text-slate-900 mb-3 flex items-center"><Calendar className="w-4 h-4 mr-2" /> Service History</h3>
                <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                  {logs.map((log: any) => (
                    <div key={log._id} className="text-xs border-l-2 border-slate-200 pl-3 py-1">
                      <div className="flex justify-between font-bold text-slate-700">
                        <span>{new Date(log.date).toLocaleDateString()}</span>
                        <span>${log.cost}</span>
                      </div>
                      <div className="text-slate-600">{log.description}</div>
                      <div className="text-slate-400 mt-0.5 uppercase tracking-wide text-[9px]">{log.serviceType} {log.readingAtService ? `• ${log.readingAtService}` : ''}</div>
                    </div>
                  ))}
                  {logs.length === 0 && <div className="text-xs text-slate-400 italic">No history logged.</div>}
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Add Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white w-full max-w-lg rounded-sm shadow-2xl p-6">
            <h2 className="font-serif font-bold text-xl text-slate-900 mb-6">Add New Asset</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <input className="border p-2 rounded-sm text-sm" placeholder="Asset Name (e.g. Truck 01)" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
                <select className="border p-2 rounded-sm text-sm" value={form.type} onChange={e => setForm({...form, type: e.target.value})}>
                  <option value="vehicle">Vehicle</option>
                  <option value="trailer">Trailer</option>
                  <option value="equipment">Equipment</option>
                  <option value="small_tool">Small Tool</option>
                </select>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <input className="border p-2 rounded-sm text-sm" placeholder="Make" value={form.make} onChange={e => setForm({...form, make: e.target.value})} />
                <input className="border p-2 rounded-sm text-sm" placeholder="Model" value={form.model} onChange={e => setForm({...form, model: e.target.value})} />
                <input className="border p-2 rounded-sm text-sm" placeholder="Year" type="number" value={form.year} onChange={e => setForm({...form, year: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <input className="border p-2 rounded-sm text-sm" placeholder="VIN / Serial" value={form.vin} onChange={e => setForm({...form, vin: e.target.value})} />
                <input className="border p-2 rounded-sm text-sm" placeholder="License Plate" value={form.licensePlate} onChange={e => setForm({...form, licensePlate: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <input className="border p-2 rounded-sm text-sm" placeholder="Current Reading" type="number" value={form.currentReading} onChange={e => setForm({...form, currentReading: e.target.value})} />
                <select className="border p-2 rounded-sm text-sm" value={form.readingType} onChange={e => setForm({...form, readingType: e.target.value})}>
                  <option value="miles">Miles</option>
                  <option value="hours">Hours</option>
                </select>
              </div>
              <input className="w-full border p-2 rounded-sm text-sm" placeholder="Assigned To" value={form.assignedTo} onChange={e => setForm({...form, assignedTo: e.target.value})} />
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setIsAddOpen(false)} className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-slate-500 hover:bg-slate-100 rounded-sm">Cancel</button>
              <button onClick={handleCreate} className="bg-elite-900 text-white px-6 py-2 text-xs font-bold uppercase tracking-wider rounded-sm hover:bg-elite-800">Create Asset</button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}