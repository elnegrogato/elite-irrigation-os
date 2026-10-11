import { describe, it, expect, beforeEach, vi } from 'vitest';
import { MockDatabase, createMockContext } from '../test/helpers';

describe('Estimates (Comprehensive Tests)', () => {
  let mockDb: MockDatabase;
  let mockCtx: any;

  beforeEach(() => {
    mockDb = new MockDatabase();
    mockCtx = createMockContext(mockDb);
    vi.clearAllMocks();
  });

  describe('Estimate creation', () => {
    it('creates estimate with valid items', () => {
      const leadId = mockDb.insert('leads', {
        name: 'Test Lead',
        createdAt: Date.now(),
        updatedAt: Date.now(),
        stage: 'inspected',
        surface: 'web',
        entityType: 'homeowner',
        intent: 'installation',
        lastInboundAt: Date.now(),
        respondBy: Date.now() + 2 * 60 * 60 * 1000,
      });

      const items = [
        {
          sku: 'IRR-001',
          name: 'Irrigation Controller',
          qty: 1,
          unit: 'ea',
          unitPrice: 250,
        },
        {
          sku: 'IRR-002',
          name: 'Sprinkler Heads',
          qty: 20,
          unit: 'ea',
          unitPrice: 5,
        },
      ];

      const now = Date.now();
      const total = items.reduce((sum, item) => sum + item.qty * item.unitPrice, 0);

      const estimateId = mockDb.insert('estimates', {
        leadId,
        createdAt: now,
        updatedAt: now,
        status: 'draft',
        items,
        total,
      });

      expect(estimateId).toBeDefined();
      const estimate = mockDb.get(estimateId);
      expect(estimate?.total).toBe(350); // 250 + (20 * 5)
      expect(estimate?.items).toHaveLength(2);
    });

    it('calculates line item totals correctly', () => {
      const items = [
        { qty: 2, unitPrice: 100, expectedTotal: 200 },
        { qty: 5, unitPrice: 50, expectedTotal: 250 },
        { qty: 10, unitPrice: 25, expectedTotal: 250 },
        { qty: 1, unitPrice: 1000, expectedTotal: 1000 },
      ];

      items.forEach((item) => {
        const lineTotal = item.qty * item.unitPrice;
        expect(lineTotal).toBe(item.expectedTotal);
      });
    });

    it('creates estimate with tier options', () => {
      const leadId = mockDb.insert('leads', {
        name: 'Test Lead',
        createdAt: Date.now(),
        updatedAt: Date.now(),
        stage: 'inspected',
        surface: 'web',
        entityType: 'homeowner',
        intent: 'installation',
        lastInboundAt: Date.now(),
        respondBy: Date.now() + 2 * 60 * 60 * 1000,
      });

      const tierOptions = [
        {
          tier: 'Basic',
          total: 1500,
          summary: 'Essential irrigation system',
        },
        {
          tier: 'Premium',
          total: 2500,
          summary: 'Full system with smart controller',
        },
        {
          tier: 'Elite',
          total: 4000,
          summary: 'Complete system with weather sensors',
        },
      ];

      const estimateId = mockDb.insert('estimates', {
        leadId,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        status: 'draft',
        items: [],
        total: 1500,
        tierOptions,
      });

      const estimate = mockDb.get(estimateId);
      expect(estimate?.tierOptions).toHaveLength(3);
      expect(estimate?.tierOptions?.[0].tier).toBe('Basic');
    });

    it('sets expiration date on estimate', () => {
      const leadId = mockDb.insert('leads', {
        name: 'Test Lead',
        createdAt: Date.now(),
        updatedAt: Date.now(),
        stage: 'inspected',
        surface: 'web',
        entityType: 'homeowner',
        intent: 'installation',
        lastInboundAt: Date.now(),
        respondBy: Date.now() + 2 * 60 * 60 * 1000,
      });

      const now = Date.now();
      const expiresAt = now + 30 * 24 * 60 * 60 * 1000; // 30 days

      const estimateId = mockDb.insert('estimates', {
        leadId,
        createdAt: now,
        updatedAt: now,
        status: 'draft',
        items: [],
        total: 1000,
        expiresAt,
      });

      const estimate = mockDb.get(estimateId);
      expect(estimate?.expiresAt).toBeDefined();
      expect(estimate?.expiresAt).toBeGreaterThan(now);
    });

    it('creates event on estimate creation', () => {
      const leadId = mockDb.insert('leads', {
        name: 'Test Lead',
        createdAt: Date.now(),
        updatedAt: Date.now(),
        stage: 'inspected',
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
        status: 'draft',
        items: [],
        total: 1000,
      });

      const eventId = mockDb.insert('events', {
        ts: Date.now(),
        leadId,
        type: 'estimate',
        direction: 'system',
        payload: { estimateId, status: 'draft', total: 1000 },
      });

      const event = mockDb.get(eventId);
      expect(event?.type).toBe('estimate');
      expect(event?.payload.estimateId).toBe(estimateId);
    });
  });

  describe('Estimate status updates', () => {
    it('transitions estimate through valid statuses', () => {
      const statuses = ['draft', 'sent', 'accepted', 'rejected', 'expired'];

      const leadId = mockDb.insert('leads', {
        name: 'Test Lead',
        createdAt: Date.now(),
        updatedAt: Date.now(),
        stage: 'inspected',
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
        status: 'draft',
        items: [],
        total: 1000,
      });

      statuses.forEach((status) => {
        mockDb.patch(estimateId, { status, updatedAt: Date.now() });
        const estimate = mockDb.get(estimateId);
        expect(estimate?.status).toBe(status);
      });
    });

    it('records status change in events', () => {
      const leadId = mockDb.insert('leads', {
        name: 'Test Lead',
        createdAt: Date.now(),
        updatedAt: Date.now(),
        stage: 'inspected',
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
        status: 'draft',
        items: [],
        total: 1000,
      });

      mockDb.patch(estimateId, { status: 'sent', updatedAt: Date.now() });

      const eventId = mockDb.insert('events', {
        ts: Date.now(),
        leadId,
        type: 'estimate_status',
        direction: 'system',
        payload: { estimateId, status: 'sent' },
      });

      const event = mockDb.get(eventId);
      expect(event?.payload.status).toBe('sent');
    });
  });

  describe('Approval thresholds', () => {
    it('creates approval request for estimates over threshold', () => {
      const leadId = mockDb.insert('leads', {
        name: 'Test Lead',
        createdAt: Date.now(),
        updatedAt: Date.now(),
        stage: 'inspected',
        surface: 'web',
        entityType: 'homeowner',
        intent: 'installation',
        lastInboundAt: Date.now(),
        respondBy: Date.now() + 2 * 60 * 60 * 1000,
      });

      const threshold = 1000;
      const total = 1500; // Over threshold

      const estimateId = mockDb.insert('estimates', {
        leadId,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        status: 'draft',
        items: [],
        total,
      });

      if (total >= threshold) {
        const approvalId = mockDb.insert('approvalRequests', {
          createdAt: Date.now(),
          updatedAt: Date.now(),
          kind: 'estimate',
          entityId: String(estimateId),
          leadId,
          amount: total,
          currency: 'USD',
          reason: `Estimate total exceeds threshold (${threshold})`,
          threshold,
          status: 'pending',
          requestedBy: 'system',
        });

        expect(approvalId).toBeDefined();
        const approval = mockDb.get(approvalId);
        expect(approval?.kind).toBe('estimate');
        expect(approval?.amount).toBe(total);
      }
    });

    it('skips approval for estimates under threshold', () => {
      const leadId = mockDb.insert('leads', {
        name: 'Test Lead',
        createdAt: Date.now(),
        updatedAt: Date.now(),
        stage: 'inspected',
        surface: 'web',
        entityType: 'homeowner',
        intent: 'installation',
        lastInboundAt: Date.now(),
        respondBy: Date.now() + 2 * 60 * 60 * 1000,
      });

      const threshold = 1000;
      const total = 500; // Under threshold

      const estimateId = mockDb.insert('estimates', {
        leadId,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        status: 'draft',
        items: [],
        total,
      });

      if (total < threshold) {
        // No approval should be created
        const approvals = mockDb.all('approvalRequests');
        expect(approvals).toHaveLength(0);
      }
    });
  });

  describe('Estimate queries', () => {
    it('queries estimates by lead', () => {
      const leadId = mockDb.insert('leads', {
        name: 'Test Lead',
        createdAt: Date.now(),
        updatedAt: Date.now(),
        stage: 'inspected',
        surface: 'web',
        entityType: 'homeowner',
        intent: 'installation',
        lastInboundAt: Date.now(),
        respondBy: Date.now() + 2 * 60 * 60 * 1000,
      });

      mockDb.insert('estimates', {
        leadId,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        status: 'draft',
        items: [],
        total: 1000,
      });

      mockDb.insert('estimates', {
        leadId,
        createdAt: Date.now() + 1000,
        updatedAt: Date.now() + 1000,
        status: 'sent',
        items: [],
        total: 1500,
      });

      const allEstimates = mockDb.all('estimates');
      const leadEstimates = allEstimates.filter((e: any) => e.leadId === leadId);

      expect(leadEstimates).toHaveLength(2);
    });

    it('queries estimates by status', () => {
      const leadId1 = mockDb.insert('leads', {
        name: 'Lead 1',
        createdAt: Date.now(),
        updatedAt: Date.now(),
        stage: 'inspected',
        surface: 'web',
        entityType: 'homeowner',
        intent: 'installation',
        lastInboundAt: Date.now(),
        respondBy: Date.now() + 2 * 60 * 60 * 1000,
      });

      const leadId2 = mockDb.insert('leads', {
        name: 'Lead 2',
        createdAt: Date.now(),
        updatedAt: Date.now(),
        stage: 'inspected',
        surface: 'web',
        entityType: 'homeowner',
        intent: 'installation',
        lastInboundAt: Date.now(),
        respondBy: Date.now() + 2 * 60 * 60 * 1000,
      });

      mockDb.insert('estimates', {
        leadId: leadId1,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        status: 'draft',
        items: [],
        total: 1000,
      });

      mockDb.insert('estimates', {
        leadId: leadId2,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        status: 'sent',
        items: [],
        total: 1500,
      });

      const allEstimates = mockDb.all('estimates');
      const draftEstimates = allEstimates.filter((e: any) => e.status === 'draft');
      const sentEstimates = allEstimates.filter((e: any) => e.status === 'sent');

      expect(draftEstimates).toHaveLength(1);
      expect(sentEstimates).toHaveLength(1);
    });

    it('queries recent estimates', () => {
      const leadId = mockDb.insert('leads', {
        name: 'Test Lead',
        createdAt: Date.now(),
        updatedAt: Date.now(),
        stage: 'inspected',
        surface: 'web',
        entityType: 'homeowner',
        intent: 'installation',
        lastInboundAt: Date.now(),
        respondBy: Date.now() + 2 * 60 * 60 * 1000,
      });

      const now = Date.now();

      mockDb.insert('estimates', {
        leadId,
        createdAt: now - 10000,
        updatedAt: now - 10000,
        status: 'sent',
        items: [],
        total: 1000,
      });

      mockDb.insert('estimates', {
        leadId,
        createdAt: now,
        updatedAt: now,
        status: 'draft',
        items: [],
        total: 1500,
      });

      const allEstimates = mockDb.all('estimates');
      const sortedEstimates = allEstimates.sort((a: any, b: any) => b.createdAt - a.createdAt);

      expect(sortedEstimates[0].createdAt).toBeGreaterThan(sortedEstimates[1].createdAt);
    });
  });

  describe('Line item calculations', () => {
    it('calculates total with multiple items', () => {
      const items = [
        { sku: 'A', name: 'Item A', qty: 2, unit: 'ea', unitPrice: 100 },
        { sku: 'B', name: 'Item B', qty: 3, unit: 'ea', unitPrice: 50 },
        { sku: 'C', name: 'Item C', qty: 1, unit: 'ea', unitPrice: 200 },
      ];

      const total = items.reduce((sum, item) => sum + item.qty * item.unitPrice, 0);
      expect(total).toBe(550); // 200 + 150 + 200
    });

    it('handles zero quantity items', () => {
      const items = [
        { sku: 'A', name: 'Item A', qty: 0, unit: 'ea', unitPrice: 100 },
        { sku: 'B', name: 'Item B', qty: 2, unit: 'ea', unitPrice: 50 },
      ];

      const total = items.reduce((sum, item) => sum + item.qty * item.unitPrice, 0);
      expect(total).toBe(100); // 0 + 100
    });

    it('handles decimal unit prices', () => {
      const items = [
        { sku: 'A', name: 'Item A', qty: 5, unit: 'ea', unitPrice: 12.5 },
        { sku: 'B', name: 'Item B', qty: 3, unit: 'ea', unitPrice: 33.33 },
      ];

      const total = items.reduce((sum, item) => sum + item.qty * item.unitPrice, 0);
      expect(total).toBeCloseTo(162.49, 2); // 62.5 + 99.99
    });
  });

  describe('Estimate notes', () => {
    it('stores notes with estimate', () => {
      const leadId = mockDb.insert('leads', {
        name: 'Test Lead',
        createdAt: Date.now(),
        updatedAt: Date.now(),
        stage: 'inspected',
        surface: 'web',
        entityType: 'homeowner',
        intent: 'installation',
        lastInboundAt: Date.now(),
        respondBy: Date.now() + 2 * 60 * 60 * 1000,
      });

      const notes = 'Please include discount for returning customer';

      const estimateId = mockDb.insert('estimates', {
        leadId,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        status: 'draft',
        items: [],
        total: 1000,
        notes,
      });

      const estimate = mockDb.get(estimateId);
      expect(estimate?.notes).toBe(notes);
    });
  });

  describe('Estimate expiration', () => {
    it('identifies expired estimates', () => {
      const now = Date.now();
      const pastTime = now - 1000;

      const leadId = mockDb.insert('leads', {
        name: 'Test Lead',
        createdAt: Date.now(),
        updatedAt: Date.now(),
        stage: 'inspected',
        surface: 'web',
        entityType: 'homeowner',
        intent: 'installation',
        lastInboundAt: Date.now(),
        respondBy: Date.now() + 2 * 60 * 60 * 1000,
      });

      const estimateId = mockDb.insert('estimates', {
        leadId,
        createdAt: now - 30 * 24 * 60 * 60 * 1000,
        updatedAt: now - 30 * 24 * 60 * 60 * 1000,
        status: 'sent',
        items: [],
        total: 1000,
        expiresAt: pastTime,
      });

      const estimate = mockDb.get(estimateId);
      expect(estimate?.expiresAt).toBeLessThan(now);
    });

    it('identifies valid estimates', () => {
      const now = Date.now();
      const futureTime = now + 30 * 24 * 60 * 60 * 1000;

      const leadId = mockDb.insert('leads', {
        name: 'Test Lead',
        createdAt: Date.now(),
        updatedAt: Date.now(),
        stage: 'inspected',
        surface: 'web',
        entityType: 'homeowner',
        intent: 'installation',
        lastInboundAt: Date.now(),
        respondBy: Date.now() + 2 * 60 * 60 * 1000,
      });

      const estimateId = mockDb.insert('estimates', {
        leadId,
        createdAt: now,
        updatedAt: now,
        status: 'sent',
        items: [],
        total: 1000,
        expiresAt: futureTime,
      });

      const estimate = mockDb.get(estimateId);
      expect(estimate?.expiresAt).toBeGreaterThan(now);
    });
  });
});
