// convex/__tests__/routeOptimizer.test.ts
import { describe, it, expect } from "vitest";
import {
  calculateDistance,
  calculateTravelTime,
  buildDistanceMatrix,
  nearestNeighborTSP,
  twoOptOptimization,
  optimizeRoute,
  estimateServiceTime,
  checkTimeWindows,
  calculateEfficiencyScore,
  type Stop,
  type Location,
  type OptimizationConstraints,
} from "../lib/routeOptimizer";

describe("Route Optimizer", () => {
  describe("calculateDistance", () => {
    it("should calculate distance between two locations using Haversine formula", () => {
      const loc1: Location = {
        id: "1",
        name: "Charlotte",
        latitude: 35.227,
        longitude: -80.843,
      };
      const loc2: Location = {
        id: "2",
        name: "Concord",
        latitude: 35.408,
        longitude: -80.579,
      };

      const distance = calculateDistance(loc1, loc2);

      expect(distance).toBeGreaterThan(0);
      expect(distance).toBeLessThan(50); // Should be ~20 miles
      expect(distance).toBeCloseTo(19.4, 0);
    });

    it("should return 0 for same location", () => {
      const loc: Location = {
        id: "1",
        name: "Charlotte",
        latitude: 35.227,
        longitude: -80.843,
      };

      const distance = calculateDistance(loc, loc);

      expect(distance).toBe(0);
    });

    it("should calculate distances for multiple locations", () => {
      const charlotte: Location = {
        id: "1",
        name: "Charlotte",
        latitude: 35.227,
        longitude: -80.843,
      };
      const harrisburg: Location = {
        id: "2",
        name: "Harrisburg",
        latitude: 35.323,
        longitude: -80.655,
      };
      const concord: Location = {
        id: "3",
        name: "Concord",
        latitude: 35.408,
        longitude: -80.579,
      };

      const dist1 = calculateDistance(charlotte, harrisburg);
      const dist2 = calculateDistance(harrisburg, concord);

      expect(dist1).toBeGreaterThan(0);
      expect(dist2).toBeGreaterThan(0);
    });
  });

  describe("calculateTravelTime", () => {
    it("should estimate travel time based on distance", () => {
      const travelTime = calculateTravelTime(10); // 10 miles

      expect(travelTime).toBe(20); // 10 miles / 30 mph * 60 min = 20 minutes
    });

    it("should apply traffic factor", () => {
      const normalTime = calculateTravelTime(10, 1.0);
      const trafficTime = calculateTravelTime(10, 1.5);

      expect(trafficTime).toBe(normalTime * 1.5);
    });
  });

  describe("buildDistanceMatrix", () => {
    it("should build a distance matrix for stops", () => {
      const stops: Stop[] = [
        {
          id: "1",
          name: "Charlotte",
          latitude: 35.227,
          longitude: -80.843,
          priority: 3,
          serviceTime: 30,
        },
        {
          id: "2",
          name: "Concord",
          latitude: 35.408,
          longitude: -80.579,
          priority: 3,
          serviceTime: 30,
        },
      ];

      const matrix = buildDistanceMatrix(stops);

      expect(matrix).toHaveLength(2);
      expect(matrix[0]).toHaveLength(2);
      expect(matrix[0][0]).toBe(0);
      expect(matrix[1][1]).toBe(0);
      expect(matrix[0][1]).toBeGreaterThan(0);
      expect(matrix[1][0]).toBeGreaterThan(0);
    });

    it("should be symmetric", () => {
      const stops: Stop[] = [
        {
          id: "1",
          name: "Charlotte",
          latitude: 35.227,
          longitude: -80.843,
          priority: 3,
          serviceTime: 30,
        },
        {
          id: "2",
          name: "Concord",
          latitude: 35.408,
          longitude: -80.579,
          priority: 3,
          serviceTime: 30,
        },
      ];

      const matrix = buildDistanceMatrix(stops);

      expect(matrix[0][1]).toBeCloseTo(matrix[1][0], 5);
    });
  });

  describe("nearestNeighborTSP", () => {
    it("should find nearest neighbor route", () => {
      const stops: Stop[] = [
        {
          id: "1",
          name: "Charlotte",
          latitude: 35.227,
          longitude: -80.843,
          priority: 3,
          serviceTime: 30,
        },
        {
          id: "2",
          name: "Concord",
          latitude: 35.408,
          longitude: -80.579,
          priority: 3,
          serviceTime: 30,
        },
        {
          id: "3",
          name: "Harrisburg",
          latitude: 35.323,
          longitude: -80.655,
          priority: 3,
          serviceTime: 30,
        },
      ];

      const matrix = buildDistanceMatrix(stops);
      const route = nearestNeighborTSP(stops, matrix, 0);

      expect(route).toHaveLength(3);
      expect(route[0]).toBe(0); // Start from first stop
      expect(route).toContain(1);
      expect(route).toContain(2);
    });

    it("should handle single stop", () => {
      const stops: Stop[] = [
        {
          id: "1",
          name: "Charlotte",
          latitude: 35.227,
          longitude: -80.843,
          priority: 3,
          serviceTime: 30,
        },
      ];

      const matrix = buildDistanceMatrix(stops);
      const route = nearestNeighborTSP(stops, matrix, 0);

      expect(route).toEqual([0]);
    });

    it("should handle empty stops", () => {
      const stops: Stop[] = [];
      const matrix: number[][] = [];
      const route = nearestNeighborTSP(stops, matrix, 0);

      expect(route).toEqual([]);
    });
  });

  describe("twoOptOptimization", () => {
    it("should optimize route by removing crossings", () => {
      const stops: Stop[] = [
        {
          id: "1",
          name: "Charlotte",
          latitude: 35.227,
          longitude: -80.843,
          priority: 3,
          serviceTime: 30,
        },
        {
          id: "2",
          name: "Concord",
          latitude: 35.408,
          longitude: -80.579,
          priority: 3,
          serviceTime: 30,
        },
        {
          id: "3",
          name: "Harrisburg",
          latitude: 35.323,
          longitude: -80.655,
          priority: 3,
          serviceTime: 30,
        },
        {
          id: "4",
          name: "Matthews",
          latitude: 35.116,
          longitude: -80.716,
          priority: 3,
          serviceTime: 30,
        },
      ];

      const matrix = buildDistanceMatrix(stops);
      const initialRoute = [0, 1, 2, 3];
      const optimizedRoute = twoOptOptimization(initialRoute, matrix);

      expect(optimizedRoute).toHaveLength(4);
      expect(optimizedRoute).toContain(0);
      expect(optimizedRoute).toContain(1);
      expect(optimizedRoute).toContain(2);
      expect(optimizedRoute).toContain(3);
    });
  });

  describe("optimizeRoute", () => {
    it("should optimize a route with stops", () => {
      const stops: Stop[] = [
        {
          id: "1",
          name: "Charlotte",
          latitude: 35.227,
          longitude: -80.843,
          priority: 3,
          serviceTime: 30,
        },
        {
          id: "2",
          name: "Concord",
          latitude: 35.408,
          longitude: -80.579,
          priority: 3,
          serviceTime: 45,
        },
        {
          id: "3",
          name: "Harrisburg",
          latitude: 35.323,
          longitude: -80.655,
          priority: 4,
          serviceTime: 60,
        },
      ];

      const constraints: OptimizationConstraints = {
        trafficFactor: 1.0,
        prioritizePriority: true,
      };

      const result = optimizeRoute(stops, constraints);

      expect(result.stops).toHaveLength(3);
      expect(result.totalDistance).toBeGreaterThan(0);
      expect(result.totalTravelTime).toBeGreaterThan(0);
      expect(result.totalServiceTime).toBe(135); // 30 + 45 + 60
      expect(result.efficiencyScore).toBeGreaterThanOrEqual(0);
      expect(result.efficiencyScore).toBeLessThanOrEqual(100);
    });

    it("should respect maxStops constraint", () => {
      const stops: Stop[] = Array.from({ length: 15 }, (_, i) => ({
        id: `${i}`,
        name: `Stop ${i}`,
        latitude: 35.227 + i * 0.01,
        longitude: -80.843 + i * 0.01,
        priority: 3,
        serviceTime: 30,
      }));

      const constraints: OptimizationConstraints = {
        maxStops: 5,
      };

      const result = optimizeRoute(stops, constraints);

      expect(result.stops.length).toBeLessThanOrEqual(5);
    });

    it("should prioritize high priority stops", () => {
      const stops: Stop[] = [
        {
          id: "1",
          name: "Low Priority",
          latitude: 35.227,
          longitude: -80.843,
          priority: 1,
          serviceTime: 30,
        },
        {
          id: "2",
          name: "High Priority",
          latitude: 35.408,
          longitude: -80.579,
          priority: 5,
          serviceTime: 30,
        },
        {
          id: "3",
          name: "Medium Priority",
          latitude: 35.323,
          longitude: -80.655,
          priority: 3,
          serviceTime: 30,
        },
      ];

      const constraints: OptimizationConstraints = {
        prioritizePriority: true,
      };

      const result = optimizeRoute(stops, constraints);

      // High priority should come first
      expect(result.stops[0].priority).toBeGreaterThanOrEqual(
        result.stops[1].priority
      );
    });

    it("should handle time windows", () => {
      const now = Date.now();
      const stops: Stop[] = [
        {
          id: "1",
          name: "Morning Stop",
          latitude: 35.227,
          longitude: -80.843,
          priority: 3,
          serviceTime: 30,
          timeWindow: {
            start: now + 3600000, // 1 hour from now
            end: now + 7200000, // 2 hours from now
          },
        },
        {
          id: "2",
          name: "Afternoon Stop",
          latitude: 35.408,
          longitude: -80.579,
          priority: 3,
          serviceTime: 30,
          timeWindow: {
            start: now + 14400000, // 4 hours from now
            end: now + 18000000, // 5 hours from now
          },
        },
      ];

      const constraints: OptimizationConstraints = {
        prioritizeTimeWindows: true,
      };

      const result = optimizeRoute(stops, constraints);

      expect(result.stops).toHaveLength(2);
    });
  });

  describe("estimateServiceTime", () => {
    it("should estimate service time for different service types", () => {
      expect(estimateServiceTime("consultation")).toBe(30);
      expect(estimateServiceTime("estimate")).toBe(45);
      expect(estimateServiceTime("repair")).toBe(60);
      expect(estimateServiceTime("installation")).toBe(120);
    });

    it("should return default time for unknown service type", () => {
      expect(estimateServiceTime("unknown")).toBe(45);
    });
  });

  describe("checkTimeWindows", () => {
    it("should detect time window violations", () => {
      const now = Date.now();
      const stops = [
        {
          id: "1",
          name: "Stop 1",
          latitude: 35.227,
          longitude: -80.843,
          priority: 3,
          serviceTime: 30,
          estimatedArrival: now,
          departureTime: now + 1800000,
        },
        {
          id: "2",
          name: "Late Stop",
          latitude: 35.408,
          longitude: -80.579,
          priority: 3,
          serviceTime: 30,
          estimatedArrival: now,
          departureTime: now + 1800000,
          timeWindow: {
            start: now - 3600000, // 1 hour ago
            end: now - 1800000, // 30 min ago
          },
          travelTimeFromPrevious: 30,
        },
      ] as any;

      const violations = checkTimeWindows(stops);

      expect(violations.length).toBeGreaterThan(0);
      expect(violations[0]).toContain("Late");
    });

    it("should not report violations when on time", () => {
      const now = Date.now();
      const stops = [
        {
          id: "1",
          name: "Stop 1",
          latitude: 35.227,
          longitude: -80.843,
          priority: 3,
          serviceTime: 30,
          estimatedArrival: now,
          departureTime: now + 1800000,
          timeWindow: {
            start: now - 3600000,
            end: now + 3600000,
          },
          travelTimeFromPrevious: 0,
        },
      ] as any;

      const violations = checkTimeWindows(stops);

      expect(violations.length).toBe(0);
    });
  });

  describe("calculateEfficiencyScore", () => {
    it("should calculate high score for efficient routes", () => {
      const route = {
        stops: [] as any,
        totalDistance: 10,
        totalTravelTime: 20,
        totalServiceTime: 120,
        totalTime: 140,
        efficiencyScore: 0,
        violations: [],
      };

      route.efficiencyScore = calculateEfficiencyScore(route);

      expect(route.efficiencyScore).toBeGreaterThan(70);
    });

    it("should penalize routes with high travel time", () => {
      const route = {
        stops: [] as any,
        totalDistance: 100,
        totalTravelTime: 200,
        totalServiceTime: 60,
        totalTime: 260,
        efficiencyScore: 0,
        violations: [],
      };

      route.efficiencyScore = calculateEfficiencyScore(route);

      expect(route.efficiencyScore).toBeLessThan(50);
    });

    it("should penalize time window violations", () => {
      const route = {
        stops: [] as any,
        totalDistance: 10,
        totalTravelTime: 20,
        totalServiceTime: 120,
        totalTime: 140,
        efficiencyScore: 0,
        violations: ["Violation 1", "Violation 2"],
      };

      route.efficiencyScore = calculateEfficiencyScore(route);

      expect(route.efficiencyScore).toBeLessThan(90);
    });
  });

  describe("Edge Cases", () => {
    it("should handle empty stops array", () => {
      const result = optimizeRoute([]);

      expect(result.stops).toHaveLength(0);
      expect(result.totalDistance).toBe(0);
      expect(result.totalTravelTime).toBe(0);
      expect(result.totalServiceTime).toBe(0);
    });

    it("should handle single stop", () => {
      const stops: Stop[] = [
        {
          id: "1",
          name: "Single Stop",
          latitude: 35.227,
          longitude: -80.843,
          priority: 3,
          serviceTime: 30,
        },
      ];

      const result = optimizeRoute(stops);

      expect(result.stops).toHaveLength(1);
      expect(result.totalDistance).toBe(0);
      expect(result.totalTravelTime).toBe(0);
      expect(result.totalServiceTime).toBe(30);
    });

    it("should handle two stops", () => {
      const stops: Stop[] = [
        {
          id: "1",
          name: "Stop 1",
          latitude: 35.227,
          longitude: -80.843,
          priority: 3,
          serviceTime: 30,
        },
        {
          id: "2",
          name: "Stop 2",
          latitude: 35.408,
          longitude: -80.579,
          priority: 3,
          serviceTime: 30,
        },
      ];

      const result = optimizeRoute(stops);

      expect(result.stops).toHaveLength(2);
      expect(result.totalDistance).toBeGreaterThan(0);
    });
  });
});
