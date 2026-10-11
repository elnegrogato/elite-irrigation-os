import React, { useState } from 'react';
import { 
  LayoutDashboard, Users, Calendar, Truck, FileText, 
  Settings, Bell, Search, Menu, MessageSquare, 
  TrendingUp, AlertTriangle, CheckCircle, Droplet,
  ShieldCheck, Lightbulb, MoreHorizontal, ChevronRight, X,
  MapPin, ArrowRight, Trees
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, AreaChart, Area 
} from 'recharts';
import { MOCK_LEADS, MOCK_COMPLIANCE, REVENUE_DATA, MOCK_ROUTES } from '../constants';
import { Lead, LeadStatus, ComplianceRecord } from '../types';
import { problems } from '../data/problems';

// --- Shared Admin Components ---

const AdminSidebar = ({ active, setActive }: { active: string, setActive: (v: string) => void }) => {
  const menuItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'leads', icon: Users, label: 'Leads & CRM' },
    { id: 'schedule', icon: Calendar, label: 'Schedule' },
    { id: 'routes', icon: Truck, label: 'Route Manager' },
    { id: 'estimates', icon: FileText, label: 'Estimates' },
    { id: 'compliance', icon: ShieldCheckIcon, label: 'Compliance' },
  ];

  return (
    <div className="hidden lg:flex flex-col w-72 bg-slate-950 border-r border-slate-900 min-h-screen fixed left-0 top-0 shadow-2xl z-20">
      <div className="p-8 flex items-center gap-3">
        <div className="w-8 h-8 bg-elite-600 rounded-sm flex items-center justify-center text-white">
           <Trees className="w-5 h-5" />
        </div>
        <h1 className="text-xl font-serif font-black text-white tracking-tight">
          Elite<span className="text-elite-500">.</span> <span className="ml-1 text-[10px] font-sans font-medium text-slate-500 uppercase tracking-widest">OS</span>
        </h1>
      </div>
      
      <div className="px-4 mb-4">
        <div className="text-[10px] font-bold text-slate-600 uppercase tracking-[0.2em] px-4 mb-4">Operations</div>
        <nav className="space-y-1">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActive(item.id)}
              className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-sm transition-all duration-200 group ${
                active === item.id 
                  ? 'bg-elite-900/50 text-white border-l-2 border-elite-500' 
                  : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200 border-l-2 border-transparent'
              }`}
            >
              <item.icon className={`w-4 h-4 mr-3 transition-colors ${active === item.id ? 'text-elite-500' : 'text-slate-600 group-hover:text-slate-400'}`} />
              {item.label}
              {active === item.id && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-elite-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>}
            </button>
          ))}
        </nav>
      </div>

      <div className="mt-auto p-6 border-t border-slate-900">
        <div className="flex items-center p-3 bg-slate-900 rounded-sm border border-slate-800">
          <div className="w-8 h-8 rounded-sm bg-gradient-to-br from-bronze-400 to-bronze-600 flex items-center justify-center text-white font-bold text-xs shadow-md">JD</div>
          <div className="ml-3 overflow-hidden">
            <p className="text-xs font-bold text-white uppercase tracking-wider truncate">John Doe</p>
            <p className="text-[10px] text-slate-500 truncate">Director of Ops</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, sub, icon: Icon, trend }: { title: string, value: string, sub: string, icon: any, trend: 'up' | 'down' }) => (
  <div className="bg-white p-6 rounded-sm border border-slate-200 hover:border-elite-200 transition-all shadow-sm hover:shadow-lg group">
    <div className="flex justify-between items-start mb-4">
      <div className="p-3 bg-slate-50 rounded-sm group-hover:bg-elite-50 transition-colors">
        <Icon className="w-5 h-5 text-slate-400 group-hover:text-elite-600 transition-colors" />
      </div>
      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase tracking-wider ${trend === 'up' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-red-50 text-red-700 border-red-100'}`}>
        {trend === 'up' ? '+' : '-'}{sub}
      </span>
    </div>
    <h3 className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.1em]">{title}</h3>
    <p className="text-3xl font-serif font-bold text-slate-900 mt-2">{value}</p>
  </div>
);

// --- Sub-Pages ---

