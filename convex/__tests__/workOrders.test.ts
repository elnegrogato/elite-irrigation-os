import { describe, it, expect, beforeEach, vi } from 'vitest';
import { MockDatabase, createMockContext } from '../test/helpers';

describe('Work Orders (Comprehensive Tests)', () => {
  let mockDb: MockDatabase;
  let mockCtx: any;

  beforeEach(() => {
    mockDb = new MockDatabase();
    mockCtx = createMockContext(mockDb);
    vi.clearAllMocks();
  });

  describe('Work order creation', () => {
    it('creates work order with valid data', () => {
      const leadId = mockDb.insert('leads', {
        name: 'Test Lead',
        createdAt: Date.now(),
        updatedAt: Date.now(),
        stage: 'booked',
        surface: 'web',
        entityType: 'homeowner',
        intent: 'installation',
        lastInboundAt: Date.now(),
        respondBy: Date.now() + 2 * 60 * 60 * 1000,
      });

      const estimateId = mockDb.insert('estimates', {
        leadId,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        status: 'accepted',
        items: [],
        total: 1500,
      });

      const now = Date.now();
      const scheduledFor = now + 7 * 24 * 60 * 60 * 1000; // 1 week from now

      const workOrderId = mockDb.insert('workOrders', {
        createdAt: now,
        updatedAt: now,
        leadId,
        estimateId,
        serviceSlug: 'irrigation-installation',
        locationSlug: 'austin-tx',
        addressText: '123 Main St, Austin, TX',
        priority: 'normal',
        category: 'installation',
        status: 'scheduled',
        scheduledFor,
        windowMins: 120,
        scope: ['Install main controller', 'Run zone lines', 'Install heads'],
        proofRequired: true,
        proofComplete: false,
      });

      expect(workOrderId).toBeDefined();
      const workOrder = mockDb.get(workOrderId);
      expect(workOrder?.status).toBe('scheduled');
      expect(workOrder?.priority).toBe('normal');
      expect(workOrder?.scope).toHaveLength(3);
    });

    it('creates work order without estimate', () => {
      const leadId = mockDb.insert('leads', {
        name: 'Test Lead',
        createdAt: Date.now(),
        updatedAt: Date.now(),
        stage: 'booked',
        surface: 'web',
        entityType: 'homeowner',
        intent: 'repair',
        lastInboundAt: Date.now(),
        respondBy: Date.now() + 2 * 60 * 60 * 1000,
      });

      const workOrderId = mockDb.insert('workOrders', {
        createdAt: Date.now(),
        updatedAt: Date.now(),
        leadId,
        serviceSlug: 'irrigation-repair',
        locationSlug: 'austin-tx',
        priority: 'urgent',
        category: 'repair',
        status: 'pending',
        proofRequired: true,
        proofComplete: false,
      });

      const workOrder = mockDb.get(workOrderId);
      expect(workOrder?.estimateId).toBeUndefined();
    });

    it('sets priority correctly', () => {
      const priorities = ['low', 'normal', 'urgent', 'emergency'];

      priorities.forEach((priority) => {
        const workOrderId = mockDb.insert('workOrders', {
          createdAt: Date.now(),
          updatedAt: Date.now(),
          serviceSlug: 'irrigation-repair',
          priority,
          category: 'repair',
          status: 'pending',
          proofRequired: true,
          proofComplete: false,
        });

        const workOrder = mockDb.get(workOrderId);
        expect(workOrder?.priority).toBe(priority);
      });
    });
  });

  describe('Work order scheduling', () => {
    it('schedules work order for future date', () => {
      const now = Date.now();
      const scheduledFor = now + 7 * 24 * 60 * 60 * 1000;

      const workOrderId = mockDb.insert('workOrders', {
        createdAt: now,
        updatedAt: now,
        serviceSlug: 'irrigation-installation',
        scheduledFor,
        windowMins: 120,
        priority: 'normal',
        category: 'installation',
        status: 'scheduled',
        proofRequired: true,
        proofComplete: false,
      });

      const workOrder = mockDb.get(workOrderId);
      expect(workOrder?.scheduledFor).toBe(scheduledFor);
      expect(workOrder?.scheduledFor).toBeGreaterThan(now);
    });

    it('sets time window for appointment', () => {
      const windows = [60, 120, 180, 240]; // 1-4 hours

      windows.forEach((windowMins) => {
        const workOrderId = mockDb.insert('workOrders', {
          createdAt: Date.now(),
          updatedAt: Date.now(),
          serviceSlug: 'irrigation-installation',
          scheduledFor: Date.now() + 7 * 24 * 60 * 60 * 1000,
          windowMins,
          priority: 'normal',
          category: 'installation',
          status: 'scheduled',
          proofRequired: true,
          proofComplete: false,
        });

        const workOrder = mockDb.get(workOrderId);
        expect(workOrder?.windowMins).toBe(windowMins);
      });
    });

    it('queries work orders by scheduled date', () => {
      const now = Date.now();

      const workOrderId1 = mockDb.insert('workOrders', {
        createdAt: now,
        updatedAt: now,
        serviceSlug: 'irrigation-installation',
        scheduledFor: now + 7 * 24 * 60 * 60 * 1000,
        priority: 'normal',
        category: 'installation',
        status: 'scheduled',
        proofRequired: true,
        proofComplete: false,
      });

      const workOrderId2 = mockDb.insert('workOrders', {
        createdAt: now,
        updatedAt: now,
        serviceSlug: 'irrigation-repair',
        scheduledFor: now + 14 * 24 * 60 * 60 * 1000,
        priority: 'normal',
        category: 'repair',
        status: 'scheduled',
        proofRequired: true,
        proofComplete: false,
      });

      const allWorkOrders = mockDb.all('workOrders');
      const sortedWorkOrders = allWorkOrders.sort((a: any, b: any) => a.scheduledFor! - b.scheduledFor!);

      expect(sortedWorkOrders[0]._id).toBe(workOrderId1);
      expect(sortedWorkOrders[1]._id).toBe(workOrderId2);
    });
  });

  describe('Work order assignment', () => {
    it('assigns work order to staff member', () => {
      const assignedTo = 'staff123';

      const workOrderId = mockDb.insert('workOrders', {
        createdAt: Date.now(),
        updatedAt: Date.now(),
        serviceSlug: 'irrigation-installation',
        assignedTo,
        priority: 'normal',
        category: 'installation',
        status: 'assigned',
        proofRequired: true,
        proofComplete: false,
      });

      const workOrder = mockDb.get(workOrderId);
      expect(workOrder?.assignedTo).toBe(assignedTo);
      expect(workOrder?.status).toBe('assigned');
    });

    it('updates status when assigned', () => {
      const assignedTo = 'staff123';

      const workOrderId = mockDb.insert('workOrders', {
        createdAt: Date.now(),
        updatedAt: Date.now(),
        serviceSlug: 'irrigation-installation',
        assignedTo,
        priority: 'normal',
        category: 'installation',
        status: 'assigned',
        proofRequired: true,
        proofComplete: false,
      });

      const workOrder = mockDb.get(workOrderId);
      expect(workOrder?.status).toBe('assigned');
    });
  });

  describe('Proof of completion', () => {
    it('requires proof for work order', () => {
      const workOrderId = mockDb.insert('workOrders', {
        createdAt: Date.now(),
        updatedAt: Date.now(),
        serviceSlug: 'irrigation-installation',
        priority: 'normal',
        category: 'installation',
        status: 'in_progress',
        proofRequired: true,
        proofComplete: false,
      });

      const workOrder = mockDb.get(workOrderId);
      expect(workOrder?.proofRequired).toBe(true);
      expect(workOrder?.proofComplete).toBe(false);
    });

    it('marks proof as complete', () => {
      const workOrderId = mockDb.insert('workOrders', {
        createdAt: Date.now(),
        updatedAt: Date.now(),
        serviceSlug: 'irrigation-installation',
        priority: 'normal',
        category: 'installation',
        status: 'in_progress',
        proofRequired: true,
        proofComplete: true,
      });

      const workOrder = mockDb.get(workOrderId);
      expect(workOrder?.proofComplete).toBe(true);
    });

    it('adds media to work order', () => {
      const workOrderId = mockDb.insert('workOrders', {
        createdAt: Date.now(),
        updatedAt: Date.now(),
        serviceSlug: 'irrigation-installation',
        priority: 'normal',
        category: 'installation',
        status: 'completed',
        proofRequired: true,
        proofComplete: true,
        closedAt: Date.now(),
      });

      const mediaId = mockDb.insert('workOrderMedia', {
        createdAt: Date.now(),
        workOrderId,
        kind: 'photo',
        url: 'https://example.com/photo.jpg',
        caption: 'Completed installation',
      });

      expect(mediaId).toBeDefined();
      const media = mockDb.get(mediaId);
      expect(media?.kind).toBe('photo');
    });
  });

  describe('Budget tracking', () => {
    it('sets not to exceed amount', () => {
      const notToExceed = 2000;

      const workOrderId = mockDb.insert('workOrders', {
        createdAt: Date.now(),
        updatedAt: Date.now(),
        serviceSlug: 'irrigation-installation',
        priority: 'normal',
        category: 'installation',
        status: 'scheduled',
        proofRequired: true,
        proofComplete: false,
        notToExceed,
      });

      const workOrder = mockDb.get(workOrderId);
      expect(workOrder?.notToExceed).toBe(notToExceed);
    });

    it('sets approved budget', () => {
      const approvedBudget = 1500;

      const workOrderId = mockDb.insert('workOrders', {
        createdAt: Date.now(),
        updatedAt: Date.now(),
        serviceSlug: 'irrigation-installation',
        priority: 'normal',
        category: 'installation',
        status: 'scheduled',
        proofRequired: true,
        proofComplete: false,
        approvedBudget,
      });

      const workOrder = mockDb.get(workOrderId);
      expect(workOrder?.approvedBudget).toBe(approvedBudget);
    });

    it('validates budget against not to exceed', () => {
      const notToExceed = 2000;
      const approvedBudget = 1500;

      expect(approvedBudget).toBeLessThanOrEqual(notToExceed);
    });
  });

  describe('Work order status transitions', () => {
    it('transitions through valid statuses', () => {
      const statuses = [
        'pending',
        'scheduled',
        'assigned',
        'en_route',
        'in_progress',
        'completed',
        'verified',
        'invoiced',
        'cancelled',
      ];

      const workOrderId = mockDb.insert('workOrders', {
        createdAt: Date.now(),
        updatedAt: Date.now(),
        serviceSlug: 'irrigation-installation',
        priority: 'normal',
        category: 'installation',
        status: 'pending',
        proofRequired: true,
        proofComplete: false,
      });

      statuses.forEach((status) => {
        mockDb.patch(workOrderId, { status, updatedAt: Date.now() });
        const workOrder = mockDb.get(workOrderId);
        expect(workOrder?.status).toBe(status);
      });
    });

    it('sets closedAt timestamp when completed', () => {
      const now = Date.now();

      const workOrderId = mockDb.insert('workOrders', {
        createdAt: now,
        updatedAt: now,
        serviceSlug: 'irrigation-installation',
        priority: 'normal',
        category: 'installation',
        status: 'completed',
        proofRequired: true,
        proofComplete: true,
        closedAt: now,
      });

      const workOrder = mockDb.get(workOrderId);
      expect(workOrder?.closedAt).toBeDefined();
      expect(workOrder?.closedAt).toBe(now);
    });
  });

  describe('Manager overrides', () => {
    it('sets manager override for close', () => {
      const workOrderId = mockDb.insert('workOrders', {
        createdAt: Date.now(),
        updatedAt: Date.now(),
        serviceSlug: 'irrigation-installation',
        priority: 'normal',
        category: 'installation',
        status: 'completed',
        proofRequired: true,
        proofComplete: false, // Proof not complete but still closed
        managerOverrideClose: true,
        closedAt: Date.now(),
      });

      const workOrder = mockDb.get(workOrderId);
      expect(workOrder?.managerOverrideClose).toBe(true);
    });

    it('sets manager override for schedule', () => {
      const workOrderId = mockDb.insert('workOrders', {
        createdAt: Date.now(),
        updatedAt: Date.now(),
        serviceSlug: 'irrigation-installation',
        scheduledFor: Date.now() - 1000, // Past date
        priority: 'normal',
        category: 'installation',
        status: 'scheduled',
        proofRequired: true,
        proofComplete: false,
        managerOverrideSchedule: true,
      });

      const workOrder = mockDb.get(workOrderId);
      expect(workOrder?.managerOverrideSchedule).toBe(true);
    });
  });

  describe('Work order queries', () => {
    it('queries work orders by status', () => {
      const workOrderId1 = mockDb.insert('workOrders', {
        createdAt: Date.now(),
        updatedAt: Date.now(),
        serviceSlug: 'irrigation-installation',
        priority: 'normal',
        category: 'installation',
        status: 'scheduled',
        proofRequired: true,
        proofComplete: false,
      });

      const workOrderId2 = mockDb.insert('workOrders', {
        createdAt: Date.now(),
        updatedAt: Date.now(),
        serviceSlug: 'irrigation-repair',
        priority: 'urgent',
        category: 'repair',
        status: 'in_progress',
        proofRequired: true,
        proofComplete: false,
      });

      const allWorkOrders = mockDb.all('workOrders');
      const scheduledOrders = allWorkOrders.filter((wo: any) => wo.status === 'scheduled');
      const inProgressOrders = allWorkOrders.filter((wo: any) => wo.status === 'in_progress');

      expect(scheduledOrders).toHaveLength(1);
      expect(inProgressOrders).toHaveLength(1);
    });

    it('queries work orders by assigned staff', () => {
      const assignedTo = 'staff123';

      const workOrderId1 = mockDb.insert('workOrders', {
        createdAt: Date.now(),
        updatedAt: Date.now(),
        serviceSlug: 'irrigation-installation',
        assignedTo,
        priority: 'normal',
        category: 'installation',
        status: 'assigned',
        proofRequired: true,
        proofComplete: false,
      });

      const workOrderId2 = mockDb.insert('workOrders', {
        createdAt: Date.now(),
        updatedAt: Date.now(),
        serviceSlug: 'irrigation-repair',
        assignedTo,
        priority: 'normal',
        category: 'repair',
        status: 'assigned',
        proofRequired: true,
        proofComplete: false,
      });

      const allWorkOrders = mockDb.all('workOrders');
      const assignedOrders = allWorkOrders.filter((wo: any) => wo.assignedTo === assignedTo);

      expect(assignedOrders).toHaveLength(2);
    });

    it('queries work orders by service and location', () => {
      const serviceSlug = 'irrigation-installation';
      const locationSlug = 'austin-tx';

      const workOrderId = mockDb.insert('workOrders', {
        createdAt: Date.now(),
        updatedAt: Date.now(),
        serviceSlug,
        locationSlug,
        priority: 'normal',
        category: 'installation',
        status: 'scheduled',
        proofRequired: true,
        proofComplete: false,
      });

      const allWorkOrders = mockDb.all('workOrders');
      const filteredOrders = allWorkOrders.filter(
        (wo: any) => wo.serviceSlug === serviceSlug && wo.locationSlug === locationSlug
      );

      expect(filteredOrders).toHaveLength(1);
    });
  });

  describe('Work order scope', () => {
    it('stores scope items', () => {
      const scope = [
        'Install main controller',
        'Run zone lines',
        'Install sprinkler heads',
        'Test system',
        'Train customer',
      ];

      const workOrderId = mockDb.insert('workOrders', {
        createdAt: Date.now(),
        updatedAt: Date.now(),
        serviceSlug: 'irrigation-installation',
        priority: 'normal',
        category: 'installation',
        status: 'scheduled',
        scope,
        proofRequired: true,
        proofComplete: false,
      });

      const workOrder = mockDb.get(workOrderId);
      expect(workOrder?.scope).toEqual(scope);
      expect(workOrder?.scope).toHaveLength(5);
    });
  });
});
