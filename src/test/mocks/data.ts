// Mock Users
export const mockUsers = {
  admin: {
    _id: 'admin-user-id',
    name: 'Admin User',
    email: 'admin@eliteirrigation.com',
    role: 'admin',
    orgId: 'test-org-id',
    createdAt: new Date('2024-01-01'),
  },
  manager: {
    _id: 'manager-user-id',
    name: 'Manager User',
    email: 'manager@eliteirrigation.com',
    role: 'manager',
    orgId: 'test-org-id',
    createdAt: new Date('2024-01-01'),
  },
  foreman: {
    _id: 'foreman-user-id',
    name: 'Foreman User',
    email: 'foreman@eliteirrigation.com',
    role: 'foreman',
    orgId: 'test-org-id',
    createdAt: new Date('2024-01-01'),
  },
  tech: {
    _id: 'tech-user-id',
    name: 'Tech User',
    email: 'tech@eliteirrigation.com',
    role: 'technician',
    orgId: 'test-org-id',
    createdAt: new Date('2024-01-01'),
  },
};

// Mock Leads
export const mockLeads = [
  {
    _id: 'lead-1',
    name: 'John Smith',
    email: 'john.smith@example.com',
    phone: '(555) 123-4567',
    status: 'new',
    source: 'website',
    address: {
      street: '123 Main St',
      city: 'Anytown',
      state: 'CA',
      zip: '12345',
    },
    createdAt: new Date('2024-01-15'),
    estimatedValue: 5000,
    notes: 'Interested in irrigation system installation',
  },
  {
    _id: 'lead-2',
    name: 'Jane Doe',
    email: 'jane.doe@example.com',
    phone: '(555) 987-6543',
    status: 'contacted',
    source: 'referral',
    address: {
      street: '456 Oak Ave',
      city: 'Sometown',
      state: 'CA',
      zip: '67890',
    },
    createdAt: new Date('2024-01-20'),
    estimatedValue: 8500,
    notes: 'Referred by existing customer',
  },
];

// Mock Estimates
export const mockEstimates = [
  {
    _id: 'estimate-1',
    leadId: 'lead-1',
    estimateNumber: 'EST-2024-001',
    status: 'draft',
    items: [
      {
        description: 'Irrigation System Installation',
        quantity: 1,
        unitPrice: 4500,
        total: 4500,
      },
      {
        description: 'Site Preparation',
        quantity: 1,
        unitPrice: 500,
        total: 500,
      },
    ],
    subtotal: 5000,
    tax: 0,
    total: 5000,
    validUntil: new Date('2024-03-15'),
    createdAt: new Date('2024-02-01'),
  },
  {
    _id: 'estimate-2',
    leadId: 'lead-2',
    estimateNumber: 'EST-2024-002',
    status: 'sent',
    items: [
      {
        description: 'Landscape Design',
        quantity: 1,
        unitPrice: 3000,
        total: 3000,
      },
      {
        description: 'Planting Services',
        quantity: 1,
        unitPrice: 5500,
        total: 5500,
      },
    ],
    subtotal: 8500,
    tax: 0,
    total: 8500,
    validUntil: new Date('2024-03-20'),
    createdAt: new Date('2024-02-05'),
  },
];

// Mock Work Orders
export const mockWorkOrders = [
  {
    _id: 'wo-1',
    estimateId: 'estimate-1',
    workOrderNumber: 'WO-2024-001',
    status: 'scheduled',
    scheduledDate: new Date('2024-02-15'),
    assignedTo: ['tech-user-id'],
    location: {
      street: '123 Main St',
      city: 'Anytown',
      state: 'CA',
      zip: '12345',
    },
    tasks: [
      {
        id: 'task-1',
        description: 'Install irrigation system',
        completed: false,
      },
      {
        id: 'task-2',
        description: 'Test all zones',
        completed: false,
      },
    ],
    notes: 'Customer requested morning appointment',
    createdAt: new Date('2024-02-10'),
  },
  {
    _id: 'wo-2',
    estimateId: 'estimate-2',
    workOrderNumber: 'WO-2024-002',
    status: 'in-progress',
    scheduledDate: new Date('2024-02-20'),
    assignedTo: ['tech-user-id', 'foreman-user-id'],
    location: {
      street: '456 Oak Ave',
      city: 'Sometown',
      state: 'CA',
      zip: '67890',
    },
    tasks: [
      {
        id: 'task-1',
        description: 'Site preparation',
        completed: true,
      },
      {
        id: 'task-2',
        description: 'Plant installation',
        completed: false,
      },
    ],
    notes: '',
    createdAt: new Date('2024-02-15'),
  },
];