const DashboardHome = () => (
  <div className="space-y-8 animate-fade-in-up">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard title="Monthly Revenue" value="$142,000" sub="12%" icon={TrendingUp} trend="up" />
      <StatCard title="Active Leads" value="48" sub="5 New" icon={Users} trend="up" />
      <StatCard title="Route Eff." value="92%" sub="1.4%" icon={Truck} trend="up" />
      <StatCard title="Alerts" value="1" sub="Urgent" icon={AlertTriangle} trend="down" />
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 bg-white p-8 rounded-sm border border-slate-200 shadow-sm">
        <div className="flex justify-between items-center mb-8">
           <div>
             <h3 className="text-lg font-bold text-slate-900 font-serif">Revenue Performance</h3>
             <p className="text-xs text-slate-500 uppercase tracking-wider mt-1">FY 2024 Analysis</p>
           </div>
           <select className="text-xs font-bold uppercase tracking-wider bg-slate-50 border-slate-200 rounded-sm text-slate-600 focus:ring-elite-500">
             <option>Current FY</option>
             <option>Previous FY</option>
           </select>
        </div>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={REVENUE_DATA}>
              <defs>
                <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#064e3b" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#064e3b" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 600}} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 600}} tickFormatter={(value) => `$${value/1000}k`} />
              <RechartsTooltip 
                contentStyle={{backgroundColor: '#0f172a', border: 'none', borderRadius: '4px', color: '#fff'}}
                itemStyle={{color: '#fff', fontSize: '12px'}}
                formatter={(value: number) => [`$${value.toLocaleString()}`, 'Revenue']}
              />
              <Area type="monotone" dataKey="revenue" stroke="#059669" strokeWidth={2} fillOpacity={1} fill="url(#colorRev)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      <div className="bg-white p-8 rounded-sm border border-slate-200 shadow-sm flex flex-col">
        <h3 className="text-lg font-bold text-slate-900 font-serif mb-6">System Intelligence</h3>
        <div className="space-y-4 flex-1 overflow-y-auto pr-2">
          <div className="p-4 bg-red-50/50 rounded-sm border border-red-100 hover:bg-red-50 transition-colors cursor-pointer group">
            <div className="flex items-center mb-2">
              <ShieldCheckIcon className="w-4 h-4 text-red-600 mr-2" />
              <span className="font-bold text-red-900 text-xs uppercase tracking-wider">Compliance Risk</span>
            </div>
            <p className="text-xs text-red-700 leading-relaxed">Pesticide Applicator license expires in 22 days. Renew via NC Agriculture portal.</p>
          </div>
          
          <div className="p-4 bg-blue-50/50 rounded-sm border border-blue-100 hover:bg-blue-50 transition-colors cursor-pointer group">
            <div className="flex items-center mb-2">
              <Droplet className="w-4 h-4 text-blue-600 mr-2" />
              <span className="font-bold text-blue-900 text-xs uppercase tracking-wider">Operational Window</span>
            </div>
            <p className="text-xs text-blue-700 leading-relaxed">Winterization scheduling active. Zone 3 temps dropping below threshold.</p>
          </div>
        </div>
        <button className="w-full mt-4 py-3 text-xs uppercase tracking-widest text-slate-500 hover:text-elite-600 font-bold border-t border-slate-100">All Notifications</button>
      </div>
    </div>
  </div>
);

