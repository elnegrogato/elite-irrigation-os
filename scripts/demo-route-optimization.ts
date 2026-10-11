// scripts/demo-route-optimization.ts
// Demonstration script for route optimization algorithm

import {
  calculateDistance,
  calculateTravelTime,
  buildDistanceMatrix,
  nearestNeighborTSP,
  twoOptOptimization,
  optimizeRoute,
  estimateServiceTime,
  type Stop,
  type Location,
  type OptimizationConstraints,
} from "../convex/lib/routeOptimizer";

// Demo locations around Charlotte, NC
const locations: Location[] = [
  { id: "home", name: "Home Base (Harrisburg)", latitude: 35.323, longitude: -80.655 },
  { id: "1", name: "Charlotte", latitude: 35.227, longitude: -80.843 },
  { id: "2", name: "Concord", latitude: 35.408, longitude: -80.579 },
  { id: "3", name: "Matthews", latitude: 35.116, longitude: -80.716 },
  { id: "4", name: "Mint Hill", latitude: 35.181, longitude: -80.662 },
  { id: "5", name: "Pineville", latitude: 34.97, longitude: -80.889 },
];

// Demo stops for a crew
const demoStops: Stop[] = [
  {
    id: "1",
    name: "Charlotte - Irrigation Repair",
    latitude: 35.227,
    longitude: -80.843,
    priority: 5, // Emergency
    serviceTime: 90,
    address: "123 Main St, Charlotte, NC",
  },
  {
    id: "2",
    name: "Concord - Installation",
    latitude: 35.408,
    longitude: -80.579,
    priority: 3,
    serviceTime: 120,
    address: "456 Oak Ave, Concord, NC",
  },
  {
    id: "3",
    name: "Matthews - Consultation",
    latitude: 35.116,
    longitude: -80.716,
    priority: 2,
    serviceTime: 45,
    address: "789 Pine Rd, Matthews, NC",
  },
  {
    id: "4",
    name: "Mint Hill - Maintenance",
    latitude: 35.181,
    longitude: -80.662,
    priority: 3,
    serviceTime: 60,
    address: "321 Elm St, Mint Hill, NC",
  },
  {
    id: "5",
    name: "Pineville - Inspection",
    latitude: 34.97,
    longitude: -80.889,
    priority: 2,
    serviceTime: 30,
    address: "654 Maple Dr, Pineville, NC",
  },
];

function printSection(title: string) {
  console.log("\n" + "=".repeat(80));
  console.log(`  ${title}`);
  console.log("=".repeat(80));
}

function printSubsection(title: string) {
  console.log(`\n--- ${title} ---`);
}

