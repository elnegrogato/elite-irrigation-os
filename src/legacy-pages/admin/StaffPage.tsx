// src/pages/admin/StaffPage.tsx
import { useState } from "react";
import AdminLayout from "./AdminLayout";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { User, Users, Truck, Plus, MoreHorizontal, Shield, HardHat, PenTool, Search } from "lucide-react";

export default function StaffPage() {
  const [tab, setTab] = useState<"roster" | "crews">("roster");
  
  // Queries
  const staff = useQuery(api.staff.listStaff, {}) ?? [];
  const crews = useQuery(api.staff.listCrews, {}) ?? [];
  const fleet = useQuery(api.fleet.list, {}) ?? [];
  const availableTrucks = fleet.filter((f: any) => f.type === 'vehicle' && f.status === 'active');

  // Mutations
  const createStaff = useMutation(api.staff.createStaff);
  const updateStaff = useMutation(api.staff.updateStaff);
  const createCrew = useMutation(api.staff.createCrew);
  const updateCrew = useMutation(api.staff.updateCrew);
  const deleteCrew = useMutation(api.staff.deleteCrew);

  // Forms
  const [isStaffOpen, setIsStaffOpen] = useState(false);
  const [staffForm, setStaffForm] = useState({ name: "", role: "tech", email: "", phone: "" });
  
  const [isCrewOpen, setIsCrewOpen] = useState(false);
  const [crewForm, setCrewForm] = useState<{
    name: string;
    color: string;
    foremanId: string;
    memberIds: string[];
    fleetId: string;
  }>({ name: "", color: "#3b82f6", foremanId: "", memberIds: [], fleetId: "" });

  const roles = [
    { id: 'admin', label: 'Admin', icon: Shield },
    { id: 'manager', label: 'Manager', icon: User },
    { id: 'foreman', label: 'Foreman', icon: HardHat },
    { id: 'tech', label: 'Technician', icon: PenTool },
    { id: 'labor', label: 'Laborer', icon: User },
  ];

  async function handleCreateStaff() {
    if (!staffForm.name) return;
    await createStaff({ ...staffForm });
    setIsStaffOpen(false);
    setStaffForm({ name: "", role: "tech", email: "", phone: "" });
  }

  async function handleCreateCrew() {
    if (!crewForm.name) return;
    await createCrew({
      name: crewForm.name,
      color: crewForm.color,
      foremanId: crewForm.foremanId ? (crewForm.foremanId as any) : undefined,
      memberIds: crewForm.memberIds.map(id => id as any),
      fleetId: crewForm.fleetId ? (crewForm.fleetId as any) : undefined,
    });
    setIsCrewOpen(false);
    setCrewForm({ name: "", color: "#3b82f6", foremanId: "", memberIds: [], fleetId: "" });
  }

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-serif font-bold text-slate-900">Staff & Crews</h1>
          <p className="text-sm text-zinc-500 mt-1">Manage roster, assignments, and operational teams.</p>
        </div>
        <div className="flex bg-white rounded-sm border border-slate-200 p-1">
          <button 
            onClick={() => setTab("roster")}
            className={`px-4 py-2 text-xs font-bold uppercase tracking-widest rounded-sm transition-all ${tab === 'roster' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}
          >
            Roster
          </button>
          <button 
            onClick={() => setTab("crews")}
            className={`px-4 py-2 text-xs font-bold uppercase tracking-widest rounded-sm transition-all ${tab === 'crews' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}
          >
            Crews
          </button>
        </div>
      </div>

      {tab === 'roster' && (
        <>
          <div className="flex justify-end mb-4">
            <button 
              onClick={() => setIsStaffOpen(true)}
              className="bg-elite-900 text-white px-4 py-2 rounded-sm text-xs font-bold uppercase tracking-widest hover:bg-elite-800 flex items-center"
            >
              <Plus className="w-4 h-4 mr-2" /> Add Employee
            </button>
          </div>

          <div className="bg-white rounded-sm border border-slate-200 shadow-sm overflow-hidden">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-[10px] tracking-widest border-b border-slate-200">
                <tr>
                  <th className="p-4">Name</th>
                  <th className="p-4">Role</th>
                  <th className="p-4">Contact</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {staff.map((p: any) => {
                  const RoleIcon = roles.find(r => r.id === p.role)?.icon || User;
                  return (
                    <tr key={p._id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-4 font-bold text-slate-900 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                          {p.name.charAt(0)}
                        </div>
                        {p.name}
                      </td>
                      <td className="p-4">
                        <span className="inline-flex items-center px-2 py-1 bg-slate-50 border border-slate-200 rounded-sm text-xs font-medium text-slate-700 capitalize">
                          <RoleIcon className="w-3 h-3 mr-1.5 text-slate-400" />
                          {roles.find(r => r.id === p.role)?.label || p.role}
                        </span>
                      </td>
                      <td className="p-4 text-slate-600">
                        <div className="text-xs">{p.email || "—"}</div>
                        <div className="text-xs text-slate-400">{p.phone || "—"}</div>
                      </td>
                      <td className="p-4">
                        <button 
                          onClick={() => updateStaff({ id: p._id, status: p.status === 'active' ? 'inactive' : 'active' })}
                          className={`px-2 py-1 rounded-sm text-[10px] font-bold uppercase tracking-wide border ${p.status === 'active' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-slate-100 text-slate-500 border-slate-200'}`}
                        >
                          {p.status}
                        </button>
                      </td>
                      <td className="p-4 text-right">
                        <button className="text-slate-400 hover:text-elite-600"><MoreHorizontal className="w-4 h-4" /></button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}

      {tab === 'crews' && (
        <>
          <div className="flex justify-end mb-4">
            <button 
              onClick={() => setIsCrewOpen(true)}
              className="bg-elite-900 text-white px-4 py-2 rounded-sm text-xs font-bold uppercase tracking-widest hover:bg-elite-800 flex items-center"
            >
              <Plus className="w-4 h-4 mr-2" /> Assemble Crew
            </button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {crews.map((crew: any) => (
              <div key={crew._id} className="bg-white border border-slate-200 rounded-sm p-5 shadow-sm hover:border-elite-300 transition-all">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded-full" style={{ backgroundColor: crew.color }}></div>
                    <h3 className="font-bold text-slate-900 text-lg">{crew.name}</h3>
                  </div>
                  <button onClick={() => { if(confirm('Disband crew?')) deleteCrew({ id: crew._id }); }} className="text-slate-400 hover:text-red-600"><MoreHorizontal className="w-4 h-4" /></button>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-100 rounded-sm">
                    <div className="w-8 h-8 bg-white border border-slate-200 rounded-full flex items-center justify-center text-elite-600">
                      <Truck className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Vehicle</div>
                      <div className="text-sm font-bold text-slate-700">{crew.vehicleName || "Unassigned"}</div>
                    </div>
                  </div>

                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Foreman</div>
                    {crew.foremanName ? (
                      <div className="flex items-center gap-2 text-sm font-medium text-slate-900">
                        <HardHat className="w-4 h-4 text-amber-600" /> {crew.foremanName}
                      </div>
                    ) : <span className="text-xs text-slate-400 italic">None</span>}
                  </div>

                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Crew Members</div>
                    <div className="flex flex-wrap gap-2">
                      {crew.memberNames?.map((m: string) => (
                        <span key={m} className="px-2 py-1 bg-white border border-slate-200 rounded-sm text-xs text-slate-600">{m}</span>
                      ))}
                      {(!crew.memberIds || crew.memberIds.length === 0) && <span className="text-xs text-slate-400 italic">No members</span>}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {crews.length === 0 && <div className="col-span-3 text-center py-12 text-slate-400 border border-dashed border-slate-200 rounded-sm">No active crews.</div>}
          </div>
        </>
      )}

      {/* Add Staff Modal */}
      {isStaffOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-sm shadow-2xl p-6">
            <h2 className="font-serif font-bold text-xl text-slate-900 mb-4">Add Employee</h2>
            <div className="space-y-3">
              <input className="w-full border p-2 rounded-sm text-sm" placeholder="Full Name" value={staffForm.name} onChange={e => setStaffForm({...staffForm, name: e.target.value})} />
              <select className="w-full border p-2 rounded-sm text-sm" value={staffForm.role} onChange={e => setStaffForm({...staffForm, role: e.target.value})}>
                {roles.map(r => <option key={r.id} value={r.id}>{r.label}</option>)}
              </select>
              <input className="w-full border p-2 rounded-sm text-sm" placeholder="Phone" value={staffForm.phone} onChange={e => setStaffForm({...staffForm, phone: e.target.value})} />
              <input className="w-full border p-2 rounded-sm text-sm" placeholder="Email" value={staffForm.email} onChange={e => setStaffForm({...staffForm, email: e.target.value})} />
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button onClick={() => setIsStaffOpen(false)} className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-slate-500 hover:bg-slate-100 rounded-sm">Cancel</button>
              <button onClick={handleCreateStaff} className="bg-elite-900 text-white px-6 py-2 text-xs font-bold uppercase tracking-wider rounded-sm hover:bg-elite-800">Add</button>
            </div>
          </div>
        </div>
      )}

      {/* Add Crew Modal */}
      {isCrewOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white w-full max-w-lg rounded-sm shadow-2xl p-6">
            <h2 className="font-serif font-bold text-xl text-slate-900 mb-4">Assemble Crew</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <input className="w-full border p-2 rounded-sm text-sm" placeholder="Crew Name (e.g. Alpha)" value={crewForm.name} onChange={e => setCrewForm({...crewForm, name: e.target.value})} />
                <input type="color" className="w-full h-9 border p-1 rounded-sm cursor-pointer" value={crewForm.color} onChange={e => setCrewForm({...crewForm, color: e.target.value})} />
              </div>
              
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-1">Vehicle</label>
                <select className="w-full border p-2 rounded-sm text-sm" value={crewForm.fleetId} onChange={e => setCrewForm({...crewForm, fleetId: e.target.value})}>
                  <option value="">No Vehicle</option>
                  {availableTrucks.map((t: any) => <option key={t._id} value={t._id}>{t.name} ({t.licensePlate || 'No Plate'})</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-1">Foreman</label>
                <select className="w-full border p-2 rounded-sm text-sm" value={crewForm.foremanId} onChange={e => setCrewForm({...crewForm, foremanId: e.target.value})}>
                  <option value="">Select Foreman...</option>
                  {staff.filter((s: any) => s.status === 'active').map((s: any) => (
                    <option key={s._id} value={s._id}>{s.name} ({s.role})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-1">Members</label>
                <div className="border border-slate-200 rounded-sm p-2 max-h-32 overflow-y-auto grid grid-cols-2 gap-2">
                  {staff.filter((s: any) => s.status === 'active' && s._id !== crewForm.foremanId).map((s: any) => (
                    <label key={s._id} className="flex items-center gap-2 text-sm p-1 hover:bg-slate-50 rounded cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={crewForm.memberIds.includes(s._id)} 
                        onChange={e => {
                          if (e.target.checked) setCrewForm({...crewForm, memberIds: [...crewForm.memberIds, s._id]});
                          else setCrewForm({...crewForm, memberIds: crewForm.memberIds.filter(id => id !== s._id)});
                        }}
                        className="accent-elite-600"
                      />
                      <span>{s.name}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button onClick={() => setIsCrewOpen(false)} className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-slate-500 hover:bg-slate-100 rounded-sm">Cancel</button>
              <button onClick={handleCreateCrew} className="bg-elite-900 text-white px-6 py-2 text-xs font-bold uppercase tracking-wider rounded-sm hover:bg-elite-800">Create Crew</button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}