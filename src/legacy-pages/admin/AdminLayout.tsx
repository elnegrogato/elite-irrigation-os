// src/pages/admin/AdminLayout.tsx
import { PropsWithChildren, useEffect, useState } from "react";
import Link from "next/link";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { ChatMessage } from "../../components/AICopilot";
import { AICopilot } from "../../components/AICopilot";
import { useAuth } from "../../components/AuthProvider";
import ProtectedRoute from "../../components/ProtectedRoute";
import {
  LayoutDashboard, Users, Calendar, Truck, FileText,
  Inbox, BarChart2, Radio, Trees, BookOpen, ShieldCheck, Activity, Map, ClipboardList, FileEdit, DollarSign, Wrench, HardHat, Package, Mail, TrendingUp, LogOut,
Settings } from 'lucide-react';

const NavItem = ({ to, label, icon: Icon }: { to: string; label: string; icon: any }) => {
  const loc = useLocation();
  const active = loc.pathname === to || (to !== "/admin" && loc.pathname.startsWith(to));
  return (
    <Link
      to={to}
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
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, loading } = useAuth();

  // Get user ID for chat history
  const userId = user?._id?.toString() || 'default-user';

  // Get chat history from Convex
  const chatHistory = useQuery(
    api.aiCopilot.getChatHistory,
    { userId, limit: 50 },
    { skip: !user }
  ) as ChatMessage[] | undefined;

  const saveMessage = useMutation(api.aiCopilot.saveChatMessage);
  const generateResponse = useMutation(api.aiCopilot.generateAIResponse);

  // Handle logout
  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  // Get current page context from pathname
  const getContext = () => {
    const path = location.pathname;
    if (path === '/admin') return 'dashboard';
    if (path.includes('/leads')) return 'leads';
    if (path.includes('/inbox')) return 'inbox';
    if (path.includes('/work-orders')) return 'work orders';
    if (path.includes('/invoices')) return 'invoices';
    if (path.includes('/approvals')) return 'approvals';
    if (path.includes('/estimates')) return 'estimates';
    if (path.includes('/calendar')) return 'schedule';
    if (path.includes('/routes')) return 'routes';
    if (path.includes('/week')) return 'week planner';
    if (path.includes('/inventory')) return 'inventory';
    if (path.includes('/fleet')) return 'fleet';
    if (path.includes('/staff')) return 'staff';
    if (path.includes('/compliance')) return 'compliance';
    if (path.includes('/sources')) return 'analytics';
    if (path.includes('/content')) return 'content';
    if (path.includes('/case-studies')) return 'case studies';
    if (path.includes('/automations')) return 'automations';
    if (path.includes('/policy')) return 'policy';
    if (path.includes('/agent-runs')) return 'agent runs';
    return 'dashboard';
  };

  const context = getContext();

  // Handle sending messages
  const handleSendMessage = async (message: string, context?: string): Promise<string> => {
    try {
      // Save user message
      await saveMessage({
        userId,
        role: 'user',
        content: message,
        context
      });

      // Generate AI response
      const response = await generateResponse({
        message,
        context
      });

      // Save assistant message
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

  // Get initials for avatar
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Get role display name
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
      {loading ? (
        <div className="min-h-screen flex items-center justify-center bg-slate-100">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-elite-200 border-t-elite-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-sm text-slate-600 font-medium">Loading...</p>
          </div>
        </div>
      ) : (
        <div className="min-h-screen bg-slate-100 font-sans selection:bg-elite-200 flex">
      {/* Sidebar */}
      <div className="hidden lg:flex flex-col w-72 bg-slate-950 border-r border-slate-900 min-h-screen fixed left-0 top-0 shadow-2xl z-20">
        <div className="p-8 flex items-center gap-3">
          <div className="w-8 h-8 bg-elite-600 rounded-sm flex items-center justify-center text-white">
             <Trees className="w-5 h-5" />
          </div>
          <h1 className="text-xl font-serif font-black text-white tracking-tight">
            Elite<span className="text-elite-500">.</span> <span className="ml-1 text-[10px] font-sans font-medium text-slate-500 uppercase tracking-widest">OS</span>
          </h1>
        </div>

        <div className="px-4 mb-4 flex-1 overflow-y-auto custom-scrollbar">
          <div className="text-[10px] font-bold text-slate-600 uppercase tracking-[0.2em] px-4 mb-4">Operations</div>
          <nav className="space-y-1 mb-8">
            <NavItem to="/admin" label="Dashboard" icon={LayoutDashboard} />
            <NavItem to="/admin/inbox" label="Unified Inbox" icon={Inbox} />
            <NavItem to="/admin/emails" label="Emails" icon={Mail} />
            <NavItem to="/admin/leads" label="Leads & CRM" icon={Users} />
            <NavItem to="/admin/work-orders" label="Work Orders" icon={ClipboardList} />
            <NavItem to="/admin/invoices" label="Invoices" icon={DollarSign} />
            <NavItem to="/admin/approvals" label="Approvals" icon={ShieldCheck} />
            <NavItem to="/admin/estimates" label="Estimates" icon={FileText} />
            <NavItem to="/admin/calendar" label="Schedule" icon={Calendar} />
            <NavItem to="/admin/routes" label="Routes Density" icon={Truck} />
            <NavItem to="/admin/week" label="Week Planner" icon={Map} />
            <NavItem to="/admin/inventory" label="Inventory & Parts" icon={Package} />
            <NavItem to="/admin/fleet" label="Fleet & Equipment" icon={Wrench} />
            <NavItem to="/admin/staff" label="Staff & Crews" icon={HardHat} />
            <NavItem to="/admin/compliance" label="Compliance" icon={ShieldCheck} />
          </nav>

          <div className="text-[10px] font-bold text-slate-600 uppercase tracking-[0.2em] px-4 mb-4">Intelligence</div>
          <nav className="space-y-1">
            <NavItem to="/admin/sources" label="Analytics" icon={BarChart2} />
            <NavItem to="/admin/reports" label="Reports" icon={FileText} />
            <NavItem to="/admin/forecasting" label="Forecasting" icon={TrendingUp} />
            <NavItem to="/admin/performance" label="Performance" icon={Activity} />
            <NavItem to="/admin/content" label="Content Factory" icon={BookOpen} />
            <NavItem to="/admin/case-studies" label="Case Studies" icon={FileText} />
            <NavItem to="/admin/case-study-drafts" label="Drafts" icon={FileEdit} />
            <NavItem to="/admin/automations" label="Automations" icon={Radio} />
            <NavItem to="/admin/policy" label="SEC Policy" icon={ShieldCheck} />
            <NavItem to="/admin/agent-runs" label="Agent Runs" icon={Activity} />
          </nav>

          <div className="text-[10px] font-bold text-slate-600 uppercase tracking-[0.2em] px-4 mb-4">System</div>
          <nav className="space-y-1">
            <NavItem to="/admin/config" label="Configuration" icon={Settings} />
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
      </div>

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
      )}
    </ProtectedRoute>
  );
}