const LeadsCRM = () => {
  return (
    <div className="bg-white rounded-sm border border-slate-200 shadow-sm overflow-hidden animate-fade-in-up">
      <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/30">
        <div>
          <h3 className="text-lg font-bold text-slate-900 font-serif">Lead Pipeline</h3>
        </div>
        <div className="flex gap-3">
          <button className="px-5 py-2 bg-white border border-slate-200 rounded-sm text-xs font-bold uppercase tracking-wider text-slate-600 hover:bg-slate-50">Export</button>
          <button className="px-5 py-2 bg-elite-900 text-white rounded-sm text-xs font-bold uppercase tracking-wider hover:bg-slate-800 shadow-lg">New Entry</button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-[10px] tracking-widest border-b border-slate-200">
            <tr>
              <th className="px-6 py-4">Client</th>
              <th className="px-6 py-4">Zone</th>
              <th className="px-6 py-4">Service</th>
              <th className="px-6 py-4">Est. Value</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {MOCK_LEADS.map((lead) => (
              <tr key={lead.id} className="hover:bg-slate-50/50 transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-sm bg-slate-100 flex items-center justify-center text-slate-600 text-xs font-bold mr-3 border border-slate-200">
                      {lead.name.charAt(0)}
                    </div>
                    <div>
                       <div className="font-bold text-slate-900 text-sm">{lead.name}</div>
                       <div className="text-slate-400 text-xs flex items-center mt-0.5">{lead.city}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-0.5 rounded-sm text-[10px] font-bold uppercase tracking-wide border ${lead.distanceRing === 0 ? 'bg-elite-50 text-elite-700 border-elite-100' : 'bg-slate-50 text-slate-600 border-slate-200'}`}>
                    Ring {lead.distanceRing}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-slate-600 font-medium text-xs">{lead.serviceInterest}</span>
                </td>
                <td className="px-6 py-4 font-serif font-bold text-slate-900">${lead.value.toLocaleString()}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider
                    ${lead.status === LeadStatus.NEW ? 'bg-blue-50 text-blue-700 border border-blue-100' : ''}
                    ${lead.status === LeadStatus.BOOKED ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : ''}
                    ${lead.status === LeadStatus.ESTIMATED ? 'bg-amber-50 text-amber-700 border border-amber-100' : ''}
                    ${lead.status === LeadStatus.CONTACTED ? 'bg-slate-100 text-slate-600 border border-slate-200' : ''}
                  `}>
                    {lead.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="text-slate-400 hover:text-elite-600 p-2 hover:bg-slate-100 rounded-sm transition-all">
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const ComplianceView = () => (
  <div className="space-y-8 animate-fade-in-up">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {MOCK_COMPLIANCE.map((rec) => (
        <div key={rec.id} className="bg-white p-6 rounded-sm border border-slate-200 shadow-sm relative overflow-hidden group hover:border-elite-300 transition-all">
          <div className={`absolute top-0 left-0 w-1 h-full ${rec.status === 'Valid' ? 'bg-elite-600' : 'bg-red-500'}`}></div>
          <div className="pl-4">
            <div className="flex justify-between items-start mb-4">
               <ShieldCheckIcon className="w-5 h-5 text-slate-400" />
               <span className={`text-[10px] font-bold px-2 py-0.5 rounded-sm uppercase tracking-wider border ${rec.status === 'Valid' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-red-50 text-red-700 border-red-100'}`}>
                 {rec.status}
               </span>
            </div>
            <h4 className="text-sm font-bold text-slate-900 mb-1">{rec.name}</h4>
            <div className="flex justify-between items-end mt-4">
                <span className="text-xs font-mono text-slate-500 bg-slate-50 px-2 py-1 rounded border border-slate-100">{rec.licenseNumber}</span>
                <span className="text-[10px] text-slate-400 font-medium">Exp: {rec.expiryDate}</span>
            </div>
          </div>
        </div>
      ))}
    </div>

    <div className="bg-slate-900 p-8 rounded-sm shadow-xl text-white relative overflow-hidden">
      <div className="absolute right-0 top-0 opacity-10">
          <Trees className="w-64 h-64 -mr-16 -mt-16" />
      </div>
      <div className="relative z-10 flex flex-col md:flex-row justify-between md:items-center gap-6">
        <div>
          <h3 className="text-xl font-serif font-bold text-white mb-2">Backflow Registry Sync</h3>
           <p className="text-slate-400 text-sm max-w-xl">
            Automated compliance tracking active. System checks NC Statute 130A-330 requirements daily.
          </p>
        </div>
        <div className="flex gap-4">
           <button className="bg-white text-slate-900 px-6 py-3 rounded-sm text-xs font-bold uppercase tracking-widest hover:bg-slate-200 transition-all">Run Sync</button>
           <button className="border border-slate-700 text-white px-6 py-3 rounded-sm text-xs font-bold uppercase tracking-widest hover:bg-slate-800 transition-all">Export Log</button>
        </div>
      </div>
    </div>
  </div>
);

function ShieldCheckIcon(props: any) {
  return <ShieldCheck {...props} />
}

// --- Main Layout ---

export const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isCopilotOpen, setIsCopilotOpen] = useState(false);
  
  // Use a random problem from the library to simulate an "AI Insight"
  const randomProblem = problems[0]; // Just picking the first one for now

  return (
    <div className="min-h-screen bg-slate-100 font-sans selection:bg-elite-200">
      <AdminSidebar active={activeTab} setActive={setActiveTab} />
      
      <div className="lg:ml-72 min-h-screen flex flex-col transition-all duration-300">
        {/* Header */}
        <header className="bg-white h-20 border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-10">
          <div className="flex items-center">
            <h2 className="text-2xl font-serif font-bold text-slate-900 capitalize tracking-tight">{activeTab.replace('-', ' ')}</h2>
          </div>
          <div className="flex items-center space-x-6">
            <div className="hidden md:flex items-center bg-slate-50 border border-slate-200 rounded-sm px-3 py-2 w-64 focus-within:ring-1 focus-within:ring-elite-500">
              <Search className="w-4 h-4 text-slate-400 mr-3" />
              <input 
                type="text" 
                placeholder="Search OS..." 
                className="bg-transparent border-none outline-none text-sm w-full placeholder:text-slate-400 text-slate-700"
              />
            </div>
            <button className="p-2 text-slate-400 hover:text-elite-600 transition-all relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
            </button>
            <button className="p-2 text-slate-400 hover:text-slate-600 lg:hidden">
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-[1600px] mx-auto">
            <div className="mb-8 flex justify-end">
               <div className="text-[10px] font-bold text-elite-700 bg-elite-50 px-3 py-1 rounded-full border border-elite-100 flex items-center shadow-sm">
                 <span className="w-1.5 h-1.5 bg-elite-500 rounded-full inline-block mr-2 animate-pulse"></span>
                 SYSTEM OPERATIONAL
               </div>
            </div>

            {activeTab === 'dashboard' && <DashboardHome />}
            {activeTab === 'leads' && <LeadsCRM />}
            {activeTab === 'compliance' && <ComplianceView />}
            {['schedule', 'routes', 'estimates'].includes(activeTab) && (
              <div className="flex flex-col items-center justify-center h-96 border border-dashed border-slate-300 rounded-sm text-slate-400 bg-slate-50">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm border border-slate-100">
                  <Settings className="w-6 h-6 text-slate-300" />
                </div>
                <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest">Module Provisioning</h3>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Copilot Floating Button */}
      <div className="fixed bottom-8 right-8 z-50">
        <button 
          onClick={() => setIsCopilotOpen(!isCopilotOpen)}
          className={`
            w-14 h-14 rounded-full shadow-2xl transition-all duration-300 flex items-center justify-center border-4 border-white
            ${isCopilotOpen ? 'bg-slate-900 rotate-90 scale-90' : 'bg-elite-600 hover:bg-elite-700 hover:scale-105'}
            text-white
          `}
        >
          {isCopilotOpen ? <X className="w-6 h-6" /> : <MessageSquare className="w-6 h-6" />}
        </button>
      </div>

      {/* Copilot Interface */}
      {isCopilotOpen && (
        <div className="fixed bottom-28 right-8 w-96 h-[600px] bg-white rounded-lg shadow-2xl border border-slate-200 flex flex-col z-40 overflow-hidden animate-fade-in-up origin-bottom-right">
           <div className="bg-slate-900 text-white p-6 shadow-md">
              <div className="flex items-center">
                 <div className="w-8 h-8 bg-elite-600 rounded-sm flex items-center justify-center mr-4 shadow-glow">
                    <Lightbulb className="w-4 h-4 text-white" />
                 </div>
                 <div>
                    <h3 className="font-serif font-bold text-lg">Elite AI</h3>
                    <p className="text-[10px] text-slate-400 uppercase tracking-widest">Operations Agent</p>
                 </div>
              </div>
           </div>
           <div className="flex-1 p-6 bg-slate-50 overflow-y-auto space-y-6">
              <div className="flex justify-center text-[10px] text-slate-400 font-bold uppercase tracking-widest my-2">Today</div>
              
              <div className="flex justify-start">
                 <div className="bg-white border border-slate-200 p-4 rounded-lg rounded-tl-none text-sm shadow-sm text-slate-700 max-w-[90%] leading-relaxed">
                    Hello John. <br/><br/>Analysis complete. <span className="font-bold text-slate-900">Alpha Crew</span> has 2 hours of slack time in Ring 1 tomorrow. <br/><br/>Should I maximize route efficiency?
                 </div>
              </div>
              
              <div className="flex justify-end">
                 <div className="bg-slate-800 text-white p-4 rounded-lg rounded-tr-none text-sm shadow-md max-w-[90%] leading-relaxed">
                    Yes, look for high-value repairs.
                 </div>
              </div>
              
              <div className="flex justify-start">
                 <div className="bg-white border border-slate-200 p-4 rounded-lg rounded-tl-none text-sm shadow-sm text-slate-700 max-w-[90%]">
                    <div className="flex items-center text-elite-600 mb-3 font-bold text-[10px] uppercase tracking-widest">
                       <CheckCircle className="w-3 h-3 mr-2" /> Insight Found
                    </div>
                    <div className="space-y-3">
                       <div className="p-3 bg-slate-50 rounded border border-slate-200 hover:border-elite-300 transition-colors cursor-pointer">
                          <div className="font-bold text-slate-900 text-xs">{randomProblem.title}</div>
                          <div className="text-[10px] text-slate-500 mt-1">{randomProblem.aeoShortAnswer.substring(0, 80)}...</div>
                          <div className="flex justify-between mt-2 text-[10px] text-slate-500 uppercase tracking-wide">
                             <span className="text-red-600 font-bold">{randomProblem.severity}</span>
                             <span>+12min Drive</span>
                          </div>
                       </div>
                    </div>
                 </div>
              </div>
           </div>
           <div className="p-4 bg-white border-t border-slate-100">
              <div className="relative">
                 <input 
                   type="text" 
                   placeholder="Command OS..." 
                   className="w-full bg-slate-50 border border-slate-200 rounded px-4 py-3 text-sm focus:outline-none focus:border-elite-500 transition-all pr-10 placeholder:text-slate-400 font-medium" 
                 />
                 <button className="absolute right-2 top-2 p-1.5 bg-elite-900 text-white rounded hover:bg-slate-800 transition-colors">
                    <ArrowRight className="w-3 h-3" />
                 </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};
