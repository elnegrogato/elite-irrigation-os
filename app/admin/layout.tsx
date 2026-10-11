'use client';

import { PropsWithChildren, useMemo } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { ChatMessage } from "../../src/components/AICopilot";
import { AICopilot } from "../../src/components/AICopilot";
import { useAuth } from "../../src/components/AuthProvider";
import ProtectedRoute from "../../src/components/ProtectedRoute";
import {
  LayoutDashboard, Users, Calendar, Truck, FileText,
  Inbox, BarChart2, Radio, Trees, BookOpen, ShieldCheck, Activity, Map, ClipboardList, FileEdit, DollarSign, Wrench, HardHat, Package, Mail, TrendingUp, LogOut,
  Settings
} from 'lucide-react';

const NavItem = ({ href, label, icon: Icon }: { href: string; label: string; icon: any }) => {
  const pathname = usePathname();
  const active = pathname === href || (href !== "/admin" && pathname.startsWith(href));
  return (
    <Link
      href={href}
      className={`flex items-center px-4 py-3 text-sm font-medium rounded-sm transition-all duration-200 group ${
        active 
          ? 'bg-elite-900/50 text-white border-l-2 border-elite-500' 
          : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200 border-l-2 border-transparent'
      }`}
    >
      <Icon className={`w-4 h-4 mr-3 transition-colors ${active ? 'text-elite-500' : 'text-slate-600 group-hover:text-slate-400'}`} />
      {label}
    </Link>
  );
};

