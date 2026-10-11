'use client';

import { TrendingUp, Users, Truck, AlertTriangle, ShieldCheck, Droplet, CheckCircle, Sparkles, Trophy, DollarSign, Route } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import Link from "next/link";
import { memo, useMemo } from "react";
import { useAuth } from "../../src/components/AuthProvider";

const StatCard = memo(({ title, value, sub, icon: Icon, trend }: { title: string, value: string, sub: string, icon: any, trend: 'up' | 'down' | 'neutral' }) => (
  <div className="bg-white p-6 rounded-sm border border-slate-200 hover:border-elite-200 transition-all shadow-sm hover:shadow-lg group">
    <div className="flex justify-between items-start mb-4">
      <div className="p-3 bg-slate-50 rounded-sm group-hover:bg-elite-50 transition-colors">
        <Icon className="w-5 h-5 text-slate-400 group-hover:text-elite-600 transition-colors" />
      </div>
      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase tracking-wider ${
        trend === 'up' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
        trend === 'down' ? 'bg-red-50 text-red-700 border-red-100' :
        'bg-slate-50 text-slate-600 border-slate-100'
      }`}>
        {trend === 'up' ? '+' : ''}{sub}
      </span>
    </div>
    <h3 className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.1em]">{title}</h3>
    <p className="text-3xl font-serif font-bold text-slate-900 mt-2">{value}</p>
  </div>
));

StatCard.displayName = 'StatCard';

function AdminDashboardClient() {
  const { token } = useAuth();
  const stats = useQuery(api.stats.getDashboardStats, token ? { token } : "skip") || {
    revenue: 0,
    revenueGrowth: 0,
    newLeadsCount: 0,
    activeLeadsCount: 0,
    efficiency: 0,
    alerts: [],
    chartData: []
  };

  // Fetch additional analytics data
  const revenueForecast = useQuery(api.analytics.forecastRevenue, { monthsAhead: 1 });
  const seasonalTrends = useQuery(api.analytics.predictSeasonalTrends);
  const servicePerformance = useQuery(api.analytics.getServicePerformance);

  // Route optimization data
  const todayRoutesResult = useQuery(api.routeOptimization.getRoutesForDate);
  const pendingSuggestionsResult = useQuery(api.optimizationSuggestions.getPendingSuggestions);
  const todayRoutes = useMemo(() => todayRoutesResult ?? [], [todayRoutesResult]);
  const pendingSuggestions = useMemo(() => pendingSuggestionsResult ?? [], [pendingSuggestionsResult]);

  // Memoize route stats calculations
  const routeStats = useMemo(() => ({
    total: todayRoutes.length,
    optimized: todayRoutes.filter(r => r.isOptimized).length,
    avgScore: todayRoutes.length > 0
      ? todayRoutes.reduce((sum, r) => sum + r.optimizationScore, 0) / todayRoutes.length
      : 0,
    pendingSuggestions: pendingSuggestions.length,
  }), [todayRoutes, pendingSuggestions]);

  return (
    <div className="space-y-8 animate-fade-in-up">
        <div className="flex justify-between items-center mb-8">
           <h2 className="text-2xl font-serif font-bold text-slate-900">Dashboard</h2>
           <div className="text-[10px] font-bold text-elite-700 bg-elite-50 px-3 py-1 rounded-full border border-elite-100 flex items-center shadow-sm">
             <span className="w-1.5 h-1.5 bg-elite-500 rounded-full inline-block mr-2 animate-pulse"></span>
             SYSTEM OPERATIONAL
           </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard 
            title="Monthly Revenue" 
            value={`$${stats.revenue.toLocaleString()}`} 
            sub={`${stats.revenueGrowth}%`} 
            icon={TrendingUp} 
            trend="up" 
          />
          <StatCard 
            title="Active Leads" 
            value={stats.activeLeadsCount.toString()} 
            sub={`${stats.newLeadsCount} New`} 
            icon={Users} 
            trend="up" 
          />
          <StatCard 
            title="Route Eff." 
            value={`${stats.efficiency}%`} 
            sub="Stable" 
            icon={Truck} 
            trend="neutral" 
          />
          <StatCard 
            title="System Alerts" 
            value={stats.alerts.length.toString()} 
            sub={stats.alerts.length > 0 ? "Action Req" : "Clear"} 
            icon={stats.alerts.length > 0 ? AlertTriangle : CheckCircle} 
            trend={stats.alerts.length > 0 ? "down" : "up"} 
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white p-8 rounded-sm border border-slate-200 shadow-sm">
            <div className="flex justify-between items-center mb-8">
               <div>
                 <h3 className="text-lg font-bold text-slate-900 font-serif">Revenue Performance</h3>
                 <p className="text-xs text-slate-500 uppercase tracking-wider mt-1">6 Month Trend</p>
               </div>
               <select className="text-xs font-bold uppercase tracking-wider bg-slate-50 border-slate-200 rounded-sm text-slate-600 focus:ring-elite-500">
                 <option>Current FY</option>
                 <option>Previous FY</option>
               </select>
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={stats.chartData}>
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
            <h3 className="text-lg font-bold text-slate-900 font-serif mb-6">Live Alerts</h3>
            
            {stats.alerts.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
                    <CheckCircle className="w-12 h-12 mb-2 opacity-20" />
                    <p className="text-sm">All systems normal.</p>
                </div>
            ) : (
                <div className="space-y-4 flex-1 overflow-y-auto pr-2">
                {stats.alerts.map((alert: any) => (
                    <div key={alert.id} className="p-4 bg-red-50/50 rounded-sm border border-red-100 hover:bg-red-50 transition-colors cursor-pointer group">
                        <div className="flex items-center mb-2">
                        {alert.type === 'approval' ? <ShieldCheck className="w-4 h-4 text-red-600 mr-2" /> :
                         alert.type === 'failed_sms' ? <AlertTriangle className="w-4 h-4 text-red-600 mr-2" /> :
                         <AlertTriangle className="w-4 h-4 text-red-600 mr-2" />}
                        
                        <span className="font-bold text-red-900 text-xs uppercase tracking-wider">
                            {alert.type.replace('_', ' ')}
                        </span>
                        </div>
                        <p className="text-xs text-red-700 leading-relaxed">{alert.msg}</p>
                    </div>
                ))}
                </div>
            )}
            
            <Link href="/admin/alerts" className="w-full mt-4 py-3 text-xs uppercase tracking-widest text-slate-500 hover:text-elite-600 font-bold border-t border-slate-100 text-center block">
                View All Notifications
            </Link>
          </div>

          {/* Performance Snapshot */}
          <div className="bg-white p-6 rounded-sm border border-slate-200 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 font-serif mb-4">Performance Snapshot</h3>

            <div className="space-y-4">
              {revenueForecast && revenueForecast.forecast.length > 0 && (
                <div className="flex items-center justify-between p-3 bg-elite-50 rounded-sm border border-elite-100">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-elite-600" />
                    <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Next Month Forecast</span>
                  </div>
                  <span className="text-sm font-bold text-elite-700">
                    ${revenueForecast.forecast[0].predicted.toLocaleString()}
                  </span>
                </div>
              )}

              {servicePerformance && servicePerformance.length > 0 && (
                <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-sm border border-emerald-100">
                  <div className="flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-emerald-600" />
                    <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Top Service</span>
                  </div>
                  <span className="text-sm font-bold text-emerald-700">
                    {servicePerformance[0].serviceSlug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                  </span>
                </div>
              )}

              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-sm border border-blue-100">
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-blue-600" />
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Revenue Trend</span>
                </div>
                <div className="flex items-center gap-2">
                  {revenueForecast?.trend === 'increasing' ? (
                    <>
                      <TrendingUp className="w-4 h-4 text-emerald-600" />
                      <span className="text-sm font-bold text-emerald-700">Up</span>
                    </>
                  ) : revenueForecast?.trend === 'decreasing' ? (
                    <>
                      <AlertTriangle className="w-4 h-4 text-red-600" />
                      <span className="text-sm font-bold text-red-700">Down</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4 text-slate-600" />
                      <span className="text-sm font-bold text-slate-700">Stable</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Seasonality Alert */}
            {seasonalTrends && seasonalTrends.seasonalityAlerts.length > 0 && (
              <div className="mt-4 p-3 bg-amber-50 rounded-sm border border-amber-100">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs font-bold text-amber-900 uppercase tracking-wider">
                      {seasonalTrends.seasonalityAlerts[0].type.replace('_', ' ')}
                    </p>
                    <p className="text-xs text-amber-800 mt-1">
                      {seasonalTrends.seasonalityAlerts[0].message}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Trend Indicators */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-sm border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">Revenue Growth</span>
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full border border-emerald-100">
                +{stats.revenueGrowth}%
              </span>
            </div>
            <div className="flex items-center gap-2 mt-3">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
              <span className="text-sm text-slate-700">Above target</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-sm border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">Lead Volume</span>
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full border border-emerald-100">
                +{((stats.newLeadsCount / 50) * 100).toFixed(0)}%
              </span>
            </div>
            <div className="flex items-center gap-2 mt-3">
              <Users className="w-4 h-4 text-emerald-600" />
              <span className="text-sm text-slate-700">Growing steadily</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-sm border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">Efficiency</span>
              <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-full border border-blue-100">
                {stats.efficiency}%
              </span>
            </div>
            <div className="flex items-center gap-2 mt-3">
              <Truck className="w-4 h-4 text-blue-600" />
              <span className="text-sm text-slate-700">Optimal range</span>
            </div>
          </div>
        </div>

        {/* Route Optimization Widget */}
        <div className="bg-gradient-to-br from-elite-50 to-blue-50 p-8 rounded-sm border border-elite-200 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-elite-100 rounded-lg">
                <Route className="w-6 h-6 text-elite-700" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 font-serif">Route Optimization</h3>
                <p className="text-xs text-slate-600 uppercase tracking-wider mt-1">Daily Overview</p>
              </div>
            </div>
            <Link
              href="/admin/routes"
              className="px-4 py-2 bg-elite-700 text-white rounded-lg hover:bg-elite-800 font-medium text-sm transition-colors"
            >
              View Routes
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white p-4 rounded-lg border border-elite-100">
              <div className="text-xs text-slate-600 mb-1">Today's Routes</div>
              <div className="text-2xl font-bold text-elite-700">{routeStats.total}</div>
              <div className="text-xs text-slate-500 mt-1">
                {routeStats.optimized} optimized
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg border border-elite-100">
              <div className="text-xs text-slate-600 mb-1">Avg Efficiency</div>
              <div className="text-2xl font-bold text-elite-700">
                {Math.round(routeStats.avgScore)}%
              </div>
              <div className="text-xs text-green-600 mt-1">
                {routeStats.avgScore >= 70 ? 'Excellent' : routeStats.avgScore >= 50 ? 'Good' : 'Needs Attention'}
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg border border-elite-100">
              <div className="text-xs text-slate-600 mb-1">Pending Suggestions</div>
              <div className="text-2xl font-bold text-amber-600">{routeStats.pendingSuggestions}</div>
              <div className="text-xs text-slate-500 mt-1">
                {routeStats.pendingSuggestions > 0 ? 'Action needed' : 'All caught up'}
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg border border-elite-100">
              <div className="text-xs text-slate-600 mb-1">Optimization Rate</div>
              <div className="text-2xl font-bold text-elite-700">
                {routeStats.total > 0 ? Math.round((routeStats.optimized / routeStats.total) * 100) : 0}%
              </div>
              <div className="text-xs text-slate-500 mt-1">
                {routeStats.total > 0 && routeStats.optimized / routeStats.total >= 0.7 ? 'On track' : 'Room to improve'}
              </div>
            </div>
          </div>

          {pendingSuggestions.length > 0 && (
            <div className="mt-6 p-4 bg-amber-50 rounded-lg border border-amber-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <span className="text-sm font-bold text-amber-900">
                    {pendingSuggestions.length} optimization suggestion{pendingSuggestions.length > 1 ? 's' : ''} pending
                  </span>
                </div>
                <Link
                  href="/admin/routes"
                  className="text-sm text-amber-700 hover:text-amber-800 font-medium"
                >
                  Review →
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
  );
}

// Memoize the entire dashboard
export default memo(AdminDashboardClient);
