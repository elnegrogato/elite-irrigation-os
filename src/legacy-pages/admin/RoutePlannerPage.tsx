// src/pages/admin/RoutePlannerPage.tsx
import { useMemo, useState } from "react";
import AdminLayout from "./AdminLayout";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { locationsFull } from "../../data/locations_full";
import RouteMap, { RouteMapCompact } from "../../components/RouteMap";
import { Id } from "../../../convex/_generated/dataModel";

function locName(slug: string) {
  const l = locationsFull.find(x => x.slug === slug);
  return l ? `${l.name}, ${l.state}` : slug;
}

export default function RoutePlannerPage() {
  const density = useQuery(api.routes.density, { daysBack: 14 }) ?? {};
  const routes = useQuery(api.routeOptimization.getRoutesForDate) ?? [];
  const suggestions = useQuery(api.optimizationSuggestions.getPendingSuggestions) ?? [];
  const crews = useQuery(api.staff.listCrews) ?? [];

  const optimizeRoute = useMutation(api.routeOptimization.optimizeRouteForCrew);
  const acceptSuggestion = useMutation(api.optimizationSuggestions.acceptSuggestion);
  const rejectSuggestion = useMutation(api.optimizationSuggestions.rejectSuggestion);
  const acceptRoute = useMutation(api.routeOptimization.acceptSuggestedRoute);

  const [selectedCrew, setSelectedCrew] = useState<string>("");
  const [selectedRoute, setSelectedRoute] = useState<Id<"routes"> | null>(null);
  const [optimizing, setOptimizing] = useState<string | null>(null);

  const scored = useMemo(() => {
    const rows = Object.entries(density).map(([slug, v]: any) => {
      const loc = locationsFull.find(x => x.slug === slug);
      const neighbors = (loc?.neighbors ?? []).slice(0, 6);

      // cluster bonus: neighbor activity increases attractiveness
      const neighborBonus = neighbors.reduce((sum, n) => {
        const d = (density as any)[n];
        return sum + (d ? d.leads + 2 * d.appts : 0);
      }, 0);

      const base = v.leads + 2 * v.appts;
      const ringPenalty = loc ? loc.ring * 0.5 : 0;
      const score = base + 0.5 * neighborBonus - ringPenalty;

      return { slug, score, base, neighborBonus, leads: v.leads, appts: v.appts, ring: loc?.ring ?? 9, neighbors };
    });

    return rows.sort((a, b) => b.score - a.score).slice(0, 50);
  }, [density]);

  const handleOptimize = async (crewId: string) => {
    setOptimizing(crewId);
    try {
      await optimizeRoute({ crewId, date: Date.now() });
    } catch (error) {
      console.error("Optimization failed:", error);
      alert("Failed to optimize route. Please try again.");
    } finally {
      setOptimizing(null);
    }
  };

  const handleAcceptSuggestion = async (suggestionId: Id<"optimizationSuggestions">) => {
    try {
      await acceptSuggestion({ suggestionId });
    } catch (error) {
      console.error("Failed to accept suggestion:", error);
      alert("Failed to accept suggestion. Please try again.");
    }
  };

  const handleRejectSuggestion = async (suggestionId: Id<"optimizationSuggestions">, reason?: string) => {
    try {
      await rejectSuggestion({ suggestionId, reason });
    } catch (error) {
      console.error("Failed to reject suggestion:", error);
      alert("Failed to reject suggestion. Please try again.");
    }
  };

  const handleActivateRoute = async (routeId: Id<"routes">) => {
    try {
      await acceptRoute({ routeId });
      alert("Route activated successfully!");
    } catch (error) {
      console.error("Failed to activate route:", error);
      alert("Failed to activate route. Please try again.");
    }
  };

  const selectedRouteData = routes.find(r => r._id === selectedRoute);

  return (
    <AdminLayout>
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-serif font-bold text-slate-900 mb-2">Route Planner</h1>
          <p className="text-sm text-zinc-600 max-w-3xl">
            Optimize crew routes based on location density, appointments, and service priorities.
          </p>
        </div>
        <div className="flex gap-2">
          {suggestions.length > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-2">
              <div className="text-sm font-semibold text-amber-800">
                {suggestions.length} Pending Suggestions
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Optimization Suggestions */}
      {suggestions.length > 0 && (
        <div className="mb-8 bg-white border border-amber-200 rounded-lg overflow-hidden shadow-sm">
          <div className="bg-amber-50 px-6 py-3 border-b border-amber-200">
            <h2 className="text-lg font-bold text-amber-900">Optimization Suggestions</h2>
          </div>
          <div className="p-6 space-y-4">
            {suggestions.map((suggestion) => (
              <div key={suggestion._id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                <div className="flex-1">
                  <div className="font-semibold text-slate-900">
                    Crew: {suggestion.crewId}
                  </div>
                  <div className="text-sm text-slate-600 mt-1">
                    Potential improvement: <span className="font-bold text-green-600">{suggestion.improvementPercent.toFixed(1)}%</span>
                    <span className="mx-2">•</span>
                    Save {Math.round(suggestion.originalDistance - suggestion.suggestedDistance)} miles
                    <span className="mx-2">•</span>
                    Save {Math.round(suggestion.originalTime - suggestion.suggestedTime)} minutes
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleAcceptSuggestion(suggestion._id)}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium text-sm"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => handleRejectSuggestion(suggestion._id, "Not needed")}
                    className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 font-medium text-sm"
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Crew Routes */}
      <div className="mb-8 bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm">
        <div className="bg-slate-50 px-6 py-3 border-b border-slate-200">
          <h2 className="text-lg font-bold text-slate-900">Today's Routes</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {crews.map((crew) => {
              const crewRoutes = routes.filter(r => r.crewId === crew.name || r.crewId === crew._id.toString());
              const activeRoute = crewRoutes.find(r => r.status === "active");
              const draftRoute = crewRoutes.find(r => r.status === "draft");

              return (
                <div key={crew._id} className="border border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-3">
                    <div className="font-bold text-slate-900">{crew.name}</div>
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: crew.color }}
                    />
                  </div>

                  {activeRoute ? (
                    <div className="space-y-2">
                      <div className="text-xs font-semibold text-green-700 bg-green-50 px-2 py-1 rounded">
                        Active Route
                      </div>
                      <div className="text-sm text-slate-600">
                        {activeRoute.stops.length} stops
                        <span className="mx-2">•</span>
                        {Math.round(activeRoute.totalDistance)} miles
                        <span className="mx-2">•</span>
                        {activeRoute.isOptimized ? (
                          <span className="text-green-600">Optimized</span>
                        ) : (
                          <span className="text-slate-500">Manual</span>
                        )}
                      </div>
                      <div className="flex items-center gap-1 text-xs">
                        <span className="text-slate-500">Score:</span>
                        <span className={`font-bold ${activeRoute.optimizationScore >= 70 ? 'text-green-600' : activeRoute.optimizationScore >= 50 ? 'text-amber-600' : 'text-red-600'}`}>
                          {Math.round(activeRoute.optimizationScore)}%
                        </span>
                      </div>
                      <button
                        onClick={() => setSelectedRoute(activeRoute._id)}
                        className="w-full mt-2 px-3 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 text-sm font-medium"
                      >
                        View Details
                      </button>
                    </div>
                  ) : draftRoute ? (
                    <div className="space-y-2">
                      <div className="text-xs font-semibold text-blue-700 bg-blue-50 px-2 py-1 rounded">
                        Draft Route
                      </div>
                      <div className="text-sm text-slate-600">
                        {draftRoute.stops.length} stops
                        <span className="mx-2">•</span>
                        {Math.round(draftRoute.totalDistance)} miles
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleActivateRoute(draftRoute._id)}
                          className="flex-1 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium"
                        >
                          Activate
                        </button>
                        <button
                          onClick={() => setSelectedRoute(draftRoute._id)}
                          className="flex-1 px-3 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 text-sm font-medium"
                        >
                          View
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="text-sm text-slate-500">No route planned</div>
                      <button
                        onClick={() => handleOptimize(crew._id.toString())}
                        disabled={optimizing === crew._id.toString()}
                        className="w-full px-3 py-2 bg-elite-700 text-white rounded-lg hover:bg-elite-800 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {optimizing === crew._id.toString() ? "Optimizing..." : "Optimize Route"}
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Route Map */}
      {selectedRouteData && (
        <div className="mb-8 bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm">
          <div className="bg-slate-50 px-6 py-3 border-b border-slate-200 flex justify-between items-center">
            <h2 className="text-lg font-bold text-slate-900">Route Map</h2>
            <button
              onClick={() => setSelectedRoute(null)}
              className="text-sm text-slate-600 hover:text-slate-900"
            >
              Close
            </button>
          </div>
          <div className="p-6">
            <div className="mb-4 grid grid-cols-4 gap-4">
              <div className="bg-slate-50 rounded-lg p-3">
                <div className="text-xs text-slate-500">Total Distance</div>
                <div className="text-xl font-bold text-slate-900">{Math.round(selectedRouteData.totalDistance)} mi</div>
              </div>
              <div className="bg-slate-50 rounded-lg p-3">
                <div className="text-xs text-slate-500">Travel Time</div>
                <div className="text-xl font-bold text-slate-900">{Math.round(selectedRouteData.totalTravelTime)} min</div>
              </div>
              <div className="bg-slate-50 rounded-lg p-3">
                <div className="text-xs text-slate-500">Service Time</div>
                <div className="text-xl font-bold text-slate-900">{Math.round(selectedRouteData.totalServiceTime)} min</div>
              </div>
              <div className="bg-slate-50 rounded-lg p-3">
                <div className="text-xs text-slate-500">Efficiency Score</div>
                <div className={`text-xl font-bold ${selectedRouteData.optimizationScore >= 70 ? 'text-green-600' : selectedRouteData.optimizationScore >= 50 ? 'text-amber-600' : 'text-red-600'}`}>
                  {Math.round(selectedRouteData.optimizationScore)}%
                </div>
              </div>
            </div>

            <RouteMap
              stops={selectedRouteData.stops}
              crewColor="#3b82f6"
              onStopClick={(stop) => console.log("Clicked stop:", stop)}
            />

            <div className="mt-4">
              <h3 className="font-bold text-slate-900 mb-2">Stops</h3>
              <div className="space-y-2">
                {selectedRouteData.stops.map((stop, idx) => (
                  <div key={stop.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                    <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold text-sm">
                      {idx + 1}
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-slate-900">{stop.name}</div>
                      <div className="text-xs text-slate-600">{stop.address}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-slate-900">
                        {new Date(stop.estimatedArrival).toLocaleTimeString()}
                      </div>
                      <div className="text-xs text-slate-600">{stop.serviceTime} min service</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Density Analysis */}
      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm">
        <div className="bg-slate-50 px-6 py-3 border-b border-slate-200">
          <h2 className="text-lg font-bold text-slate-900">Area Density Analysis</h2>
        </div>
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-[10px] tracking-widest text-left">
            <tr>
              <th className="p-4">Area</th>
              <th className="p-4 text-right">Score</th>
              <th className="p-4 text-right">Leads</th>
              <th className="p-4 text-right">Appts</th>
              <th className="p-4 text-right">Ring</th>
              <th className="p-4">Cluster Neighbors</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {scored.map(r => (
              <tr key={r.slug} className="hover:bg-slate-50 transition-colors">
                <td className="p-4 font-bold text-slate-900">{locName(r.slug)}</td>
                <td className="p-4 text-right font-mono font-bold text-elite-700">{r.score.toFixed(1)}</td>
                <td className="p-4 text-right text-slate-600">{r.leads}</td>
                <td className="p-4 text-right text-slate-600">{r.appts}</td>
                <td className="p-4 text-right text-slate-600">{r.ring}</td>
                <td className="p-4 text-xs text-slate-500">
                  {r.neighbors.map((n: string) => locName(n)).join(" • ")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}