export default function AdminLayout({ children }: PropsWithChildren) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout, loading } = useAuth();

  // Get user ID for chat history
  const userId = user?._id?.toString() || 'default-user';

  // Get chat history from Convex
  const chatHistory = useQuery(
    api.aiCopilot.getChatHistory,
    user ? { userId, limit: 50 } : "skip"
  ) as ChatMessage[] | undefined;

  const saveMessage = useMutation(api.aiCopilot.saveChatMessage);
  const generateResponse = useMutation(api.aiCopilot.generateAIResponse);

  // Handle logout
  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  // Get current page context from pathname
  const context = useMemo(() => {
    if (pathname === '/admin') return 'dashboard';
    if (pathname.includes('/leads')) return 'leads';
    if (pathname.includes('/inbox')) return 'inbox';
    if (pathname.includes('/work-orders')) return 'work orders';
    if (pathname.includes('/invoices')) return 'invoices';
    if (pathname.includes('/approvals')) return 'approvals';
    if (pathname.includes('/estimates')) return 'estimates';
    if (pathname.includes('/calendar')) return 'schedule';
    if (pathname.includes('/routes')) return 'routes';
    if (pathname.includes('/week')) return 'week planner';
    if (pathname.includes('/inventory')) return 'inventory';
    if (pathname.includes('/fleet')) return 'fleet';
    if (pathname.includes('/staff')) return 'staff';
    if (pathname.includes('/compliance')) return 'compliance';
    if (pathname.includes('/sources')) return 'analytics';
    if (pathname.includes('/content')) return 'content';
    if (pathname.includes('/case-studies')) return 'case studies';
    if (pathname.includes('/automations')) return 'automations';
    if (pathname.includes('/policy')) return 'policy';
    if (pathname.includes('/agent-runs')) return 'agent runs';
    return 'dashboard';
  }, [pathname]);

  // Handle sending messages
  const handleSendMessage = async (message: string, context?: string): Promise<string> => {
    try {
      await saveMessage({
        userId,
        role: 'user',
        content: message,
        context
      });
      const response = await generateResponse({
        message,
        context
      });
      await saveMessage({
        userId,
        role: 'assistant',
        content: response,
        context
      });
      return response;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const getRoleDisplay = (role: string) => {
    const roleMap: Record<string, string> = {
      admin: 'Administrator',
      manager: 'Manager',
      foreman: 'Foreman',
      tech: 'Technician',
    };
    return roleMap[role] || role;
  };

  return (
    <ProtectedRoute requireRole={['admin', 'manager', 'foreman']}>
      <div className="min-h-screen bg-slate-100 font-sans selection:bg-elite-200 flex">
        {/* Sidebar */}
        <aside className="hidden lg:flex flex-col w-72 bg-slate-950 border-r border-slate-900 min-h-screen fixed left-0 top-0 shadow-2xl z-20">
          <div className="p-8 flex items-center gap-3">
            <div className="w-8 h-8 bg-elite-600 rounded-sm flex items-center justify-center text-white">
               <Trees className="w-5 h-5" />
            </div>
            <Link href="/" className="text-xl font-serif font-black text-white tracking-tight">
              Elite<span className="text-elite-500">.</span> <span className="ml-1 text-[10px] font-sans font-medium text-slate-500 uppercase tracking-widest">Ops</span>
            </Link>
          </div>

          <div className="px-4 mb-4 flex-1 overflow-y-auto custom-scrollbar text-slate-300">
            <div className="text-[10px] font-bold text-slate-600 uppercase tracking-[0.2em] px-4 mb-4">Operations</div>
            <nav className="space-y-1 mb-8">
              <NavItem href="/admin" label="Dashboard" icon={LayoutDashboard} />
              <NavItem href="/admin/inbox" label="Unified Inbox" icon={Inbox} />
              <NavItem href="/admin/emails" label="Emails" icon={Mail} />
              <NavItem href="/admin/leads" label="Leads & CRM" icon={Users} />
              <NavItem href="/admin/work-orders" label="Work Orders" icon={ClipboardList} />
              <NavItem href="/admin/invoices" label="Invoices" icon={DollarSign} />
              <NavItem href="/admin/approvals" label="Approvals" icon={ShieldCheck} />
              <NavItem href="/admin/estimates" label="Estimates" icon={FileText} />
              <NavItem href="/admin/calendar" label="Schedule" icon={Calendar} />
              <NavItem href="/admin/routes" label="Routes Density" icon={Truck} />
              <NavItem href="/admin/week" label="Week Planner" icon={Map} />
              <NavItem href="/admin/inventory" label="Inventory & Parts" icon={Package} />
              <NavItem href="/admin/fleet" label="Fleet & Equipment" icon={Wrench} />
              <NavItem href="/admin/staff" label="Staff & Crews" icon={HardHat} />
              <NavItem href="/admin/compliance" label="Compliance" icon={ShieldCheck} />
            </nav>

            <div className="text-[10px] font-bold text-slate-600 uppercase tracking-[0.2em] px-4 mb-4">Intelligence</div>
            <nav className="space-y-1">
              <NavItem href="/admin/sources" label="Analytics" icon={BarChart2} />
              <NavItem href="/admin/reports" label="Reports" icon={FileText} />
              <NavItem href="/admin/forecasting" label="Forecasting" icon={TrendingUp} />
              <NavItem href="/admin/performance" label="Performance" icon={Activity} />
              <NavItem href="/admin/content" label="Content Factory" icon={BookOpen} />
              <NavItem href="/admin/case-studies" label="Case Studies" icon={FileText} />
              <NavItem href="/admin/case-study-drafts" label="Drafts" icon={FileEdit} />
              <NavItem href="/admin/automations" label="Automations" icon={Radio} />
              <NavItem href="/admin/policy" label="SEC Policy" icon={ShieldCheck} />
              <NavItem href="/admin/agent-runs" label="Agent Runs" icon={Activity} />
            </nav>
          </div>

          <div className="mt-auto p-6 border-t border-slate-900">
            <div className="flex items-center justify-between">
              <div className="flex items-center flex-1">
                <div className="w-8 h-8 rounded-sm bg-gradient-to-br from-elite-400 to-elite-600 flex items-center justify-center text-white font-bold text-xs shadow-md">
                  {user ? getInitials(user.name) : '??'}
                </div>
                <div className="ml-3 overflow-hidden">
                  <p className="text-xs font-bold text-white uppercase tracking-wider truncate">
                    {user?.name || 'Unknown User'}
                  </p>
                  <p className="text-[10px] text-slate-500 truncate">
                    {user ? getRoleDisplay(user.role) : 'Loading...'}
                  </p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="ml-2 p-2 text-slate-500 hover:text-slate-300 hover:bg-slate-900 rounded-sm transition-colors"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <div className="lg:ml-72 flex-1 min-h-screen flex flex-col transition-all duration-300">
          <main className="flex-1 p-8 overflow-y-auto">
            <div className="max-w-[1600px] mx-auto">
               {children}
            </div>
          </main>
        </div>

        {/* AI Copilot */}
        {user && (
          <AICopilot
            onSendMessage={handleSendMessage}
            initialHistory={chatHistory || []}
            context={context}
          />
        )}
      </div>
    </ProtectedRoute>
  );
}
