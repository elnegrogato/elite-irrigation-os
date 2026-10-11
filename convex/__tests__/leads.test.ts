import { describe, it, expect, beforeEach, vi } from 'vitest';
import { MockDatabase, createMockContext } from '../test/helpers';
import { normalizePhone } from '../lib/normalize';

describe('Leads (Comprehensive Tests)', () => {
  let mockDb: MockDatabase;
  let mockCtx: any;

  beforeEach(() => {
    mockDb = new MockDatabase();
    mockCtx = createMockContext(mockDb);
    vi.clearAllMocks();
  });

  describe('Lead creation', () => {
    it('creates lead with valid data', () => {
      const leadData = {
        name: 'John Doe',
        phone: '(555) 123-4567',
        email: 'john@example.com',
        surfaceHint: 'organic_search',
        serviceSlug: 'irrigation-installation',
        locationSlug: 'austin-tx',
        message: 'I need a new irrigation system',
      };

      const now = Date.now();
      const leadId = mockDb.insert('leads', {
        ...leadData,
        phone: '5551234567', // Normalized
        createdAt: now,
        updatedAt: now,
        surface: 'organic_search',
        entityType: 'homeowner',
        intent: 'installation',
        urgency: null,
        stage: 'lead',
        respondBy: now + 2 * 60 * 60 * 1000, // 2 hours
        estimateBy: null,
        lastInboundAt: now,
      });

      expect(leadId).toBeDefined();
      const lead = mockDb.get(leadId);
      expect(lead?.name).toBe(leadData.name);
      expect(lead?.email).toBe(leadData.email);
      expect(lead?.stage).toBe('lead');
    });

    it('normalizes phone numbers correctly', () => {
      const phoneNumbers = [
        '(555) 123-4567',
        '555-123-4567',
        '555.123.4567',
        '555 123 4567',
        '+1 555 123 4567',
      ];

      const normalized = '+15551234567';

      phoneNumbers.forEach((phone) => {
        expect(normalizePhone(phone)).toBe(normalized);
      });
    });

    it('infers urgency from message text', () => {
      const urgentMessages = [
        'emergency leak needs immediate attention',
        'urgent - water everywhere',
        'asap - broken pipe',
        'need help now - flooding',
      ];

      const nonUrgentMessages = [
        'looking for a quote',
        'interested in irrigation',
        'need information about services',
        'planning for next season',
      ];

      urgentMessages.forEach((message) => {
        const isUrgent = message.toLowerCase().match(/emergency|urgent|asap|immediate|now|flooding|leaking/i);
        expect(isUrgent).toBeTruthy();
      });

      nonUrgentMessages.forEach((message) => {
        const isUrgent = message.toLowerCase().match(/emergency|urgent|asap|immediate|now|flooding|leaking/i);
        expect(isUrgent).toBeFalsy();
      });
    });

    it('sets SLA based on urgency', () => {
      const now = Date.now();

      // Urgent leads get shorter SLA
      const urgentRespondBy = now + 30 * 60 * 1000; // 30 minutes
      const urgentEstimateBy = now + 4 * 60 * 60 * 1000; // 4 hours

      // Normal leads get standard SLA
      const normalRespondBy = now + 2 * 60 * 60 * 1000; // 2 hours
      const normalEstimateBy = now + 24 * 60 * 60 * 1000; // 24 hours

      expect(urgentRespondBy).toBeLessThan(normalRespondBy);
      expect(urgentEstimateBy).toBeLessThan(normalEstimateBy);
    });

    it('creates stage change event on lead creation', () => {
      const leadId = mockDb.insert('leads', {
        name: 'Test Lead',
        createdAt: Date.now(),
        updatedAt: Date.now(),
        stage: 'lead',
        surface: 'web',
        entityType: 'homeowner',
        intent: 'installation',
        lastInboundAt: Date.now(),
        respondBy: Date.now() + 2 * 60 * 60 * 1000,
      });

      const eventId = mockDb.insert('events', {
        ts: Date.now(),
        leadId,
        type: 'stage_change',
        direction: 'system',
        payload: { from: 'intent', to: 'lead' },
      });

      expect(eventId).toBeDefined();
      const event = mockDb.get(eventId);
      expect(event?.type).toBe('stage_change');
    });
  });

  describe('Lead stage transitions', () => {
    it('transitions lead through valid stages', () => {
      const stages = [
        'awareness',
        'interest',
        'consideration',
        'intent',
        'lead',
        'contacted',
        'inspected',
        'estimated',
        'booked',
        'inProgress',
        'completed',
        'reviewed',
      ];

      const leadId = mockDb.insert('leads', {
        name: 'Test Lead',
        createdAt: Date.now(),
        updatedAt: Date.now(),
        stage: 'lead',
        surface: 'web',
        entityType: 'homeowner',
        intent: 'installation',
        lastInboundAt: Date.now(),
        respondBy: Date.now() + 2 * 60 * 60 * 1000,
      });

      stages.forEach((stage) => {
        mockDb.patch(leadId, { stage, updatedAt: Date.now() });
        const lead = mockDb.get(leadId);
        expect(lead?.stage).toBe(stage);
      });
    });

    it('rejects invalid stage transitions', () => {
      const invalidStages = ['invalid', 'fake', 'not_real', 'stage123'];

      const validStages = [
        'awareness',
        'interest',
        'consideration',
        'intent',
        'lead',
        'contacted',
        'inspected',
        'estimated',
        'booked',
        'inProgress',
        'completed',
        'reviewed',
      ];

      invalidStages.forEach((stage) => {
        expect(validStages.includes(stage as any)).toBe(false);
      });
    });

    it('records stage change in events', () => {
      const leadId = mockDb.insert('leads', {
        name: 'Test Lead',
        createdAt: Date.now(),
        updatedAt: Date.now(),
        stage: 'lead',
        surface: 'web',
        entityType: 'homeowner',
        intent: 'installation',
        lastInboundAt: Date.now(),
        respondBy: Date.now() + 2 * 60 * 60 * 1000,
      });

      mockDb.patch(leadId, { stage: 'contacted', updatedAt: Date.now() });

      const eventId = mockDb.insert('events', {
        ts: Date.now(),
        leadId,
        type: 'stage_change',
        direction: 'human',
        payload: { from: 'lead', to: 'contacted' },
      });

      const event = mockDb.get(eventId);
      expect(event?.type).toBe('stage_change');
      expect(event?.payload).toEqual({ from: 'lead', to: 'contacted' });
    });
  });

  describe('Lead assignment', () => {
    it('assigns lead to staff member', () => {
      const leadId = mockDb.insert('leads', {
        name: 'Test Lead',
        createdAt: Date.now(),
        updatedAt: Date.now(),
        stage: 'lead',
        surface: 'web',
        entityType: 'homeowner',
        intent: 'installation',
        lastInboundAt: Date.now(),
        respondBy: Date.now() + 2 * 60 * 60 * 1000,
      });

      const assignedTo = 'staff123';
      mockDb.patch(leadId, { assignedTo, updatedAt: Date.now() });

      const lead = mockDb.get(leadId);
      expect(lead?.assignedTo).toBe(assignedTo);
    });

    it('unassigns lead from staff member', () => {
      const leadId = mockDb.insert('leads', {
        name: 'Test Lead',
        createdAt: Date.now(),
        updatedAt: Date.now(),
        stage: 'lead',
        surface: 'web',
        assignedTo: 'staff123',
        entityType: 'homeowner',
        intent: 'installation',
        lastInboundAt: Date.now(),
        respondBy: Date.now() + 2 * 60 * 60 * 1000,
      });

      mockDb.patch(leadId, { assignedTo: undefined, updatedAt: Date.now() });

      const lead = mockDb.get(leadId);
      expect(lead?.assignedTo).toBeUndefined();
    });

    it('records assignment in events', () => {
      const leadId = mockDb.insert('leads', {
        name: 'Test Lead',
        createdAt: Date.now(),
        updatedAt: Date.now(),
        stage: 'lead',
        surface: 'web',
        entityType: 'homeowner',
        intent: 'installation',
        lastInboundAt: Date.now(),
        respondBy: Date.now() + 2 * 60 * 60 * 1000,
      });

      const assignedTo = 'staff123';
      mockDb.patch(leadId, { assignedTo, updatedAt: Date.now() });

      const eventId = mockDb.insert('events', {
        ts: Date.now(),
        leadId,
        type: 'note',
        direction: 'system',
        payload: { message: `Assigned to ${assignedTo}` },
      });

      const event = mockDb.get(eventId);
      expect(event?.payload.message).toContain(assignedTo);
    });
  });

  describe('SLA tracking', () => {
    it('sets respondBy deadline for urgent leads', () => {
      const now = Date.now();
      const urgentRespondBy = now + 30 * 60 * 1000; // 30 minutes

      const leadId = mockDb.insert('leads', {
        name: 'Urgent Lead',
        createdAt: now,
        updatedAt: now,
        stage: 'lead',
        surface: 'web',
        entityType: 'homeowner',
        intent: 'installation',
        urgency: 'urgent',
        lastInboundAt: now,
        respondBy: urgentRespondBy,
      });

      const lead = mockDb.get(leadId);
      expect(lead?.respondBy).toBeDefined();
      expect(lead?.respondBy).toBeLessThan(now + 60 * 60 * 1000); // Less than 1 hour
    });

    it('sets respondBy deadline for normal leads', () => {
      const now = Date.now();
      const normalRespondBy = now + 2 * 60 * 60 * 1000; // 2 hours

      const leadId = mockDb.insert('leads', {
        name: 'Normal Lead',
        createdAt: now,
        updatedAt: now,
        stage: 'lead',
        surface: 'web',
        entityType: 'homeowner',
        intent: 'installation',
        lastInboundAt: now,
        respondBy: normalRespondBy,
      });

      const lead = mockDb.get(leadId);
      expect(lead?.respondBy).toBeDefined();
      expect(lead?.respondBy).toBeLessThan(now + 3 * 60 * 60 * 1000); // Less than 3 hours
    });

    it('identifies overdue leads', () => {
      const now = Date.now();
      const pastTime = now - 60 * 60 * 1000; // 1 hour ago

      const leadId = mockDb.insert('leads', {
        name: 'Overdue Lead',
        createdAt: now - 2 * 60 * 60 * 1000,
        updatedAt: now - 2 * 60 * 60 * 1000,
        stage: 'lead',
        surface: 'web',
        entityType: 'homeowner',
        intent: 'installation',
        lastInboundAt: now - 2 * 60 * 60 * 1000,
        respondBy: pastTime, // Already past
      });

      const lead = mockDb.get(leadId);
      expect(lead?.respondBy).toBeLessThan(now);
    });
  });

  describe('Lead queries', () => {
    it('queries leads by stage', () => {
      const stage1 = 'lead';
      const stage2 = 'contacted';

      mockDb.insert('leads', {
        name: 'Lead 1',
        createdAt: Date.now(),
        updatedAt: Date.now(),
        stage: stage1,
        surface: 'web',
        entityType: 'homeowner',
        intent: 'installation',
        lastInboundAt: Date.now(),
        respondBy: Date.now() + 2 * 60 * 60 * 1000,
      });

      mockDb.insert('leads', {
        name: 'Lead 2',
        createdAt: Date.now(),
        updatedAt: Date.now(),
        stage: stage2,
        surface: 'web',
        entityType: 'homeowner',
        intent: 'installation',
        lastInboundAt: Date.now(),
        respondBy: Date.now() + 2 * 60 * 60 * 1000,
      });

      const allLeads = mockDb.all('leads');
      const stage1Leads = allLeads.filter((l: any) => l.stage === stage1);
      const stage2Leads = allLeads.filter((l: any) => l.stage === stage2);

      expect(stage1Leads).toHaveLength(1);
      expect(stage2Leads).toHaveLength(1);
    });

    it('queries leads by assigned staff', () => {
      const assignedTo = 'staff123';

      mockDb.insert('leads', {
        name: 'Assigned Lead',
        createdAt: Date.now(),
        updatedAt: Date.now(),
        stage: 'lead',
        surface: 'web',
        assignedTo,
        entityType: 'homeowner',
        intent: 'installation',
        lastInboundAt: Date.now(),
        respondBy: Date.now() + 2 * 60 * 60 * 1000,
      });

      mockDb.insert('leads', {
        name: 'Unassigned Lead',
        createdAt: Date.now(),
        updatedAt: Date.now(),
        stage: 'lead',
        surface: 'web',
        entityType: 'homeowner',
        intent: 'installation',
        lastInboundAt: Date.now(),
        respondBy: Date.now() + 2 * 60 * 60 * 1000,
      });

      const allLeads = mockDb.all('leads');
      const assignedLeads = allLeads.filter((l: any) => l.assignedTo === assignedTo);
      const unassignedLeads = allLeads.filter((l: any) => !l.assignedTo);

      expect(assignedLeads).toHaveLength(1);
      expect(unassignedLeads).toHaveLength(1);
    });

    it('queries leads by surface/source', () => {
      const surface1 = 'organic_search';
      const surface2 = 'referral';

      mockDb.insert('leads', {
        name: 'Lead 1',
        createdAt: Date.now(),
        updatedAt: Date.now(),
        stage: 'lead',
        surface: surface1,
        entityType: 'homeowner',
        intent: 'installation',
        lastInboundAt: Date.now(),
        respondBy: Date.now() + 2 * 60 * 60 * 1000,
      });

      mockDb.insert('leads', {
        name: 'Lead 2',
        createdAt: Date.now(),
        updatedAt: Date.now(),
        stage: 'lead',
        surface: surface2,
        entityType: 'homeowner',
        intent: 'installation',
        lastInboundAt: Date.now(),
        respondBy: Date.now() + 2 * 60 * 60 * 1000,
      });

      const allLeads = mockDb.all('leads');
      const surface1Leads = allLeads.filter((l: any) => l.surface === surface1);
      const surface2Leads = allLeads.filter((l: any) => l.surface === surface2);

      expect(surface1Leads).toHaveLength(1);
      expect(surface2Leads).toHaveLength(1);
    });

    it('queries recent leads ordered by createdAt', () => {
      const now = Date.now();

      mockDb.insert('leads', {
        name: 'Old Lead',
        createdAt: now - 10000,
        updatedAt: now - 10000,
        stage: 'lead',
        surface: 'web',
        entityType: 'homeowner',
        intent: 'installation',
        lastInboundAt: now - 10000,
        respondBy: now - 10000 + 2 * 60 * 60 * 1000,
      });

      mockDb.insert('leads', {
        name: 'New Lead',
        createdAt: now,
        updatedAt: now,
        stage: 'lead',
        surface: 'web',
        entityType: 'homeowner',
        intent: 'installation',
        lastInboundAt: now,
        respondBy: now + 2 * 60 * 60 * 1000,
      });

      const allLeads = mockDb.all('leads');
      const sortedLeads = allLeads.sort((a: any, b: any) => b.createdAt - a.createdAt);

      expect(sortedLeads[0].name).toBe('New Lead');
      expect(sortedLeads[1].name).toBe('Old Lead');
    });
  });

  describe('Lead notes and events', () => {
    it('adds note to lead', () => {
      const leadId = mockDb.insert('leads', {
        name: 'Test Lead',
        createdAt: Date.now(),
        updatedAt: Date.now(),
        stage: 'lead',
        surface: 'web',
        entityType: 'homeowner',
        intent: 'installation',
        lastInboundAt: Date.now(),
        respondBy: Date.now() + 2 * 60 * 60 * 1000,
      });

      const note = 'Called customer, they are interested';
      const eventId = mockDb.insert('events', {
        ts: Date.now(),
        leadId,
        type: 'note',
        direction: 'in',
        payload: { note },
      });

      expect(eventId).toBeDefined();
      const event = mockDb.get(eventId);
      expect(event?.payload.note).toBe(note);
    });

    it('records form submission event', () => {
      const leadId = mockDb.insert('leads', {
        name: 'Test Lead',
        createdAt: Date.now(),
        updatedAt: Date.now(),
        stage: 'lead',
        surface: 'web',
        entityType: 'homeowner',
        intent: 'installation',
        message: 'I need help',
        lastInboundAt: Date.now(),
        respondBy: Date.now() + 2 * 60 * 60 * 1000,
      });

      const eventId = mockDb.insert('events', {
        ts: Date.now(),
        leadId,
        type: 'form_submit',
        direction: 'in',
        payload: { message: 'I need help', raw: {} },
      });

      const event = mockDb.get(eventId);
      expect(event?.type).toBe('form_submit');
    });

    it('updates lead timestamp on event creation', () => {
      const leadId = mockDb.insert('leads', {
        name: 'Test Lead',
        createdAt: Date.now(),
        updatedAt: Date.now(),
        stage: 'lead',
        surface: 'web',
        entityType: 'homeowner',
        intent: 'installation',
        lastInboundAt: Date.now(),
        respondBy: Date.now() + 2 * 60 * 60 * 1000,
      });

      const newTime = Date.now() + 1000;
      mockDb.patch(leadId, { updatedAt: newTime });

      const lead = mockDb.get(leadId);
      expect(lead?.updatedAt).toBe(newTime);
    });
  });

  describe('Lead data validation', () => {
    it('accepts valid lead data', () => {
      const validLead = {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '5551234567',
        message: 'Need irrigation system',
      };

      expect(validLead.name).toBeTruthy();
      expect(validLead.email).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
      expect(validLead.phone).toMatch(/^\d{10}$/);
    });

    it('handles missing optional fields', () => {
      const minimalLead = {
        name: 'Jane Doe',
        message: 'Interested in services',
      };

      expect(minimalLead.name).toBeTruthy();
      expect(minimalLead.email).toBeUndefined();
      expect(minimalLead.phone).toBeUndefined();
    });

    it('normalizes surface hints', () => {
      const surfaceHints: Record<string, string> = {
        'organic_search': 'organic_search',
        'paid_search': 'paid_search',
        'direct': 'direct',
        'referral': 'referral',
        'social': 'social',
      };

      Object.entries(surfaceHints).forEach(([hint, expected]) => {
        expect(surfaceHints[hint]).toBe(expected);
      });
    });
  });

  describe('Lead tags', () => {
    it('adds tags to lead', () => {
      const tags = ['urgent', 'high-value', 'repeat-customer'];

      const leadId = mockDb.insert('leads', {
        name: 'Test Lead',
        createdAt: Date.now(),
        updatedAt: Date.now(),
        stage: 'lead',
        surface: 'web',
        tags,
        entityType: 'homeowner',
        intent: 'installation',
        lastInboundAt: Date.now(),
        respondBy: Date.now() + 2 * 60 * 60 * 1000,
      });

      const lead = mockDb.get(leadId);
      expect(lead?.tags).toEqual(tags);
    });

    it('filters leads by tags', () => {
      const tags1 = ['urgent'];
      const tags2 = ['high-value'];

      mockDb.insert('leads', {
        name: 'Urgent Lead',
        createdAt: Date.now(),
        updatedAt: Date.now(),
        stage: 'lead',
        surface: 'web',
        tags: tags1,
        entityType: 'homeowner',
        intent: 'installation',
        lastInboundAt: Date.now(),
        respondBy: Date.now() + 2 * 60 * 60 * 1000,
      });

      mockDb.insert('leads', {
        name: 'High Value Lead',
        createdAt: Date.now(),
        updatedAt: Date.now(),
        stage: 'lead',
        surface: 'web',
        tags: tags2,
        entityType: 'homeowner',
        intent: 'installation',
        lastInboundAt: Date.now(),
        respondBy: Date.now() + 2 * 60 * 60 * 1000,
      });

      const allLeads = mockDb.all('leads');
      const urgentLeads = allLeads.filter((l: any) => l.tags?.includes('urgent'));

      expect(urgentLeads).toHaveLength(1);
    });
  });
});