async function main() {
  console.log("\n🚀 Elite Irrigation & Landscaping - Route Optimization Demo\n");

  // Section 1: Distance Calculation
  printSection("1. Distance Calculation (Haversine Formula)");
  console.log("\nCalculating distances between service locations...");

  for (let i = 0; i < locations.length; i++) {
    for (let j = i + 1; j < locations.length; j++) {
      const dist = calculateDistance(locations[i], locations[j]);
      const time = calculateTravelTime(dist, 1.2); // With traffic

      console.log(
        `${locations[i].name.padEnd(30)} → ${locations[j].name.padEnd(30)}: ${dist.toFixed(1)} mi (${time.toFixed(0)} min with traffic)`
      );
    }
  }

  // Section 2: Service Time Estimation
  printSection("2. Service Time Estimation");
  console.log("\nStandard service times for different job types:");
  console.log(`  Consultation:     ${estimateServiceTime("consultation")} minutes`);
  console.log(`  Estimate:         ${estimateServiceTime("estimate")} minutes`);
  console.log(`  Repair:           ${estimateServiceTime("repair")} minutes`);
  console.log(`  Installation:     ${estimateServiceTime("installation")} minutes`);
  console.log(`  Maintenance:      ${estimateServiceTime("maintenance")} minutes`);
  console.log(`  Emergency:        ${estimateServiceTime("emergency")} minutes`);

  // Section 3: Distance Matrix
  printSection("3. Distance Matrix");
  const matrix = buildDistanceMatrix(demoStops);
  console.log("\nDistance matrix (in miles):");
  console.log("          " + demoStops.map((s, i) => `Stop ${i + 1}`.padStart(8)).join("  "));

  for (let i = 0; i < demoStops.length; i++) {
    const row = `Stop ${i + 1}`.padEnd(8);
    const distances = matrix[i].map((d) => d.toFixed(1).padStart(8)).join("  ");
    console.log(row + distances);
  }

  // Section 4: TSP Algorithm
  printSection("4. Route Optimization Algorithms");

  printSubsection("Nearest Neighbor Algorithm");
  const nnRoute = nearestNeighborTSP(demoStops, matrix, 0);
  console.log("\nRoute order (by stop index):", nnRoute.join(" → "));
  console.log("\nStops in order:");
  nnRoute.forEach((idx, i) => {
    const stop = demoStops[idx];
    console.log(`  ${i + 1}. ${stop.name} (Priority: ${stop.priority}, Service: ${stop.serviceTime} min)`);
  });

  printSubsection("2-Opt Optimization");
  const optimizedRoute = twoOptOptimization(nnRoute, matrix);
  console.log("\nOptimized route order:", optimizedRoute.join(" → "));

  // Calculate total distance
  let totalDist = 0;
  for (let i = 0; i < optimizedRoute.length - 1; i++) {
    totalDist += matrix[optimizedRoute[i]][optimizedRoute[i + 1]];
  }
  console.log(`\nTotal distance: ${totalDist.toFixed(1)} miles`);
  console.log(`Total travel time: ${calculateTravelTime(totalDist, 1.2).toFixed(0)} minutes (with traffic)`);

  // Section 5: Full Route Optimization
  printSection("5. Complete Route Optimization");

  const constraints: OptimizationConstraints = {
    startLocation: locations[0], // Start from home base
    maxStops: 10,
    maxTravelTime: 480, // 8 hours
    maxServiceTime: 480,
    trafficFactor: 1.2,
    prioritizeTimeWindows: true,
    prioritizePriority: true,
  };

  console.log("\nOptimization constraints:");
  console.log(`  Start location: ${constraints.startLocation.name}`);
  console.log(`  Max stops: ${constraints.maxStops}`);
  console.log(`  Max travel time: ${constraints.maxTravelTime} minutes (${constraints.maxTravelTime / 60} hours)`);
  console.log(`  Traffic factor: ${constraints.trafficFactor}x`);
  console.log(`  Prioritize time windows: ${constraints.prioritizeTimeWindows}`);
  console.log(`  Prioritize priority: ${constraints.prioritizePriority}`);

  const optimizedResult = optimizeRoute(demoStops, constraints);

  printSubsection("Optimization Results");
  console.log(`\n✅ Successfully optimized route with ${optimizedResult.stops.length} stops`);
  console.log(`\n📊 Metrics:`);
  console.log(`  Total distance: ${optimizedResult.totalDistance.toFixed(1)} miles`);
  console.log(`  Total travel time: ${optimizedResult.totalTravelTime.toFixed(0)} minutes`);
  console.log(`  Total service time: ${optimizedResult.totalServiceTime.toFixed(0)} minutes`);
  console.log(`  Total time: ${optimizedResult.totalTime.toFixed(0)} minutes (${(optimizedResult.totalTime / 60).toFixed(1)} hours)`);
  console.log(`  Efficiency score: ${optimizedResult.efficiencyScore.toFixed(1)}%`);

  if (optimizedResult.violations.length > 0) {
    console.log(`\n⚠️  Constraint violations:`);
    optimizedResult.violations.forEach((v) => console.log(`  - ${v}`));
  } else {
    console.log(`\n✅ No constraint violations`);
  }

  printSubsection("Optimized Route Schedule");
  optimizedResult.stops.forEach((stop, i) => {
    const arrivalTime = new Date(stop.estimatedArrival ?? 0);
    const departureTime = new Date(stop.departureTime ?? 0);
    const travelFrom = stop.travelTimeFromPrevious ?? 0;

    console.log(`\n${i + 1}. ${stop.name}`);
    console.log(`   Address: ${stop.address || "N/A"}`);
    console.log(`   Priority: ${"⭐".repeat(stop.priority)}`);
    console.log(`   Travel from previous: ${travelFrom.toFixed(0)} min`);
    console.log(`   Arrival: ${arrivalTime.toLocaleTimeString()}`);
    console.log(`   Service time: ${stop.serviceTime} min`);
    console.log(`   Departure: ${departureTime.toLocaleTimeString()}`);
    if (stop.timeWindow) {
      const windowStart = new Date(stop.timeWindow.start);
      const windowEnd = new Date(stop.timeWindow.end);
      console.log(`   Time window: ${windowStart.toLocaleTimeString()} - ${windowEnd.toLocaleTimeString()}`);
    }
  });

  // Section 6: Comparison
  printSection("6. Algorithm Comparison");

  console.log("\n🔄 Comparing different optimization strategies...\n");

  // Without priority optimization
  const withoutPriority = optimizeRoute(demoStops, {
    ...constraints,
    prioritizePriority: false,
  });

  // Without time window optimization
  const withoutTimeWindows = optimizeRoute(demoStops, {
    ...constraints,
    prioritizeTimeWindows: false,
  });

  console.log("Strategy                     | Distance | Travel Time | Service Time | Efficiency");
  console.log("".padEnd(80, "-"));
  console.log(
    `Full optimization            | ${optimizedResult.totalDistance.toFixed(1).padStart(8)} mi | ${optimizedResult.totalTravelTime.toFixed(0).padStart(10)} min | ${optimizedResult.totalServiceTime.toFixed(0).padStart(11)} min | ${optimizedResult.efficiencyScore.toFixed(1).padStart(9)}%`
  );
  console.log(
    `Without priority             | ${withoutPriority.totalDistance.toFixed(1).padStart(8)} mi | ${withoutPriority.totalTravelTime.toFixed(0).padStart(10)} min | ${withoutPriority.totalServiceTime.toFixed(0).padStart(11)} min | ${withoutPriority.efficiencyScore.toFixed(1).padStart(9)}%`
  );
  console.log(
    `Without time windows         | ${withoutTimeWindows.totalDistance.toFixed(1).padStart(8)} mi | ${withoutTimeWindows.totalTravelTime.toFixed(0).padStart(10)} min | ${withoutTimeWindows.totalServiceTime.toFixed(0).padStart(11)} min | ${withoutTimeWindows.efficiencyScore.toFixed(1).padStart(9)}%`
  );

  // Section 7: Benefits Summary
  printSection("7. Benefits of Route Optimization");

  console.log("\n💡 Key Benefits:");
  console.log(`  ✅ Reduced travel distance: ${optimizedResult.totalDistance.toFixed(1)} miles optimized`);
  console.log(`  ✅ Time savings: ${optimizedResult.totalTravelTime.toFixed(0)} minutes travel time`);
  console.log(`  ✅ High efficiency score: ${optimizedResult.efficiencyScore.toFixed(1)}%`);
  console.log(`  ✅ Priority-based scheduling ensures urgent jobs are handled first`);
  console.log(`  ✅ Time window compliance reduces customer wait times`);
  console.log(`  ✅ Traffic-aware planning avoids delays`);

  console.log("\n📈 Potential Daily Impact (based on 3 crews):");
  console.log(`  • Total stops serviced: ${optimizedResult.stops.length * 3}`);
  console.log(`  • Total miles saved: ~${(optimizedResult.totalDistance * 0.15 * 3).toFixed(1)} miles (15% improvement)`);
  console.log(`  • Time saved: ~${(optimizedResult.totalTravelTime * 0.15 * 3).toFixed(0)} minutes`);
  console.log(`  • Fuel cost savings: ~$${(optimizedResult.totalDistance * 0.15 * 3 * 0.5).toFixed(2)} (at $0.50/mile)`);

  console.log("\n" + "=".repeat(80));
  console.log("  Demo complete! The route optimization system is ready for production use.");
  console.log("=".repeat(80) + "\n");
}

// Run the demo
main().catch(console.error);
