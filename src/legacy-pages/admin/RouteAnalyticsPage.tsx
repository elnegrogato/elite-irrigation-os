// src/pages/admin/RouteAnalyticsPage.tsx
import { useMemo, useState } from "react";
import AdminLayout from "./AdminLayout";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";

export default function RouteAnalyticsPage() {
  const [dateRange, setDateRange] = useState<"7d" | "30d" | "90d">("30d");

  const routes = useQuery(api.routeOptimization.getRoutesForDate) ?? [];
  const suggestionAnalytics = useQuery(api.optimizationSuggestions.getSuggestionAnalytics) ?? {
    total: 0,
    accepted: 0,
    rejected: 0,
    pending: 0,
    acceptanceRate: 0,
    avgImprovement: 0,
    totalSavedDistance: 0,
    totalSavedTime: 0,
  };

  // Calculate analytics from routes
  const analytics = useMemo(() => {
    if (routes.length === 0) {
      return {
        totalRoutes: 0,
        totalStops: 0,
        totalDistance: 0,
        totalTravelTime: 0,
        totalServiceTime: 0,
        avgStopsPerRoute: 0,
        avgTravelTime: 0,
        avgServiceTime: 0,
        avgEfficiencyScore: 0,
        optimizedRoutes: 0,
        manualRoutes: 0,
        avgOptimizedScore: 0,
        avgManualScore: 0,
      };
    }

    const totalRoutes = routes.length;
    const totalStops = routes.reduce((sum, r) => sum + r.stops.length, 0);
    const totalDistance = routes.reduce((sum, r) => sum + r.totalDistance, 0);
    const totalTravelTime = routes.reduce((sum, r) => sum + r.totalTravelTime, 0);
    const totalServiceTime = routes.reduce((sum, r) => sum + r.totalServiceTime, 0);

    const optimizedRoutes = routes.filter((r) => r.isOptimized).length;
    const manualRoutes = routes.filter((r) => !r.isOptimized).length;

    const avgOptimizedScore =
      optimizedRoutes > 0
        ? routes
            .filter((r) => r.isOptimized)
            .reduce((sum, r) => sum + r.optimizationScore, 0) / optimizedRoutes
        : 0;

    const avgManualScore =
      manualRoutes > 0
        ? routes
            .filter((r) => !r.isOptimized)
            .reduce((sum, r) => sum + r.optimizationScore, 0) / manualRoutes
        : 0;

    return {
      totalRoutes,
      totalStops,
      totalDistance,
      totalTravelTime,
      totalServiceTime,
      avgStopsPerRoute: totalStops / totalRoutes,
      avgTravelTime: totalTravelTime / totalRoutes,
      avgServiceTime: totalServiceTime / totalRoutes,
      avgEfficiencyScore:
        routes.reduce((sum, r) => sum + r.optimizationScore, 0) / totalRoutes,
      optimizedRoutes,
      manualRoutes,
      avgOptimizedScore,
      avgManualScore,
    };
  }, [routes]);

  // Calculate crew performance
  const crewPerformance = useMemo(() => {
    const crewMap = new Map<string, any>();

    routes.forEach((route) => {
      if (!route.crewId) return;

      const existing = crewMap.get(route.crewId) || {
        crewId: route.crewId,
        routes: 0,
        stops: 0,
        distance: 0,
        efficiencyScore: 0,
        optimized: 0,
      };

      existing.routes += 1;
      existing.stops += route.stops.length;
      existing.distance += route.totalDistance;
      existing.efficiencyScore += route.optimizationScore;
      if (route.isOptimized) existing.optimized += 1;

      crewMap.set(route.crewId, existing);
    });

    return Array.from(crewMap.values()).map((crew) => ({
      ...crew,
      avgEfficiencyScore: crew.efficiencyScore / crew.routes,
      avgDistance: crew.distance / crew.routes,
      avgStops: crew.stops / crew.routes,
    }));
  }, [routes]);

  const formatMinutes = (minutes: number) => {
    const hrs = Math.floor(minutes / 60);
    const mins = Math.round(minutes % 60);
    return hrs > 0 ? `${hrs}h ${mins}m` : `${mins}m`;
  };

  return (
    <AdminLayout>
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-serif font-bold text-slate-900 mb-2">
            Route Analytics
          </h1>
          <p className="text-sm text-zinc-600">
            Track route optimization performance and crew efficiency metrics
          </p>
        </div>
        <div className="flex gap-2">
          {(["7d", "30d", "90d"] as const).map((range) => (
            <button
              key={range}
              onClick={() => setDateRange(range)}
              className={`px-4 py-2 rounded-lg font-medium text-sm ${
                dateRange === range
                  ? "bg-elite-700 text-white"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              {range === "7d" ? "7 Days" : range === "30d" ? "30 Days" : "90 Days"}
            </button>
          ))}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs text-slate-500 uppercase tracking-wide font-semibold">
                Total Routes
              </div>
              <div className="text-3xl font-bold text-slate-900 mt-1">
                {analytics.totalRoutes}
              </div>
              <div className="text-sm text-slate-600 mt-1">
                {analytics.totalStops} total stops
              </div>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg
                className="w-6 h-6 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs text-slate-500 uppercase tracking-wide font-semibold">
                Avg Efficiency
              </div>
              <div className="text-3xl font-bold text-slate-900 mt-1">
                {Math.round(analytics.avgEfficiencyScore)}%
              </div>
              <div className="text-sm text-green-600 mt-1">
                {analytics.avgOptimizedScore > 0 && (
                  <>Optimized: {Math.round(analytics.avgOptimizedScore)}%</>
                )}
              </div>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <svg
                className="w-6 h-6 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs text-slate-500 uppercase tracking-wide font-semibold">
                Total Distance
              </div>
              <div className="text-3xl font-bold text-slate-900 mt-1">
                {Math.round(analytics.totalDistance)} mi
              </div>
              <div className="text-sm text-slate-600 mt-1">
                Avg {Math.round(analytics.totalDistance / analytics.totalRoutes)} mi/route
              </div>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <svg
                className="w-6 h-6 text-purple-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs text-slate-500 uppercase tracking-wide font-semibold">
                Avg Service Time
              </div>
              <div className="text-3xl font-bold text-slate-900 mt-1">
                {formatMinutes(analytics.avgServiceTime)}
              </div>
              <div className="text-sm text-slate-600 mt-1">
                Travel: {formatMinutes(analytics.avgTravelTime)}
              </div>
            </div>
            <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
              <svg
                className="w-6 h-6 text-amber-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Optimization Impact */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm">
          <div className="bg-slate-50 px-6 py-3 border-b border-slate-200">
            <h2 className="text-lg font-bold text-slate-900">Optimization vs Manual</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <div className="text-sm text-slate-600 mb-2">Optimized Routes</div>
                <div className="text-2xl font-bold text-green-600">
                  {analytics.optimizedRoutes}
                </div>
                <div className="text-xs text-slate-500 mt-1">
                  Avg score: {Math.round(analytics.avgOptimizedScore)}%
                </div>
              </div>
              <div>
                <div className="text-sm text-slate-600 mb-2">Manual Routes</div>
                <div className="text-2xl font-bold text-slate-600">
                  {analytics.manualRoutes}
                </div>
                <div className="text-xs text-slate-500 mt-1">
                  Avg score: {Math.round(analytics.avgManualScore)}%
                </div>
              </div>
            </div>

            {analytics.avgOptimizedScore > 0 && analytics.avgManualScore > 0 && (
              <div className="mt-6 pt-6 border-t border-slate-200">
                <div className="text-sm text-slate-600 mb-2">Performance Gap</div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-slate-100 rounded-full h-3">
                    <div
                      className="bg-green-500 h-3 rounded-full"
                      style={{
                        width: `${Math.min(
                          100,
                          (analytics.avgOptimizedScore / analytics.avgManualScore) * 100
                        )}%`,
                      }}
                    />
                  </div>
                  <div className="text-sm font-bold text-green-600">
                    +{Math.round(
                      ((analytics.avgOptimizedScore - analytics.avgManualScore) /
                        analytics.avgManualScore) *
                        100
                    )}
                    %
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm">
          <div className="bg-slate-50 px-6 py-3 border-b border-slate-200">
            <h2 className="text-lg font-bold text-slate-900">Suggestion Analytics</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <div className="text-sm text-slate-600 mb-2">Total Suggestions</div>
                <div className="text-2xl font-bold text-slate-900">
                  {suggestionAnalytics.total}
                </div>
              </div>
              <div>
                <div className="text-sm text-slate-600 mb-2">Acceptance Rate</div>
                <div className="text-2xl font-bold text-blue-600">
                  {Math.round(suggestionAnalytics.acceptanceRate)}%
                </div>
              </div>
              <div>
                <div className="text-sm text-slate-600 mb-2">Avg Improvement</div>
                <div className="text-2xl font-bold text-green-600">
                  {Math.round(suggestionAnalytics.avgImprovement)}%
                </div>
              </div>
              <div>
                <div className="text-sm text-slate-600 mb-2">Total Savings</div>
                <div className="text-2xl font-bold text-purple-600">
                  {Math.round(suggestionAnalytics.totalSavedDistance)} mi
                </div>
              </div>
            </div>

            {suggestionAnalytics.total > 0 && (
              <div className="mt-6 pt-6 border-t border-slate-200">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-slate-600">Distribution</span>
                </div>
                <div className="flex gap-1">
                  {suggestionAnalytics.accepted > 0 && (
                    <div
                      className="bg-green-500 h-6 rounded-l flex items-center justify-center text-white text-xs font-medium"
                      style={{
                        width: `${(suggestionAnalytics.accepted / suggestionAnalytics.total) * 100}%`,
                      }}
                    >
                      {suggestionAnalytics.accepted}
                    </div>
                  )}
                  {suggestionAnalytics.rejected > 0 && (
                    <div
                      className="bg-red-500 h-6 flex items-center justify-center text-white text-xs font-medium"
                      style={{
                        width: `${(suggestionAnalytics.rejected / suggestionAnalytics.total) * 100}%`,
                      }}
                    >
                      {suggestionAnalytics.rejected}
                    </div>
                  )}
                  {suggestionAnalytics.pending > 0 && (
                    <div
                      className="bg-amber-500 h-6 rounded-r flex items-center justify-center text-white text-xs font-medium"
                      style={{
                        width: `${(suggestionAnalytics.pending / suggestionAnalytics.total) * 100}%`,
                      }}
                    >
                      {suggestionAnalytics.pending}
                    </div>
                  )}
                </div>
                <div className="flex gap-4 mt-2 text-xs text-slate-600">
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-green-500 rounded" />
                    <span>Accepted</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-red-500 rounded" />
                    <span>Rejected</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-amber-500 rounded" />
                    <span>Pending</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Crew Performance */}
      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm">
        <div className="bg-slate-50 px-6 py-3 border-b border-slate-200">
          <h2 className="text-lg font-bold text-slate-900">Crew Performance</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-[10px] tracking-widest text-left">
              <tr>
                <th className="p-4">Crew</th>
                <th className="p-4 text-right">Routes</th>
                <th className="p-4 text-right">Avg Stops</th>
                <th className="p-4 text-right">Avg Distance</th>
                <th className="p-4 text-right">Efficiency</th>
                <th className="p-4 text-right">Optimized</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {crewPerformance.length > 0 ? (
                crewPerformance.map((crew) => (
                  <tr key={crew.crewId} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 font-bold text-slate-900">{crew.crewId}</td>
                    <td className="p-4 text-right text-slate-600">{crew.routes}</td>
                    <td className="p-4 text-right text-slate-600">
                      {Math.round(crew.avgStops)}
                    </td>
                    <td className="p-4 text-right text-slate-600">
                      {Math.round(crew.avgDistance)} mi
                    </td>
                    <td className="p-4 text-right">
                      <span
                        className={`font-bold ${
                          crew.avgEfficiencyScore >= 70
                            ? "text-green-600"
                            : crew.avgEfficiencyScore >= 50
                            ? "text-amber-600"
                            : "text-red-600"
                        }`}
                      >
                        {Math.round(crew.avgEfficiencyScore)}%
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <span className="text-slate-600">
                        {crew.optimized}/{crew.routes}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-500">
                    No crew data available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