// Mock Invoices
export const mockInvoices = [
  {
    _id: 'invoice-1',
    estimateId: 'estimate-1',
    invoiceNumber: 'INV-2024-001',
    status: 'paid',
    amount: 5000,
    dueDate: new Date('2024-03-01'),
    paidDate: new Date('2024-02-28'),
    items: [
      {
        description: 'Irrigation System Installation',
        quantity: 1,
        unitPrice: 4500,
        total: 4500,
      },
      {
        description: 'Site Preparation',
        quantity: 1,
        unitPrice: 500,
        total: 500,
      },
    ],
    createdAt: new Date('2024-02-01'),
  },
  {
    _id: 'invoice-2',
    estimateId: 'estimate-2',
    invoiceNumber: 'INV-2024-002',
    status: 'pending',
    amount: 8500,
    dueDate: new Date('2024-03-15'),
    paidDate: null,
    items: [
      {
        description: 'Landscape Design',
        quantity: 1,
        unitPrice: 3000,
        total: 3000,
      },
      {
        description: 'Planting Services',
        quantity: 1,
        unitPrice: 5500,
        total: 5500,
      },
    ],
    createdAt: new Date('2024-02-05'),
  },
];

// Helper function to create mock lead
export function createMockLead(overrides = {}) {
  return {
    _id: `lead-${Date.now()}`,
    name: 'Test Lead',
    email: 'testlead@example.com',
    phone: '(555) 555-5555',
    status: 'new',
    source: 'website',
    address: {
      street: '123 Test St',
      city: 'Test City',
      state: 'CA',
      zip: '12345',
    },
    createdAt: new Date(),
    estimatedValue: 5000,
    notes: 'Test lead notes',
    ...overrides,
  };
}

// Helper function to create mock estimate
export function createMockEstimate(overrides = {}) {
  return {
    _id: `estimate-${Date.now()}`,
    leadId: 'test-lead-id',
    estimateNumber: 'EST-TEST-001',
    status: 'draft',
    items: [
      {
        description: 'Test Service',
        quantity: 1,
        unitPrice: 1000,
        total: 1000,
      },
    ],
    subtotal: 1000,
    tax: 0,
    total: 1000,
    validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    createdAt: new Date(),
    ...overrides,
  };
}

// Helper function to create mock work order
export function createMockWorkOrder(overrides = {}) {
  return {
    _id: `wo-${Date.now()}`,
    estimateId: 'test-estimate-id',
    workOrderNumber: 'WO-TEST-001',
    status: 'scheduled',
    scheduledDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    assignedTo: ['test-tech-id'],
    location: {
      street: '123 Test St',
      city: 'Test City',
      state: 'CA',
      zip: '12345',
    },
    tasks: [
      {
        id: 'task-1',
        description: 'Test task',
        completed: false,
      },
    ],
    notes: '',
    createdAt: new Date(),
    ...overrides,
  };
}

// Helper function to create mock invoice
export function createMockInvoice(overrides = {}) {
  return {
    _id: `invoice-${Date.now()}`,
    estimateId: 'test-estimate-id',
    invoiceNumber: 'INV-TEST-001',
    status: 'pending',
    amount: 1000,
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    paidDate: null,
    items: [
      {
        description: 'Test Service',
        quantity: 1,
        unitPrice: 1000,
        total: 1000,
      },
    ],
    createdAt: new Date(),
    ...overrides,
  };
}
