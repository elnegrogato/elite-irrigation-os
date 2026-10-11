// convex/lib/routeOptimizer.ts
// Route optimization algorithm using nearest neighbor TSP with constraints

export interface Location {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  address?: string;
}

export interface Stop extends Location {
  priority: number; // 1-5, 5 is highest
  timeWindow?: {
    start: number; // Unix timestamp
    end: number; // Unix timestamp
  };
  serviceTime: number; // minutes
  estimatedDuration?: number; // minutes
}

export interface RouteStop extends Stop {
  arrivalTime?: number;
  departureTime?: number;
  travelTimeFromPrevious?: number; // minutes
  distanceFromPrevious?: number; // miles
}

export interface OptimizedRoute {
  stops: RouteStop[];
  totalDistance: number; // miles
  totalTravelTime: number; // minutes
  totalServiceTime: number; // minutes
  totalTime: number; // minutes
  efficiencyScore: number; // 0-100
  violations: string[];
}

export interface OptimizationConstraints {
  maxStops?: number;
  maxServiceTime?: number; // minutes
  maxTravelTime?: number; // minutes
  startLocation?: Location;
  endLocation?: Location;
  trafficFactor?: number; // 1.0 = no traffic, 1.5 = 50% slower
  prioritizeTimeWindows?: boolean;
  prioritizePriority?: boolean;
}

/**
 * Haversine formula for calculating distance between two coordinates
 * Returns distance in miles
 */
