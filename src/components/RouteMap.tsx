// src/components/RouteMap.tsx
import { useMemo, memo, useCallback } from "react";

interface RouteStop {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  address?: string;
  order: number;
  estimatedArrival: number;
  estimatedDeparture: number;
  serviceTime: number;
  priority: number;
  leadId?: string;
  workOrderId?: string;
}

interface RouteMapProps {
  stops: RouteStop[];
  startLocation?: { latitude: number; longitude: number; name: string };
  endLocation?: { latitude: number; longitude: number; name: string };
  crewColor?: string;
  onStopClick?: (stop: RouteStop) => void;
  className?: string;
}

function RouteMap({
  stops,
  startLocation,
  endLocation,
  crewColor = "#3b82f6",
  onStopClick,
  className = "",
}: RouteMapProps) {
  const bounds = useMemo(() => {
    if (stops.length === 0) return null;

    const lats = stops.map((s) => s.latitude);
    const lngs = stops.map((s) => s.longitude);

    if (startLocation) {
      lats.push(startLocation.latitude);
      lngs.push(startLocation.longitude);
    }

    if (endLocation) {
      lats.push(endLocation.latitude);
      lngs.push(endLocation.longitude);
    }

    return {
      minLat: Math.min(...lats),
      maxLat: Math.max(...lats),
      minLng: Math.min(...lngs),
      maxLng: Math.max(...lngs),
    };
  }, [stops, startLocation, endLocation]);

  const scale = useMemo(() => {
    if (!bounds) return 1;

    const latRange = bounds.maxLat - bounds.minLat || 1;
    const lngRange = bounds.maxLng - bounds.minLng || 1;

    // Add padding
    const padding = 0.2;
    const effectiveLatRange = latRange * (1 + padding);
    const effectiveLngRange = lngRange * (1 + padding);

    return {
      scaleX: 800 / effectiveLngRange,
      scaleY: 600 / effectiveLatRange,
      offsetX: bounds.minLng - lngRange * (padding / 2),
      offsetY: bounds.minLat - latRange * (padding / 2),
    };
  }, [bounds]);

  const projectPoint = (lat: number, lng: number) => {
    if (!scale) return { x: 400, y: 300 };

    const x = (lng - scale.offsetX) * scale.scaleX;
    const y = 600 - (lat - scale.offsetY) * scale.scaleY; // Flip Y

    return { x, y };
  };

  const formatTime = useCallback((timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }, []);

  const formatDuration = useCallback((minutes: number) => {
    const hrs = Math.floor(minutes / 60);
    const mins = Math.round(minutes % 60);
    return hrs > 0 ? `${hrs}h ${mins}m` : `${mins}m`;
  }, []);

  const handleStopClick = useCallback((stop: RouteStop) => {
    onStopClick?.(stop);
  }, [onStopClick]);

  return (
    <div className={`route-map ${className}`}>
      <div className="relative w-full h-full bg-slate-50 rounded-lg overflow-hidden">
        {/* Grid lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#e2e8f0" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>

        {/* Routes */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          {/* Draw route lines */}
          {stops.length > 1 && (
            <polyline
              points={
                stops
                  .map((stop) => {
                    const point = projectPoint(stop.latitude, stop.longitude);
                    return `${point.x},${point.y}`;
                  })
                  .join(" ") + (startLocation ? ` ${projectPoint(startLocation.latitude, startLocation.longitude).x},${projectPoint(startLocation.latitude, startLocation.longitude).y}` : "")
              }
              fill="none"
              stroke={crewColor}
              strokeWidth="3"
              strokeDasharray="8,4"
              opacity="0.7"
            />
          )}

          {/* Start location */}
          {startLocation && (
            <>
              <circle
                cx={projectPoint(startLocation.latitude, startLocation.longitude).x}
                cy={projectPoint(startLocation.latitude, startLocation.longitude).y}
                r="12"
                fill="#22c55e"
                opacity="0.3"
              />
              <circle
                cx={projectPoint(startLocation.latitude, startLocation.longitude).x}
                cy={projectPoint(startLocation.latitude, startLocation.longitude).y}
                r="8"
                fill="#22c55e"
                stroke="white"
                strokeWidth="2"
              />
              <text
                x={projectPoint(startLocation.latitude, startLocation.longitude).x}
                y={projectPoint(startLocation.latitude, startLocation.longitude).y - 16}
                textAnchor="middle"
                fontSize="12"
                fontWeight="bold"
                fill="#15803d"
              >
                START
              </text>
            </>
          )}

          {/* Stop markers */}
          {stops.map((stop, idx) => {
            const point = projectPoint(stop.latitude, stop.longitude);

            return (
              <g key={stop.id}>
                {/* Outer circle with priority color */}
                <circle
                  cx={point.x}
                  cy={point.y}
                  r="16"
                  fill={
                    stop.priority >= 4
                      ? "#ef4444"
                      : stop.priority >= 3
                      ? "#f59e0b"
                      : crewColor
                  }
                  opacity="0.2"
                />
                <circle
                  cx={point.x}
                  cy={point.y}
                  r="12"
                  fill={
                    stop.priority >= 4
                      ? "#ef4444"
                      : stop.priority >= 3
                      ? "#f59e0b"
                      : crewColor
                  }
                  stroke="white"
                  strokeWidth="2"
                  className="cursor-pointer"
                  onClick={() => handleStopClick(stop)}
                />
                {/* Stop number */}
                <text
                  x={point.x}
                  y={point.y + 4}
                  textAnchor="middle"
                  fontSize="11"
                  fontWeight="bold"
                  fill="white"
                >
                  {idx + 1}
                </text>
                {/* Stop label */}
                <text
                  x={point.x}
                  y={point.y + 28}
                  textAnchor="middle"
                  fontSize="10"
                  fill="#475569"
                  fontWeight="500"
                >
                  {stop.name}
                </text>
                {/* Time label */}
                <text
                  x={point.x}
                  y={point.y + 40}
                  textAnchor="middle"
                  fontSize="9"
                  fill="#64748b"
                >
                  {formatTime(stop.estimatedArrival)}
                </text>
              </g>
            );
          })}

          {/* End location */}
          {endLocation && (
            <>
              <circle
                cx={projectPoint(endLocation.latitude, endLocation.longitude).x}
                cy={projectPoint(endLocation.latitude, endLocation.longitude).y}
                r="12"
                fill="#dc2626"
                opacity="0.3"
              />
              <circle
                cx={projectPoint(endLocation.latitude, endLocation.longitude).x}
                cy={projectPoint(endLocation.latitude, endLocation.longitude).y}
                r="8"
                fill="#dc2626"
                stroke="white"
                strokeWidth="2"
              />
              <text
                x={projectPoint(endLocation.latitude, endLocation.longitude).x}
                y={projectPoint(endLocation.latitude, endLocation.longitude).y - 16}
                textAnchor="middle"
                fontSize="12"
                fontWeight="bold"
                fill="#b91c1c"
              >
                END
              </text>
            </>
          )}
        </svg>

        {/* Legend */}
        <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg p-3 text-xs">
          <div className="font-bold mb-2 text-slate-700">Legend</div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span>Start</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <span>End</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: crewColor }}></div>
              <span>Regular Stop</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <span>High Priority</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-amber-500"></div>
              <span>Medium Priority</span>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg p-3 text-xs">
          <div className="font-bold mb-2 text-slate-700">Route Stats</div>
          <div className="space-y-1">
            <div className="flex justify-between gap-4">
              <span className="text-slate-600">Total Stops:</span>
              <span className="font-bold">{stops.length}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-slate-600">Duration:</span>
              <span className="font-bold">
                {formatDuration(
                  stops.reduce((sum, stop) => sum + stop.serviceTime, 0)
                )}
              </span>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .route-map {
          width: 100%;
          height: 600px;
        }
      `}</style>
    </div>
  );
}

// Memoize RouteMap to prevent unnecessary re-renders
export default memo(RouteMap, (prevProps, nextProps) => {
  // Custom comparison function
  return (
    prevProps.stops.length === nextProps.stops.length &&
    prevProps.stops.every((stop, i) => stop.id === nextProps.stops[i]?.id) &&
    prevProps.crewColor === nextProps.crewColor &&
    prevProps.startLocation?.latitude === nextProps.startLocation?.latitude &&
    prevProps.startLocation?.longitude === nextProps.startLocation?.longitude &&
    prevProps.endLocation?.latitude === nextProps.endLocation?.latitude &&
    prevProps.endLocation?.longitude === nextProps.endLocation?.longitude
  );
});

/**
 * Compact version for inline display
 */
export const RouteMapCompact = memo(({ stops, crewColor }: { stops: RouteStop[]; crewColor?: string }) => {
  return (
    <div className="flex items-center gap-1 overflow-x-auto pb-2">
      {stops.map((stop, idx) => (
        <div key={stop.id} className="flex items-center">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
            style={{
              backgroundColor:
                stop.priority >= 4
                  ? "#ef4444"
                  : stop.priority >= 3
                  ? "#f59e0b"
                  : crewColor || "#3b82f6",
            }}
            title={`${stop.name} - ${new Date(stop.estimatedArrival).toLocaleTimeString()}`}
          >
            {idx + 1}
          </div>
          {idx < stops.length - 1 && (
            <div
              className="w-8 h-0.5 mx-1"
              style={{ backgroundColor: crewColor || "#3b82f6", opacity: 0.3 }}
            />
          )}
        </div>
      ))}
    </div>
  );
});
