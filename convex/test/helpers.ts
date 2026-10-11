import { vi } from 'vitest';
import { AnyRouter } from 'convex/server';
import { DataModel } from '../_generated/dataModel';
import { FunctionCtx } from 'convex/server';

// Mock context for testing Convex functions
export function mockContext() {
  return {
    auth: {
      subject: {
        type: 'user' as const,
        subject: 'test-user-id',
      },
      tokenIdentifier: 'test-token',
    },
    db: {
      get: vi.fn(),
      query: vi.fn(),
      insert: vi.fn(),
      patch: vi.fn(),
      replace: vi.fn(),
      delete: vi.fn(),
    },
    scheduler: {
      registerEffect: vi.fn(),
      cancelEffect: vi.fn(),
    },
    runQuery: vi.fn(),
    storage: {
      generateUploadUrl: vi.fn(),
      getUrl: vi.fn(),
      delete: vi.fn(),
    },
  };
}

// Helper to test queries
export async function testQuery(
  queryFn: (ctx: any, args: any) => Promise<any>,
  args: any = {},
  mockData: any = null
) {
  const ctx = mockContext();

  if (mockData) {
    (ctx.db.query as any).mockReturnValue({
      withIndex: vi.fn().mockReturnValue({
        collect: vi.fn().mockResolvedValue(mockData),
        first: vi.fn().mockResolvedValue(mockData[0]),
        unique: vi.fn().mockResolvedValue(mockData),
        take: vi.fn().mockResolvedValue(mockData),
      }),
      collect: vi.fn().mockResolvedValue(mockData),
      first: vi.fn().mockResolvedValue(mockData[0]),
      unique: vi.fn().mockResolvedValue(mockData),
      take: vi.fn().mockResolvedValue(mockData),
    });
  }

  const result = await queryFn(ctx, args);
  return result;
}

// Helper to test mutations
export async function testMutation(
  mutationFn: (ctx: any, args: any) => Promise<any>,
  args: any = {}
) {
  const ctx = mockContext();
  const result = await mutationFn(ctx, args);
  return result;
}

// Mock database class for testing
export class MockDatabase {
  private data: Map<string, any[]> = new Map();
  private nextId = 1;

  constructor(initialData?: Record<string, any[]>) {
    if (initialData) {
      Object.entries(initialData).forEach(([table, records]) => {
        this.data.set(table, records);
      });
    }
  }

  get(id: string) {
    for (const [table, records] of this.data.entries()) {
      const record = records.find((r: any) => r._id === id);
      if (record) return record;
    }
    return null;
  }

  query(tableName: string) {
    const records = this.data.get(tableName) || [];
    return {
      withIndex: (indexName: string, indexValue?: any) => ({
        collect: () => Promise.resolve(records),
        first: () => Promise.resolve(records[0] || null),
        unique: () => Promise.resolve(records[0] || null),
        take: (n: number) => Promise.resolve(records.slice(0, n)),
      }),
      collect: () => Promise.resolve(records),
      first: () => Promise.resolve(records[0] || null),
      unique: () => Promise.resolve(records[0] || null),
      take: (n: number) => Promise.resolve(records.slice(0, n)),
    };
  }

  insert(tableName: string, doc: any) {
    const records = this.data.get(tableName) || [];
    const newRecord = { _id: `${tableName}-${this.nextId++}`, ...doc };
    records.push(newRecord);
    this.data.set(tableName, records);
    return newRecord._id;
  }

  patch(id: string, updates: any) {
    for (const [table, records] of this.data.entries()) {
      const index = records.findIndex((r: any) => r._id === id);
      if (index !== -1) {
        records[index] = { ...records[index], ...updates };
        this.data.set(table, records);
        return id;
      }
    }
    throw new Error(`Document with id ${id} not found`);
  }

  replace(id: string, doc: any) {
    for (const [table, records] of this.data.entries()) {
      const index = records.findIndex((r: any) => r._id === id);
      if (index !== -1) {
        records[index] = doc;
        this.data.set(table, records);
        return id;
      }
    }
    throw new Error(`Document with id ${id} not found`);
  }

  delete(id: string) {
    for (const [table, records] of this.data.entries()) {
      const index = records.findIndex((r: any) => r._id === id);
      if (index !== -1) {
        records.splice(index, 1);
        this.data.set(table, records);
        return;
      }
    }
    throw new Error(`Document with id ${id} not found`);
  }

  // Helper to seed data
  seed(tableName: string, records: any[]) {
    this.data.set(tableName, records);
  }

  // Helper to clear all data
  clear() {
    this.data.clear();
  }

  // Helper to get all records from a table
  all(tableName: string) {
    return this.data.get(tableName) || [];
  }
}

// Helper to create a mock Convex context with a real mock database
export function createMockContext(db?: MockDatabase) {
  return {
    auth: {
      subject: {
        type: 'user' as const,
        subject: 'test-user-id',
      },
      tokenIdentifier: 'test-token',
    },
    db: db || new MockDatabase(),
    scheduler: {
      registerEffect: vi.fn(),
      cancelEffect: vi.fn(),
    },
    runQuery: vi.fn(),
    storage: {
      generateUploadUrl: vi.fn().mockResolvedValue('https://mock-upload-url'),
      getUrl: vi.fn().mockResolvedValue('https://mock-storage-url'),
      delete: vi.fn(),
    },
  };
}

// Helper to run a query with a mock database
export async function runQueryWithMockDb(
  queryFn: (ctx: any, args: any) => Promise<any>,
  mockDb: MockDatabase,
  args: any = {}
) {
  const ctx = createMockContext(mockDb);
  return await queryFn(ctx, args);
}

// Helper to run a mutation with a mock database
export async function runMutationWithMockDb(
  mutationFn: (ctx: any, args: any) => Promise<any>,
  mockDb: MockDatabase,
  args: any = {}
) {
  const ctx = createMockContext(mockDb);
  return await mutationFn(ctx, args);
}