export function calculateDistance(loc1: Location, loc2: Location): number {
  const R = 3959; // Earth's radius in miles
  const dLat = toRadians(loc2.latitude - loc1.latitude);
  const dLon = toRadians(loc2.longitude - loc1.longitude);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(loc1.latitude)) *
      Math.cos(toRadians(loc2.latitude)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

/**
 * Estimate travel time based on distance and traffic
 * Returns time in minutes
 */
export function calculateTravelTime(
  distance: number,
  trafficFactor: number = 1.0
): number {
  const averageSpeed = 30; // mph (urban/suburban driving)
  const baseTime = (distance / averageSpeed) * 60; // minutes
  return baseTime * trafficFactor;
}

/**
 * Build a distance matrix for all stops
 */
export function buildDistanceMatrix(stops: Stop[]): number[][] {
  const n = stops.length;
  const matrix: number[][] = [];

  for (let i = 0; i < n; i++) {
    matrix[i] = [];
    for (let j = 0; j < n; j++) {
      if (i === j) {
        matrix[i][j] = 0;
      } else {
        matrix[i][j] = calculateDistance(stops[i], stops[j]);
      }
    }
  }

  return matrix;
}

/**
 * Nearest Neighbor algorithm for TSP
 * Simple but effective for route optimization
 */
export function nearestNeighborTSP(
  stops: Stop[],
  distanceMatrix: number[][],
  startIdx: number = 0
): number[] {
  const n = stops.length;
  if (n === 0) return [];
  if (n === 1) return [0];

  const visited = new Set<number>([startIdx]);
  const route: number[] = [startIdx];
  let current = startIdx;

  while (visited.size < n) {
    let nearest = -1;
    let minDistance = Infinity;

    for (let i = 0; i < n; i++) {
      if (!visited.has(i)) {
        const dist = distanceMatrix[current][i];
        if (dist < minDistance) {
          minDistance = dist;
          nearest = i;
        }
      }
    }

    if (nearest !== -1) {
      visited.add(nearest);
      route.push(nearest);
      current = nearest;
    } else {
      break;
    }
  }

  return route;
}

/**
 * 2-Opt optimization to improve the route
 * Removes crossing paths
 */
export function twoOptOptimization(
  route: number[],
  distanceMatrix: number[][]
): number[] {
  let improved = true;
  let bestRoute = [...route];
  let bestDistance = calculateRouteDistance(bestRoute, distanceMatrix);

  const iterations = 100;
  let iteration = 0;

  while (improved && iteration < iterations) {
    improved = false;
    iteration++;

    for (let i = 0; i < route.length - 1; i++) {
      for (let j = i + 2; j < route.length; j++) {
        const newRoute = twoOptSwap(bestRoute, i, j);
        const newDistance = calculateRouteDistance(newRoute, distanceMatrix);

        if (newDistance < bestDistance) {
          bestRoute = newRoute;
          bestDistance = newDistance;
          improved = true;
        }
      }
    }
  }

  return bestRoute;
}

function twoOptSwap(route: number[], i: number, j: number): number[] {
  const newRoute = route.slice(0, i + 1);
  const reversed = route.slice(i + 1, j + 1).reverse();
  const remaining = route.slice(j + 1);
  return newRoute.concat(reversed).concat(remaining);
}

function calculateRouteDistance(route: number[], distanceMatrix: number[][]): number {
  let total = 0;
  for (let i = 0; i < route.length - 1; i++) {
    total += distanceMatrix[route[i]][route[i + 1]];
  }
  return total;
}

/**
 * Sort stops by priority and time windows
 */
export function sortStopsByPriority(stops: Stop[]): Stop[] {
  return [...stops].sort((a, b) => {
    // First, sort by priority (higher first)
    if (b.priority !== a.priority) {
      return b.priority - a.priority;
    }

    // Then sort by time window (earlier first)
    if (a.timeWindow && b.timeWindow) {
      return a.timeWindow.start - b.timeWindow.start;
    }

    if (a.timeWindow) return -1;
    if (b.timeWindow) return 1;

    return 0;
  });
}

/**
 * Check if a route violates time windows
 */
export function checkTimeWindows(route: RouteStop[]): string[] {
  const violations: string[] = [];
  let currentTime = route[0]?.departureTime || Date.now();

  for (let i = 0; i < route.length; i++) {
    const stop = route[i];

    if (stop.timeWindow) {
      const arrival = currentTime + (stop.travelTimeFromPrevious || 0);

      if (arrival < stop.timeWindow.start) {
        // Arriving early - wait
        currentTime = stop.timeWindow.start;
      } else if (arrival > stop.timeWindow.end) {
        // Arriving late - violation
        violations.push(
          `${stop.name}: Arriving ${Math.round((arrival - stop.timeWindow.end) / 60000)} minutes late`
        );
        currentTime = arrival;
      } else {
        currentTime = arrival;
      }
    }

    // Add service time
    currentTime += stop.serviceTime;
  }

  return violations;
}

/**
 * Calculate efficiency score based on multiple factors
 */
export function calculateEfficiencyScore(route: OptimizedRoute): number {
  const avgTravelPerStop = route.totalTravelTime / route.stops.length;
  const avgServicePerStop = route.totalServiceTime / route.stops.length;

  // Ideal ratio: travel time should be < 50% of service time
  const travelRatio = route.totalTravelTime / route.totalServiceTime;

  // Score based on travel ratio (lower is better)
  let score = 100;
  if (travelRatio > 1) {
    score -= (travelRatio - 1) * 50;
  } else if (travelRatio > 0.5) {
    score -= (travelRatio - 0.5) * 20;
  }

  // Penalty for violations
  score -= route.violations.length * 10;

  // Bonus for good stop clustering (low avg travel per stop)
  if (avgTravelPerStop < 15) {
    score += 10;
  } else if (avgTravelPerStop < 20) {
    score += 5;
  }

  return Math.max(0, Math.min(100, score));
}

/**
 * Main route optimization function
 */
export function optimizeRoute(
  stops: Stop[],
  constraints: OptimizationConstraints = {}
): OptimizedRoute {
  const {
    maxStops,
    maxServiceTime,
    maxTravelTime,
    startLocation,
    endLocation,
    trafficFactor = 1.0,
    prioritizeTimeWindows = true,
    prioritizePriority = true,
  } = constraints;

  // Filter and sort stops
  let processedStops = [...stops];

  if (prioritizePriority) {
    processedStops = sortStopsByPriority(processedStops);
  }

  if (maxStops && processedStops.length > maxStops) {
    processedStops = processedStops.slice(0, maxStops);
  }

  // Build distance matrix
  const distanceMatrix = buildDistanceMatrix(processedStops);

  // Find starting point
  let startIdx = 0;
  if (startLocation) {
    const closestToStart = processedStops.reduce((closest, stop, idx) => {
      const dist = calculateDistance(startLocation!, stop);
      return dist < closest.dist ? { idx, dist } : closest;
    }, { idx: 0, dist: Infinity });

    startIdx = closestToStart.idx;
  }

  // Apply TSP algorithm
  let routeIndices = nearestNeighborTSP(processedStops, distanceMatrix, startIdx);

  // Apply 2-opt optimization for better routes
  routeIndices = twoOptOptimization(routeIndices, distanceMatrix);

  // Build optimized route with timing
  const routeStops: RouteStop[] = [];
  let currentTime = Date.now();
  let totalDistance = 0;
  let totalTravelTime = 0;
  let totalServiceTime = 0;

  // Add distance from start location
  if (startLocation) {
    const firstStop = processedStops[routeIndices[0]];
    const dist = calculateDistance(startLocation, firstStop);
    const travelTime = calculateTravelTime(dist, trafficFactor);

    routeStops.push({
      ...firstStop,
      travelTimeFromPrevious: travelTime,
      distanceFromPrevious: dist,
      arrivalTime: currentTime + travelTime * 60000,
      departureTime: currentTime + travelTime * 60000 + firstStop.serviceTime * 60000,
    });

    totalDistance += dist;
    totalTravelTime += travelTime;
    currentTime += (travelTime + firstStop.serviceTime) * 60000;
    totalServiceTime += firstStop.serviceTime;
  }

  // Process remaining stops
  for (let i = 0; i < routeIndices.length; i++) {
    if (startLocation && i === 0) continue; // Skip first stop if we added it above

    const stopIdx = routeIndices[i];
    const stop = processedStops[stopIdx];
    const prevIdx = i > 0 ? routeIndices[i - 1] : -1;

    let travelTime = 0;
    let distance = 0;

    if (prevIdx >= 0) {
      distance = distanceMatrix[prevIdx][stopIdx];
      travelTime = calculateTravelTime(distance, trafficFactor);
      totalDistance += distance;
      totalTravelTime += travelTime;
    }

    const arrivalTime = currentTime + travelTime * 60000;

    // Check time windows
    if (stop.timeWindow && prioritizeTimeWindows) {
      if (arrivalTime < stop.timeWindow.start) {
        // Wait until time window opens
        currentTime = stop.timeWindow.start;
      }
    }

    const departureTime = Math.max(currentTime, arrivalTime) + stop.serviceTime * 60000;

    routeStops.push({
      ...stop,
      travelTimeFromPrevious: travelTime,
      distanceFromPrevious: distance,
      arrivalTime: Math.max(currentTime, arrivalTime),
      departureTime: departureTime,
    });

    totalServiceTime += stop.serviceTime;
    currentTime = departureTime;
  }

  // Check constraints
  const violations: string[] = [];

  if (prioritizeTimeWindows) {
    violations.push(...checkTimeWindows(routeStops));
  }

  if (maxServiceTime && totalServiceTime > maxServiceTime) {
    violations.push(
      `Service time exceeds limit: ${Math.round(totalServiceTime)} minutes`
    );
  }

  if (maxTravelTime && totalTravelTime > maxTravelTime) {
    violations.push(
      `Travel time exceeds limit: ${Math.round(totalTravelTime)} minutes`
    );
  }

  const optimizedRoute: OptimizedRoute = {
    stops: routeStops,
    totalDistance,
    totalTravelTime,
    totalServiceTime,
    totalTime: totalTravelTime + totalServiceTime,
    efficiencyScore: 0,
    violations,
  };

  // Calculate efficiency score
  optimizedRoute.efficiencyScore = calculateEfficiencyScore(optimizedRoute);

  return optimizedRoute;
}

/**
 * Calculate estimated duration for a stop based on service type
 */
export function estimateServiceTime(serviceType: string): number {
  const serviceTimes: Record<string, number> = {
    "consultation": 30,
    "estimate": 45,
    "repair": 60,
    "installation": 120,
    "maintenance": 45,
    "inspection": 30,
    "emergency": 90,
  };

  return serviceTimes[serviceType] || 45;
}

/**
 * Generate multiple route options with different strategies
 */
export function generateRouteOptions(
  stops: Stop[],
  constraints: OptimizationConstraints
): {
  fastest: OptimizedRoute;
  shortest: OptimizedRoute;
  balanced: OptimizedRoute;
} {
  // Fastest route (prioritize time)
  const fastest = optimizeRoute(stops, {
    ...constraints,
    trafficFactor: 1.2, // Account for traffic
    prioritizeTimeWindows: true,
  });

  // Shortest route (prioritize distance)
  const shortest = optimizeRoute(stops, {
    ...constraints,
    trafficFactor: 1.0, // No traffic consideration
    prioritizeTimeWindows: false,
  });

  // Balanced route
  const balanced = optimizeRoute(stops, {
    ...constraints,
    trafficFactor: 1.1,
    prioritizeTimeWindows: true,
    prioritizePriority: true,
  });

  return { fastest, shortest, balanced };
}
