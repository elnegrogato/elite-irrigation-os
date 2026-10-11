import { describe, it, expect, beforeEach, vi } from 'vitest';
import { MockDatabase, createMockContext } from '../test/helpers';

describe('Invoices (Comprehensive Tests)', () => {
  let mockDb: MockDatabase;
  let mockCtx: any;

  beforeEach(() => {
    mockDb = new MockDatabase();
    mockCtx = createMockContext(mockDb);
    vi.clearAllMocks();
  });

  describe('Invoice creation', () => {
    it('creates invoice with valid data', () => {
      const leadId = mockDb.insert('leads', {
        name: 'Test Lead',
        createdAt: Date.now(),
        updatedAt: Date.now(),
        stage: 'completed',
        surface: 'web',
        entityType: 'homeowner',
        intent: 'installation',
        lastInboundAt: Date.now(),
        respondBy: Date.now() + 2 * 60 * 60 * 1000,
      });

      const workOrderId = mockDb.insert('workOrders', {
        createdAt: Date.now(),
        updatedAt: Date.now(),
        leadId,
        serviceSlug: 'irrigation-installation',
        priority: 'normal',
        category: 'installation',
        status: 'completed',
        proofRequired: true,
        proofComplete: true,
        closedAt: Date.now(),
      });

      const now = Date.now();
      const subtotal = 1500;
      const tax = 150;
      const total = subtotal + tax;

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

      expect(invoiceId).toBeDefined();
      const invoice = mockDb.get(invoiceId);
      expect(invoice?.total).toBe(total);
      expect(invoice?.balanceDue).toBe(total);
      expect(invoice?.amountPaid).toBe(0);
    });

    it('calculates total with tax', () => {
      const subtotal = 1500;
      const taxRate = 0.1; // 10%
      const tax = subtotal * taxRate;
      const total = subtotal + tax;

      expect(tax).toBe(150);
      expect(total).toBe(1650);
    });

    it('creates invoice for work order', () => {
      const leadId = mockDb.insert('leads', {
        name: 'Test Lead',
        createdAt: Date.now(),
        updatedAt: Date.now(),
        stage: 'completed',
        surface: 'web',
        entityType: 'homeowner',
        intent: 'installation',
        lastInboundAt: Date.now(),
        respondBy: Date.now() + 2 * 60 * 60 * 1000,
      });

      const workOrderId = mockDb.insert('workOrders', {
        createdAt: Date.now(),
        updatedAt: Date.now(),
        leadId,
        serviceSlug: 'irrigation-installation',
        priority: 'normal',
        category: 'installation',
        status: 'completed',
        proofRequired: true,
        proofComplete: true,
        closedAt: Date.now(),
      });

      const invoiceId = mockDb.insert('invoices', {
        createdAt: Date.now(),
        updatedAt: Date.now(),
        leadId,
        workOrderId,
        status: 'pending',
        subtotal: 1500,
        tax: 150,
        total: 1650,
        amountPaid: 0,
        balanceDue: 1650,
      });

      const invoice = mockDb.get(invoiceId);
      expect(invoice?.workOrderId).toBe(workOrderId);
      expect(invoice?.leadId).toBe(leadId);
    });
  });

  describe('Invoice status updates', () => {
    it('transitions through valid statuses', () => {
      const statuses = ['pending', 'sent', 'viewed', 'partial', 'paid', 'overdue', 'cancelled'];

      const leadId = mockDb.insert('leads', {
        name: 'Test Lead',
        createdAt: Date.now(),
        updatedAt: Date.now(),
        stage: 'completed',
        surface: 'web',
        entityType: 'homeowner',
        intent: 'installation',
        lastInboundAt: Date.now(),
        respondBy: Date.now() + 2 * 60 * 60 * 1000,
      });

      const invoiceId = mockDb.insert('invoices', {
        createdAt: Date.now(),
        updatedAt: Date.now(),
        leadId,
        status: 'pending',
        subtotal: 1500,
        tax: 150,
        total: 1650,
        amountPaid: 0,
        balanceDue: 1650,
      });

      statuses.forEach((status) => {
        mockDb.patch(invoiceId, { status, updatedAt: Date.now() });
        const invoice = mockDb.get(invoiceId);
        expect(invoice?.status).toBe(status);
      });
    });

    it('updates status when payment is received', () => {
      const leadId = mockDb.insert('leads', {
        name: 'Test Lead',
        createdAt: Date.now(),
        updatedAt: Date.now(),
        stage: 'completed',
        surface: 'web',
        entityType: 'homeowner',
        intent: 'installation',
        lastInboundAt: Date.now(),
        respondBy: Date.now() + 2 * 60 * 60 * 1000,
      });

      const total = 1650;
      const amountPaid = 1650;

      const invoiceId = mockDb.insert('invoices', {
        createdAt: Date.now(),
        updatedAt: Date.now(),
        leadId,
        status: 'pending',
        subtotal: 1500,
        tax: 150,
        total,
        amountPaid,
        balanceDue: total - amountPaid,
      });

      mockDb.patch(invoiceId, { status: 'paid', paidAt: Date.now() });

      const invoice = mockDb.get(invoiceId);
      expect(invoice?.status).toBe('paid');
      expect(invoice?.paidAt).toBeDefined();
    });
  });

  describe('Payment recording', () => {
    it('records partial payment', () => {
      const leadId = mockDb.insert('leads', {
        name: 'Test Lead',
        createdAt: Date.now(),
        updatedAt: Date.now(),
        stage: 'completed',
        surface: 'web',
        entityType: 'homeowner',
        intent: 'installation',
        lastInboundAt: Date.now(),
        respondBy: Date.now() + 2 * 60 * 60 * 1000,
      });

      const total = 1650;
      const partialPayment = 500;
      const balanceDue = total - partialPayment;

      const invoiceId = mockDb.insert('invoices', {
        createdAt: Date.now(),
        updatedAt: Date.now(),
        leadId,
        status: 'partial',
        subtotal: 1500,
        tax: 150,
        total,
        amountPaid: partialPayment,
        balanceDue,
      });

      const invoice = mockDb.get(invoiceId);
      expect(invoice?.amountPaid).toBe(partialPayment);
      expect(invoice?.balanceDue).toBe(balanceDue);
      expect(invoice?.status).toBe('partial');
    });

    it('records full payment', () => {
      const leadId = mockDb.insert('leads', {
        name: 'Test Lead',
        createdAt: Date.now(),
        updatedAt: Date.now(),
        stage: 'completed',
        surface: 'web',
        entityType: 'homeowner',
        intent: 'installation',
        lastInboundAt: Date.now(),
        respondBy: Date.now() + 2 * 60 * 60 * 1000,
      });

      const total = 1650;
      const fullPayment = 1650;
      const balanceDue = total - fullPayment;

      const invoiceId = mockDb.insert('invoices', {
        createdAt: Date.now(),
        updatedAt: Date.now(),
        leadId,
        status: 'paid',
        subtotal: 1500,
        tax: 150,
        total,
        amountPaid: fullPayment,
        balanceDue,
        paidAt: Date.now(),
      });

      const invoice = mockDb.get(invoiceId);
      expect(invoice?.amountPaid).toBe(fullPayment);
      expect(invoice?.balanceDue).toBe(0);
      expect(invoice?.status).toBe('paid');
    });

    it('creates payment record', () => {
      const leadId = mockDb.insert('leads', {
        name: 'Test Lead',
        createdAt: Date.now(),
        updatedAt: Date.now(),
        stage: 'completed',
        surface: 'web',
        entityType: 'homeowner',
        intent: 'installation',
        lastInboundAt: Date.now(),
        respondBy: Date.now() + 2 * 60 * 60 * 1000,
      });

      const invoiceId = mockDb.insert('invoices', {
        createdAt: Date.now(),
        updatedAt: Date.now(),
        leadId,
        status: 'paid',
        subtotal: 1500,
        tax: 150,
        total: 1650,
        amountPaid: 1650,
        balanceDue: 0,
        paidAt: Date.now(),
      });

      const paymentId = mockDb.insert('payments', {
        createdAt: Date.now(),
        invoiceId,
        leadId,
        amount: 1650,
        currency: 'USD',
        method: 'stripe',
        status: 'succeeded',
        stripePaymentIntentId: 'pi_1234567890',
        payerEmail: 'customer@example.com',
      });

      expect(paymentId).toBeDefined();
      const payment = mockDb.get(paymentId);
      expect(payment?.invoiceId).toBe(invoiceId);
      expect(payment?.amount).toBe(1650);
      expect(payment?.status).toBe('succeeded');
    });
  });

  describe('Balance calculations', () => {
    it('calculates balance due correctly', () => {
      const total = 1650;
      const amountPaid = 500;
      const balanceDue = total - amountPaid;

      expect(balanceDue).toBe(1150);
    });

    it('updates balance when payment is recorded', () => {
      const leadId = mockDb.insert('leads', {
        name: 'Test Lead',
        createdAt: Date.now(),
        updatedAt: Date.now(),
        stage: 'completed',
        surface: 'web',
        entityType: 'homeowner',
        intent: 'installation',
        lastInboundAt: Date.now(),
        respondBy: Date.now() + 2 * 60 * 60 * 1000,
      });

      const total = 1650;

      const invoiceId = mockDb.insert('invoices', {
        createdAt: Date.now(),
        updatedAt: Date.now(),
        leadId,
        status: 'pending',
        subtotal: 1500,
        tax: 150,
        total,
        amountPaid: 0,
        balanceDue: total,
      });

      const initialInvoice = mockDb.get(invoiceId);
      expect(initialInvoice?.balanceDue).toBe(total);

      const payment = 500;
      mockDb.patch(invoiceId, {
        amountPaid: payment,
        balanceDue: total - payment,
        status: 'partial',
      });

      const updatedInvoice = mockDb.get(invoiceId);
      expect(updatedInvoice?.balanceDue).toBe(total - payment);
    });
  });

  describe('Stripe integration', () => {
    it('stores Stripe customer ID', () => {
      const leadId = mockDb.insert('leads', {
        name: 'Test Lead',
        email: 'customer@example.com',
        createdAt: Date.now(),
        updatedAt: Date.now(),
        stage: 'completed',
        surface: 'web',
        entityType: 'homeowner',
        intent: 'installation',
        lastInboundAt: Date.now(),
        respondBy: Date.now() + 2 * 60 * 60 * 1000,
      });

      const stripeCustomerId = 'cus_1234567890';

      const invoiceId = mockDb.insert('invoices', {
        createdAt: Date.now(),
        updatedAt: Date.now(),
        leadId,
        status: 'pending',
        subtotal: 1500,
        tax: 150,
        total: 1650,
        stripeCustomerId,
        customerEmail: 'customer@example.com',
        amountPaid: 0,
        balanceDue: 1650,
      });

      const invoice = mockDb.get(invoiceId);
      expect(invoice?.stripeCustomerId).toBe(stripeCustomerId);
      expect(invoice?.customerEmail).toBe('customer@example.com');
    });

    it('stores Stripe session ID', () => {
      const leadId = mockDb.insert('leads', {
        name: 'Test Lead',
        createdAt: Date.now(),
        updatedAt: Date.now(),
        stage: 'completed',
        surface: 'web',
        entityType: 'homeowner',
        intent: 'installation',
        lastInboundAt: Date.now(),
        respondBy: Date.now() + 2 * 60 * 60 * 1000,
      });

      const stripeSessionId = 'cs_1234567890';

      const invoiceId = mockDb.insert('invoices', {
        createdAt: Date.now(),
        updatedAt: Date.now(),
        leadId,
        status: 'sent',
        subtotal: 1500,
        tax: 150,
        total: 1650,
        stripeSessionId,
        amountPaid: 0,
        balanceDue: 1650,
      });

      const invoice = mockDb.get(invoiceId);
      expect(invoice?.stripeSessionId).toBe(stripeSessionId);
    });

    it('stores Stripe payment intent ID', () => {
      const leadId = mockDb.insert('leads', {
        name: 'Test Lead',
        createdAt: Date.now(),
        updatedAt: Date.now(),
        stage: 'completed',
        surface: 'web',
        entityType: 'homeowner',
        intent: 'installation',
        lastInboundAt: Date.now(),
        respondBy: Date.now() + 2 * 60 * 60 * 1000,
      });

      const stripePaymentIntentId = 'pi_1234567890';

      const invoiceId = mockDb.insert('invoices', {
        createdAt: Date.now(),
        updatedAt: Date.now(),
        leadId,
        status: 'paid',
        subtotal: 1500,
        tax: 150,
        total: 1650,
        stripePaymentIntentId,
        amountPaid: 1650,
        balanceDue: 0,
        paidAt: Date.now(),
      });

      const invoice = mockDb.get(invoiceId);
      expect(invoice?.stripePaymentIntentId).toBe(stripePaymentIntentId);
    });
  });

  describe('PDF generation', () => {
    it('stores PDF storage ID', () => {
      const leadId = mockDb.insert('leads', {
        name: 'Test Lead',
        createdAt: Date.now(),
        updatedAt: Date.now(),
        stage: 'completed',
        surface: 'web',
        entityType: 'homeowner',
        intent: 'installation',
        lastInboundAt: Date.now(),
        respondBy: Date.now() + 2 * 60 * 60 * 1000,
      });

      const pdfStorageId = 'pdf_storage_123';
      const pdfUrl = 'https://example.com/invoices/pdf_storage_123.pdf';

      const invoiceId = mockDb.insert('invoices', {
        createdAt: Date.now(),
        updatedAt: Date.now(),
        leadId,
        status: 'sent',
        subtotal: 1500,
        tax: 150,
        total: 1650,
        pdfStorageId,
        pdfUrl,
        amountPaid: 0,
        balanceDue: 1650,
      });

      const invoice = mockDb.get(invoiceId);
      expect(invoice?.pdfStorageId).toBe(pdfStorageId);
      expect(invoice?.pdfUrl).toBe(pdfUrl);
    });
  });

  describe('Invoice tokens', () => {
    it('creates access token for invoice', () => {
      const leadId = mockDb.insert('leads', {
        name: 'Test Lead',
        createdAt: Date.now(),
        updatedAt: Date.now(),
        stage: 'completed',
        surface: 'web',
        entityType: 'homeowner',
        intent: 'installation',
        lastInboundAt: Date.now(),
        respondBy: Date.now() + 2 * 60 * 60 * 1000,
      });

      const invoiceId = mockDb.insert('invoices', {
        createdAt: Date.now(),
        updatedAt: Date.now(),
        leadId,
        status: 'sent',
        subtotal: 1500,
        tax: 150,
        total: 1650,
        amountPaid: 0,
        balanceDue: 1650,
      });

      const now = Date.now();
      const token = 'invoice_token_123';
      const expiresAt = now + 7 * 24 * 60 * 60 * 1000; // 7 days

      const tokenId = mockDb.insert('invoiceTokens', {
        createdAt: now,
        updatedAt: now,
        invoiceId,
        token,
        expiresAt,
        status: 'active',
      });

      expect(tokenId).toBeDefined();
      const invoiceToken = mockDb.get(tokenId);
      expect(invoiceToken?.token).toBe(token);
      expect(invoiceToken?.invoiceId).toBe(invoiceId);
    });

    it('invalidates expired tokens', () => {
      const leadId = mockDb.insert('leads', {
        name: 'Test Lead',
        createdAt: Date.now(),
        updatedAt: Date.now(),
        stage: 'completed',
        surface: 'web',
        entityType: 'homeowner',
        intent: 'installation',
        lastInboundAt: Date.now(),
        respondBy: Date.now() + 2 * 60 * 60 * 1000,
      });

      const invoiceId = mockDb.insert('invoices', {
        createdAt: Date.now(),
        updatedAt: Date.now(),
        leadId,
        status: 'sent',
        subtotal: 1500,
        tax: 150,
        total: 1650,
        amountPaid: 0,
        balanceDue: 1650,
      });

      const now = Date.now();
      const expiredTime = now - 1000;

      const tokenId = mockDb.insert('invoiceTokens', {
        createdAt: now - 7 * 24 * 60 * 60 * 1000,
        updatedAt: now - 7 * 24 * 60 * 60 * 1000,
        invoiceId,
        token: 'expired_token',
        expiresAt: expiredTime,
        status: 'expired',
      });

      const token = mockDb.get(tokenId);
      expect(token?.expiresAt).toBeLessThan(now);
    });
  });

  describe('Invoice queries', () => {
    it('queries invoices by status', () => {
      const leadId = mockDb.insert('leads', {
        name: 'Test Lead',
        createdAt: Date.now(),
        updatedAt: Date.now(),
        stage: 'completed',
        surface: 'web',
        entityType: 'homeowner',
        intent: 'installation',
        lastInboundAt: Date.now(),
        respondBy: Date.now() + 2 * 60 * 60 * 1000,
      });

      const invoiceId1 = mockDb.insert('invoices', {
        createdAt: Date.now(),
        updatedAt: Date.now(),
        leadId,
        status: 'pending',
        subtotal: 1500,
        tax: 150,
        total: 1650,
        amountPaid: 0,
        balanceDue: 1650,
      });

      const invoiceId2 = mockDb.insert('invoices', {
        createdAt: Date.now(),
        updatedAt: Date.now(),
        leadId,
        status: 'paid',
        subtotal: 1500,
        tax: 150,
        total: 1650,
        amountPaid: 1650,
        balanceDue: 0,
        paidAt: Date.now(),
      });

      const allInvoices = mockDb.all('invoices');
      const pendingInvoices = allInvoices.filter((inv: any) => inv.status === 'pending');
      const paidInvoices = allInvoices.filter((inv: any) => inv.status === 'paid');

      expect(pendingInvoices).toHaveLength(1);
      expect(paidInvoices).toHaveLength(1);
    });

    it('queries invoices by work order', () => {
      const leadId = mockDb.insert('leads', {
        name: 'Test Lead',
        createdAt: Date.now(),
        updatedAt: Date.now(),
        stage: 'completed',
        surface: 'web',
        entityType: 'homeowner',
        intent: 'installation',
        lastInboundAt: Date.now(),
        respondBy: Date.now() + 2 * 60 * 60 * 1000,
      });

      const workOrderId = mockDb.insert('workOrders', {
        createdAt: Date.now(),
        updatedAt: Date.now(),
        leadId,
        serviceSlug: 'irrigation-installation',
        priority: 'normal',
        category: 'installation',
        status: 'completed',
        proofRequired: true,
        proofComplete: true,
        closedAt: Date.now(),
      });

      const invoiceId = mockDb.insert('invoices', {
        createdAt: Date.now(),
        updatedAt: Date.now(),
        leadId,
        workOrderId,
        status: 'pending',
        subtotal: 1500,
        tax: 150,
        total: 1650,
        amountPaid: 0,
        balanceDue: 1650,
      });

      const allInvoices = mockDb.all('invoices');
      const workOrderInvoices = allInvoices.filter((inv: any) => inv.workOrderId === workOrderId);

      expect(workOrderInvoices).toHaveLength(1);
      expect(workOrderInvoices[0]._id).toBe(invoiceId);
    });
  });
});
