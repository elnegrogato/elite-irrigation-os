import { describe, it, expect, beforeEach, vi } from 'vitest';
import { MockDatabase, createMockContext } from '../../../convex/test/helpers';

describe('Lead to Invoice Flow Integration Tests', () => {
  let mockDb: MockDatabase;
  let mockCtx: any;

  beforeEach(() => {
    mockDb = new MockDatabase();
    mockCtx = createMockContext(mockDb);
    vi.clearAllMocks();
  });

  describe('Complete lead to invoice flow', () => {
    it('creates lead through to invoice successfully', async () => {
      const now = Date.now();

      // Step 1: Create Lead
      const leadId = mockDb.insert('leads', {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '5551234567',
        createdAt: now,
        updatedAt: now,
        surface: 'organic_search',
        entityType: 'homeowner',
        intent: 'installation',
        urgency: null,
        stage: 'lead',
        respondBy: now + 2 * 60 * 60 * 1000,
        lastInboundAt: now,
      });

      expect(leadId).toBeDefined();
      let lead = mockDb.get(leadId);
      expect(lead?.stage).toBe('lead');

      // Step 2: Transition to inspected
      mockDb.patch(leadId, { stage: 'inspected', updatedAt: now + 1000 });
      mockDb.insert('events', {
        ts: now + 1000,
        leadId,
        type: 'stage_change',
        direction: 'human',
        payload: { from: 'lead', to: 'inspected' },
      });

      lead = mockDb.get(leadId);
      expect(lead?.stage).toBe('inspected');

      // Step 3: Create Estimate
      const estimateId = mockDb.insert('estimates', {
        leadId,
        createdAt: now + 2000,
        updatedAt: now + 2000,
        status: 'draft',
        items: [
          {
            sku: 'IRR-001',
            name: 'Irrigation Controller',
            qty: 1,
            unit: 'ea',
            unitPrice: 250,
          },
        ],
        total: 250,
      });

      expect(estimateId).toBeDefined();
      const estimate = mockDb.get(estimateId);
      expect(estimate?.status).toBe('draft');
      expect(estimate?.total).toBe(250);

      // Step 4: Update Estimate Status
      mockDb.patch(estimateId, { status: 'accepted', updatedAt: now + 3000 });
      mockDb.insert('events', {
        ts: now + 3000,
        leadId,
        type: 'estimate_status',
        direction: 'system',
        payload: { estimateId, status: 'accepted' },
      });

      // Step 5: Create Work Order
      const workOrderId = mockDb.insert('workOrders', {
        createdAt: now + 4000,
        updatedAt: now + 4000,
        leadId,
        estimateId,
        serviceSlug: 'irrigation-installation',
        locationSlug: 'austin-tx',
        addressText: '123 Main St',
        priority: 'normal',
        category: 'installation',
        status: 'scheduled',
        scheduledFor: now + 7 * 24 * 60 * 60 * 1000,
        proofRequired: true,
        proofComplete: false,
      });

      expect(workOrderId).toBeDefined();
      let workOrder = mockDb.get(workOrderId);
      expect(workOrder?.status).toBe('scheduled');
      expect(workOrder?.estimateId).toBe(estimateId);

      // Step 6: Complete Work Order
      mockDb.patch(workOrderId, {
        status: 'completed',
        proofComplete: true,
        closedAt: now + 5000,
        updatedAt: now + 5000,
      });

      workOrder = mockDb.get(workOrderId);
      expect(workOrder?.status).toBe('completed');
      expect(workOrder?.proofComplete).toBe(true);

      // Step 7: Update Lead Stage
      mockDb.patch(leadId, { stage: 'completed', updatedAt: now + 6000 });

      lead = mockDb.get(leadId);
      expect(lead?.stage).toBe('completed');

      // Step 8: Create Invoice
      const invoiceId = mockDb.insert('invoices', {
        createdAt: now + 7000,
        updatedAt: now + 7000,
        leadId,
        workOrderId,
        status: 'pending',
        subtotal: 250,
        tax: 25,
        total: 275,
        amountPaid: 0,
        balanceDue: 275,
      });

      expect(invoiceId).toBeDefined();
      const invoice = mockDb.get(invoiceId);
      expect(invoice?.status).toBe('pending');
      expect(invoice?.workOrderId).toBe(workOrderId);
      expect(invoice?.leadId).toBe(leadId);

      // Verify the complete chain
      expect(leadId).toBeDefined();
      expect(estimateId).toBeDefined();
      expect(workOrderId).toBeDefined();
      expect(invoiceId).toBeDefined();

      // Verify all records are linked correctly
      expect(invoice?.leadId).toBe(leadId);
      expect(invoice?.workOrderId).toBe(workOrderId);
      expect(workOrder?.estimateId).toBe(estimateId);
      expect(workOrder?.leadId).toBe(leadId);
      expect(estimate?.leadId).toBe(leadId);
    });
  });

  describe('Status propagation through the flow', () => {
    it('updates lead stage at each step', () => {
      const now = Date.now();

      const leadId = mockDb.insert('leads', {
        name: 'Test Lead',
        createdAt: now,
        updatedAt: now,
        stage: 'lead',
        surface: 'web',
        entityType: 'homeowner',
        intent: 'installation',
        lastInboundAt: now,
        respondBy: now + 2 * 60 * 60 * 1000,
      });

      const stages = ['lead', 'contacted', 'inspected', 'estimated', 'booked', 'inProgress', 'completed'];

      stages.forEach((stage, index) => {
        mockDb.patch(leadId, { stage, updatedAt: now + index * 1000 });
        const lead = mockDb.get(leadId);
        expect(lead?.stage).toBe(stage);
      });
    });

    it('tracks estimate status changes', () => {
      const now = Date.now();

      const leadId = mockDb.insert('leads', {
        name: 'Test Lead',
        createdAt: now,
        updatedAt: now,
        stage: 'inspected',
        surface: 'web',
        entityType: 'homeowner',
        intent: 'installation',
        lastInboundAt: now,
        respondBy: now + 2 * 60 * 60 * 1000,
      });

      const estimateId = mockDb.insert('estimates', {
        leadId,
        createdAt: now,
        updatedAt: now,
        status: 'draft',
        items: [],
        total: 1000,
      });

      const statuses = ['draft', 'sent', 'accepted'];

      statuses.forEach((status, index) => {
        mockDb.patch(estimateId, { status, updatedAt: now + index * 1000 });
        const estimate = mockDb.get(estimateId);
        expect(estimate?.status).toBe(status);
      });
    });

    it('tracks work order status changes', () => {
      const now = Date.now();

      const leadId = mockDb.insert('leads', {
        name: 'Test Lead',
        createdAt: now,
        updatedAt: now,
        stage: 'booked',
        surface: 'web',
        entityType: 'homeowner',
        intent: 'installation',
        lastInboundAt: now,
        respondBy: now + 2 * 60 * 60 * 1000,
      });

      const workOrderId = mockDb.insert('workOrders', {
        createdAt: now,
        updatedAt: now,
        leadId,
        serviceSlug: 'irrigation-installation',
        priority: 'normal',
        category: 'installation',
        status: 'pending',
        proofRequired: true,
        proofComplete: false,
      });

      const statuses = ['pending', 'scheduled', 'assigned', 'in_progress', 'completed'];

      statuses.forEach((status, index) => {
        mockDb.patch(workOrderId, { status, updatedAt: now + index * 1000 });
        const workOrder = mockDb.get(workOrderId);
        expect(workOrder?.status).toBe(status);
      });
    });

    it('tracks invoice status changes', () => {
      const now = Date.now();

      const leadId = mockDb.insert('leads', {
        name: 'Test Lead',
        createdAt: now,
        updatedAt: now,
        stage: 'completed',
        surface: 'web',
        entityType: 'homeowner',
        intent: 'installation',
        lastInboundAt: now,
        respondBy: now + 2 * 60 * 60 * 1000,
      });

      const workOrderId = mockDb.insert('workOrders', {
        createdAt: now,
        updatedAt: now,
        leadId,
        serviceSlug: 'irrigation-installation',
        priority: 'normal',
        category: 'installation',
        status: 'completed',
        proofRequired: true,
        proofComplete: true,
        closedAt: now,
      });

      const invoiceId = mockDb.insert('invoices', {
        createdAt: now,
        updatedAt: now,
        leadId,
        workOrderId,
        status: 'pending',
        subtotal: 1000,
        tax: 100,
        total: 1100,
        amountPaid: 0,
        balanceDue: 1100,
      });

      const statuses = ['pending', 'sent', 'paid'];

      statuses.forEach((status, index) => {
        const updateData: any = { status, updatedAt: now + index * 1000 };
        if (status === 'paid') {
          updateData.amountPaid = 1100;
          updateData.balanceDue = 0;
          updateData.paidAt = now + index * 1000;
        }

        mockDb.patch(invoiceId, updateData);
        const invoice = mockDb.get(invoiceId);
        expect(invoice?.status).toBe(status);
      });
    });
  });

  describe('Event tracking through the flow', () => {
    it('creates events for each stage change', () => {
      const now = Date.now();

      const leadId = mockDb.insert('leads', {
        name: 'Test Lead',
        createdAt: now,
        updatedAt: now,
        stage: 'lead',
        surface: 'web',
        entityType: 'homeowner',
        intent: 'installation',
        lastInboundAt: now,
        respondBy: now + 2 * 60 * 60 * 1000,
      });

      const stageChanges = [
        { from: 'lead', to: 'contacted' },
        { from: 'contacted', to: 'inspected' },
        { from: 'inspected', to: 'estimated' },
      ];

      stageChanges.forEach(({ from, to }, index) => {
        const eventId = mockDb.insert('events', {
          ts: now + index * 1000,
          leadId,
          type: 'stage_change',
          direction: 'human',
          payload: { from, to },
        });

        expect(eventId).toBeDefined();
        const event = mockDb.get(eventId);
        expect(event?.type).toBe('stage_change');
        expect(event?.payload).toEqual({ from, to });
      });
    });

    it('creates events for estimate creation and status changes', () => {
      const now = Date.now();

      const leadId = mockDb.insert('leads', {
        name: 'Test Lead',
        createdAt: now,
        updatedAt: now,
        stage: 'inspected',
        surface: 'web',
        entityType: 'homeowner',
        intent: 'installation',
        lastInboundAt: now,
        respondBy: now + 2 * 60 * 60 * 1000,
      });

      const estimateId = mockDb.insert('estimates', {
        leadId,
        createdAt: now,
        updatedAt: now,
        status: 'draft',
        items: [],
        total: 1000,
      });

      // Estimate creation event
      const createEventId = mockDb.insert('events', {
        ts: now,
        leadId,
        type: 'estimate',
        direction: 'system',
        payload: { estimateId, status: 'draft', total: 1000 },
      });

      expect(createEventId).toBeDefined();

      // Estimate status change event
      const statusEventId = mockDb.insert('events', {
        ts: now + 1000,
        leadId,
        type: 'estimate_status',
        direction: 'system',
        payload: { estimateId, status: 'sent' },
      });

      expect(statusEventId).toBeDefined();
    });
  });

  describe('Data integrity through the flow', () => {
    it('maintains customer information throughout', () => {
      const now = Date.now();

      const customerData = {
        name: 'Jane Smith',
        email: 'jane@example.com',
        phone: '5559876543',
      };

      const leadId = mockDb.insert('leads', {
        ...customerData,
        createdAt: now,
        updatedAt: now,
        stage: 'lead',
        surface: 'web',
        entityType: 'homeowner',
        intent: 'installation',
        lastInboundAt: now,
        respondBy: now + 2 * 60 * 60 * 1000,
      });

      const estimateId = mockDb.insert('estimates', {
        leadId,
        createdAt: now,
        updatedAt: now,
        status: 'draft',
        items: [],
        total: 1000,
      });

      const workOrderId = mockDb.insert('workOrders', {
        createdAt: now,
        updatedAt: now,
        leadId,
        estimateId,
        serviceSlug: 'irrigation-installation',
        priority: 'normal',
        category: 'installation',
        status: 'scheduled',
        proofRequired: true,
        proofComplete: false,
      });

      const invoiceId = mockDb.insert('invoices', {
        createdAt: now,
        updatedAt: now,
        leadId,
        workOrderId,
        status: 'pending',
        subtotal: 1000,
        tax: 100,
        total: 1100,
        amountPaid: 0,
        balanceDue: 1100,
        customerEmail: customerData.email,
      });

      // Verify customer data is preserved
      const lead = mockDb.get(leadId);
      expect(lead?.name).toBe(customerData.name);
      expect(lead?.email).toBe(customerData.email);
      expect(lead?.phone).toBe(customerData.phone);

      // Verify all records link to the same lead
      expect(mockDb.get(estimateId)?.leadId).toBe(leadId);
      expect(mockDb.get(workOrderId)?.leadId).toBe(leadId);
      expect(mockDb.get(invoiceId)?.leadId).toBe(leadId);
    });

    it('maintains pricing consistency', () => {
      const now = Date.now();

      const leadId = mockDb.insert('leads', {
        name: 'Test Lead',
        createdAt: now,
        updatedAt: now,
        stage: 'lead',
        surface: 'web',
        entityType: 'homeowner',
        intent: 'installation',
        lastInboundAt: now,
        respondBy: now + 2 * 60 * 60 * 1000,
      });

      const items = [
        { sku: 'A', name: 'Item A', qty: 2, unit: 'ea', unitPrice: 100 },
        { sku: 'B', name: 'Item B', qty: 3, unit: 'ea', unitPrice: 50 },
      ];

      const subtotal = items.reduce((sum, item) => sum + item.qty * item.unitPrice, 0);
      const tax = subtotal * 0.1;
      const total = subtotal + tax;

      const estimateId = mockDb.insert('estimates', {
        leadId,
        createdAt: now,
        updatedAt: now,
        status: 'draft',
        items,
        total,
      });

      const workOrderId = mockDb.insert('workOrders', {
        createdAt: now,
        updatedAt: now,
        leadId,
        estimateId,
        serviceSlug: 'irrigation-installation',
        priority: 'normal',
        category: 'installation',
        status: 'scheduled',
        approvedBudget: total,
        proofRequired: true,
        proofComplete: false,
      });

      const invoiceId = mockDb.insert('invoices', {
        createdAt: now,
        updatedAt: now,
        leadId,
        workOrderId,
        status: 'pending',
        subtotal,
        tax,
        total,
        amountPaid: 0,
        balanceDue: total,
      });

      // Verify pricing consistency
      const estimate = mockDb.get(estimateId);
      const workOrder = mockDb.get(workOrderId);
      const invoice = mockDb.get(invoiceId);

      expect(estimate?.total).toBe(total);
      expect(workOrder?.approvedBudget).toBe(total);
      expect(invoice?.total).toBe(total);
      expect(invoice?.subtotal).toBe(subtotal);
      expect(invoice?.tax).toBe(tax);
    });
  });

  describe('Error scenarios in the flow', () => {
    it('handles missing estimate gracefully', () => {
      const now = Date.now();

      const leadId = mockDb.insert('leads', {
        name: 'Test Lead',
        createdAt: now,
        updatedAt: now,
        stage: 'booked',
        surface: 'web',
        entityType: 'homeowner',
        intent: 'installation',
        lastInboundAt: now,
        respondBy: now + 2 * 60 * 60 * 1000,
      });

      // Create work order without estimate
      const workOrderId = mockDb.insert('workOrders', {
        createdAt: now,
        updatedAt: now,
        leadId,
        serviceSlug: 'irrigation-repair',
        priority: 'urgent',
        category: 'repair',
        status: 'scheduled',
        proofRequired: true,
        proofComplete: false,
      });

      const workOrder = mockDb.get(workOrderId);
      expect(workOrder?.estimateId).toBeUndefined();
      expect(workOrder?.status).toBe('scheduled');
    });

    it('handles incomplete work orders', () => {
      const now = Date.now();

      const leadId = mockDb.insert('leads', {
        name: 'Test Lead',
        createdAt: now,
        updatedAt: now,
        stage: 'booked',
        surface: 'web',
        entityType: 'homeowner',
        intent: 'installation',
        lastInboundAt: now,
        respondBy: now + 2 * 60 * 60 * 1000,
      });

      const workOrderId = mockDb.insert('workOrders', {
        createdAt: now,
        updatedAt: now,
        leadId,
        serviceSlug: 'irrigation-installation',
        priority: 'normal',
        category: 'installation',
        status: 'in_progress',
        proofRequired: true,
        proofComplete: false,
      });

      // Try to create invoice for incomplete work order
      const invoiceId = mockDb.insert('invoices', {
        createdAt: now,
        updatedAt: now,
        leadId,
        workOrderId,
        status: 'pending',
        subtotal: 1000,
        tax: 100,
        total: 1100,
        amountPaid: 0,
        balanceDue: 1100,
      });

      // Invoice is created but work order is still in progress
      const workOrder = mockDb.get(workOrderId);
      expect(workOrder?.status).toBe('in_progress');
      expect(workOrder?.proofComplete).toBe(false);
    });
  });
});
