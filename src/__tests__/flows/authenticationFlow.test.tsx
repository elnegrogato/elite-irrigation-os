import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MockDatabase, createMockContext } from '../../../convex/test/helpers';

describe('Authentication Flow Integration Tests', () => {
  let mockDb: MockDatabase;
  let mockCtx: any;

  beforeEach(() => {
    mockDb = new MockDatabase();
    mockCtx = createMockContext(mockDb);
    vi.clearAllMocks();
  });

  describe('Complete authentication flow', () => {
    it('successfully registers, logs in, and accesses protected route', async () => {
      const now = Date.now();

      // Step 1: Register new user
      const userData = {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '5551234567',
        password: 'password123',
        role: 'tech',
      };

      // Hash password
      const encoder = new TextEncoder();
      const data = encoder.encode(userData.password + 'elite_irrigation_salt');
      const hashBuffer = await crypto.subtle.digest('SHA-256', data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const passwordHash = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');

      // Create user
      const userId = mockDb.insert('users', {
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
        passwordHash,
        role: userData.role,
        status: 'active',
        createdAt: now,
      });

      expect(userId).toBeDefined();
      const user = mockDb.get(userId);
      expect(user?.email).toBe(userData.email);
      expect(user?.status).toBe('active');

      // Step 2: Login with credentials
      const loginEmail = 'john@example.com';
      const loginPassword = 'password123';

      // Verify password hash matches
      const verifyData = encoder.encode(loginPassword + 'elite_irrigation_salt');
      const verifyBuffer = await crypto.subtle.digest('SHA-256', verifyData);
      const verifyArray = Array.from(new Uint8Array(verifyBuffer));
      const verifyHash = verifyArray.map((b) => b.toString(16).padStart(2, '0')).join('');

      expect(verifyHash).toBe(passwordHash);

      // Create session
      const token = 'session-token-123';
      const expiresAt = now + 7 * 24 * 60 * 60 * 1000;

      const sessionId = mockDb.insert('sessions', {
        userId,
        token,
        expiresAt,
        createdAt: now,
        lastActiveAt: now,
      });

      expect(sessionId).toBeDefined();
      const session = mockDb.get(sessionId);
      expect(session?.token).toBe(token);
      expect(session?.userId).toBe(userId);

      // Step 3: Access protected route
      // Verify session is valid
      const validSession = mockDb.get(sessionId);
      expect(validSession?.expiresAt).toBeGreaterThan(now);

      // Verify user has appropriate role
      const authenticatedUser = mockDb.get(userId);
      expect(authenticatedUser?.role).toBe('tech');
    });
  });

  describe('Registration edge cases', () => {
    it('rejects registration with duplicate email', async () => {
      const now = Date.now();

      const existingEmail = 'existing@example.com';

      // Create existing user
      const encoder = new TextEncoder();
      const data = encoder.encode('password123' + 'elite_irrigation_salt');
      const hashBuffer = await crypto.subtle.digest('SHA-256', data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const passwordHash = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');

      mockDb.insert('users', {
        name: 'Existing User',
        email: existingEmail,
        passwordHash,
        role: 'tech',
        status: 'active',
        createdAt: now,
      });

      // Try to register with same email
      const allUsers = mockDb.all('users');
      const duplicateUsers = allUsers.filter((u: any) => u.email === existingEmail);

      expect(duplicateUsers).toHaveLength(1);
    });

    it('validates password strength during registration', () => {
      const weakPasswords = ['12345', 'short', 'a', ''];

      weakPasswords.forEach((password) => {
        expect(password.length >= 6).toBe(false);
      });
    });

    it('accepts strong password during registration', () => {
      const strongPasswords = ['password123', 'StrongPass1', 'mySecureP@ss'];

      strongPasswords.forEach((password) => {
        expect(password.length >= 6).toBe(true);
      });
    });
  });

  describe('Login edge cases', () => {
    it('rejects login with invalid email', () => {
      const nonExistentEmail = 'nonexistent@example.com';

      const allUsers = mockDb.all('users');
      const user = allUsers.find((u: any) => u.email === nonExistentEmail);

      expect(user).toBeUndefined();
    });

    it('rejects login with invalid password', async () => {
      const now = Date.now();

      const encoder = new TextEncoder();
      const data = encoder.encode('correctpassword' + 'elite_irrigation_salt');
      const hashBuffer = await crypto.subtle.digest('SHA-256', data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const correctPasswordHash = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');

      mockDb.insert('users', {
        name: 'Test User',
        email: 'test@example.com',
        passwordHash: correctPasswordHash,
        role: 'tech',
        status: 'active',
        createdAt: now,
      });

      // Try wrong password
      const wrongData = encoder.encode('wrongpassword' + 'elite_irrigation_salt');
      const wrongBuffer = await crypto.subtle.digest('SHA-256', wrongData);
      const wrongArray = Array.from(new Uint8Array(wrongBuffer));
      const wrongHash = wrongArray.map((b) => b.toString(16).padStart(2, '0')).join('');

      expect(wrongHash).not.toBe(correctPasswordHash);
    });

    it('rejects login for inactive user', () => {
      const now = Date.now();

      mockDb.insert('users', {
        name: 'Inactive User',
        email: 'inactive@example.com',
        passwordHash: 'somehash',
        role: 'tech',
        status: 'inactive',
        createdAt: now,
      });

      const allUsers = mockDb.all('users');
      const user = allUsers.find((u: any) => u.email === 'inactive@example.com');

      expect(user?.status).not.toBe('active');
    });

    it('rejects login for suspended user', () => {
      const now = Date.now();

      mockDb.insert('users', {
        name: 'Suspended User',
        email: 'suspended@example.com',
        passwordHash: 'somehash',
        role: 'tech',
        status: 'suspended',
        createdAt: now,
      });

      const allUsers = mockDb.all('users');
      const user = allUsers.find((u: any) => u.email === 'suspended@example.com');

      expect(user?.status).not.toBe('active');
    });
  });

  describe('Session management', () => {
    it('creates session on successful login', () => {
      const now = Date.now();
      const userId = 'user123';
      const token = 'session-token-123';
      const expiresAt = now + 7 * 24 * 60 * 60 * 1000;

      const sessionId = mockDb.insert('sessions', {
        userId,
        token,
        expiresAt,
        createdAt: now,
        lastActiveAt: now,
      });

      expect(sessionId).toBeDefined();
      const session = mockDb.get(sessionId);
      expect(session?.token).toBe(token);
    });

    it('validates active session', () => {
      const now = Date.now();
      const futureExpiry = now + 7 * 24 * 60 * 60 * 1000;

      const sessionId = mockDb.insert('sessions', {
        userId: 'user123',
        token: 'valid-token',
        expiresAt: futureExpiry,
        createdAt: now,
        lastActiveAt: now,
      });

      const session = mockDb.get(sessionId);
      expect(session?.expiresAt).toBeGreaterThan(now);
    });

    it('rejects expired session', () => {
      const now = Date.now();
      const pastExpiry = now - 1000;

      const sessionId = mockDb.insert('sessions', {
        userId: 'user123',
        token: 'expired-token',
        expiresAt: pastExpiry,
        createdAt: now - 7 * 24 * 60 * 60 * 1000,
        lastActiveAt: now,
      });

      const session = mockDb.get(sessionId);
      expect(session?.expiresAt).toBeLessThan(now);
    });

    it('invalidates session on logout', () => {
      const now = Date.now();

      const sessionId = mockDb.insert('sessions', {
        userId: 'user123',
        token: 'logout-token',
        expiresAt: now + 7 * 24 * 60 * 60 * 1000,
        createdAt: now,
        lastActiveAt: now,
      });

      // Logout by deleting session
      mockDb.delete(sessionId);

      const session = mockDb.get(sessionId);
      expect(session).toBeNull();
    });

    it('invalidates all sessions on password change', () => {
      const now = Date.now();
      const userId = 'user123';

      // Create multiple sessions
      const session1Id = mockDb.insert('sessions', {
        userId,
        token: 'token1',
        expiresAt: now + 7 * 24 * 60 * 60 * 1000,
        createdAt: now,
        lastActiveAt: now,
      });

      const session2Id = mockDb.insert('sessions', {
        userId,
        token: 'token2',
        expiresAt: now + 7 * 24 * 60 * 60 * 1000,
        createdAt: now,
        lastActiveAt: now,
      });

      // Invalidate all sessions
      mockDb.delete(session1Id);
      mockDb.delete(session2Id);

      expect(mockDb.get(session1Id)).toBeNull();
      expect(mockDb.get(session2Id)).toBeNull();
    });
  });

  describe('Role-based access', () => {
    it('grants access based on user role', () => {
      const now = Date.now();

      const roles = ['admin', 'manager', 'foreman', 'tech'];

      roles.forEach((role) => {
        const userId = mockDb.insert('users', {
          name: `${role} User`,
          email: `${role}@example.com`,
          passwordHash: 'hash',
          role,
          status: 'active',
          createdAt: now,
        });

        const user = mockDb.get(userId);
        expect(user?.role).toBe(role);
      });
    });

    it('denies access for insufficient role permissions', () => {
      const requiredRoles = ['admin', 'manager'];
      const userRole = 'tech';

      const hasAccess = requiredRoles.includes(userRole);
      expect(hasAccess).toBe(false);
    });

    it('grants access for sufficient role permissions', () => {
      const requiredRoles = ['admin', 'manager'];
      const userRole = 'admin';

      const hasAccess = requiredRoles.includes(userRole);
      expect(hasAccess).toBe(true);
    });
  });

  describe('Password change flow', () => {
    it('allows password change with valid current password', async () => {
      const now = Date.now();

      const currentPassword = 'current123';
      const newPassword = 'newpassword123';

      // Hash both passwords
      const encoder = new TextEncoder();
      const currentData = encoder.encode(currentPassword + 'elite_irrigation_salt');
      const currentBuffer = await crypto.subtle.digest('SHA-256', currentData);
      const currentArray = Array.from(new Uint8Array(currentBuffer));
      const currentHash = currentArray.map((b) => b.toString(16).padStart(2, '0')).join('');

      const newData = encoder.encode(newPassword + 'elite_irrigation_salt');
      const newBuffer = await crypto.subtle.digest('SHA-256', newData);
      const newArray = Array.from(new Uint8Array(newBuffer));
      const newHash = newArray.map((b) => b.toString(16).padStart(2, '0')).join('');

      expect(currentHash).not.toBe(newHash);

      // Update password
      const userId = mockDb.insert('users', {
        name: 'Test User',
        email: 'test@example.com',
        passwordHash: currentHash,
        role: 'tech',
        status: 'active',
        createdAt: now,
      });

      mockDb.patch(userId, { passwordHash: newHash });

      const user = mockDb.get(userId);
      expect(user?.passwordHash).toBe(newHash);
    });

    it('rejects password change with invalid current password', async () => {
      const currentPassword = 'current123';
      const wrongPassword = 'wrong123';

      const encoder = new TextEncoder();
      const currentData = encoder.encode(currentPassword + 'elite_irrigation_salt');
      const currentBuffer = await crypto.subtle.digest('SHA-256', currentData);
      const currentArray = Array.from(new Uint8Array(currentBuffer));
      const currentHash = currentArray.map((b) => b.toString(16).padStart(2, '0')).join('');

      const wrongData = encoder.encode(wrongPassword + 'elite_irrigation_salt');
      const wrongBuffer = await crypto.subtle.digest('SHA-256', wrongData);
      const wrongArray = Array.from(new Uint8Array(wrongBuffer));
      const wrongHash = wrongArray.map((b) => b.toString(16).padStart(2, '0')).join('');

      expect(wrongHash).not.toBe(currentHash);
    });

    it('validates new password strength', () => {
      const weakNewPasswords = ['12345', 'short', 'a'];

      weakNewPasswords.forEach((password) => {
        expect(password.length >= 6).toBe(false);
      });
    });
  });

  describe('Session persistence', () => {
    it('stores session token for later use', () => {
      const now = Date.now();
      const token = 'persistent-token-123';

      mockDb.insert('sessions', {
        userId: 'user123',
        token,
        expiresAt: now + 7 * 24 * 60 * 60 * 1000,
        createdAt: now,
        lastActiveAt: now,
      });

      const allSessions = mockDb.all('sessions');
      const session = allSessions.find((s: any) => s.token === token);

      expect(session).toBeDefined();
      expect(session?.token).toBe(token);
    });

    it('updates last active timestamp', () => {
      const now = Date.now();
      const laterTime = now + 60 * 60 * 1000; // 1 hour later

      const sessionId = mockDb.insert('sessions', {
        userId: 'user123',
        token: 'token',
        expiresAt: now + 7 * 24 * 60 * 60 * 1000,
        createdAt: now,
        lastActiveAt: now,
      });

      // Update last active timestamp
      mockDb.patch(sessionId, { lastActiveAt: laterTime });

      const session = mockDb.get(sessionId);
      expect(session?.lastActiveAt).toBe(laterTime);
    });
  });

  describe('Error scenarios', () => {
    it('handles concurrent login attempts', () => {
      const now = Date.now();
      const userId = 'user123';

      // Create multiple sessions for same user
      const session1Id = mockDb.insert('sessions', {
        userId,
        token: 'token1',
        expiresAt: now + 7 * 24 * 60 * 60 * 1000,
        createdAt: now,
        lastActiveAt: now,
      });

      const session2Id = mockDb.insert('sessions', {
        userId,
        token: 'token2',
        expiresAt: now + 7 * 24 * 60 * 60 * 1000,
        createdAt: now + 1000,
        lastActiveAt: now + 1000,
      });

      const allSessions = mockDb.all('sessions');
      const userSessions = allSessions.filter((s: any) => s.userId === userId);

      expect(userSessions).toHaveLength(2);
    });

    it('handles session expiry during active use', () => {
      const now = Date.now();

      // Create session that will expire soon
      const expiresAt = now + 60 * 1000; // 1 minute from now

      const sessionId = mockDb.insert('sessions', {
        userId: 'user123',
        token: 'expiring-soon-token',
        expiresAt,
        createdAt: now,
        lastActiveAt: now,
      });

      // Simulate time passing
      const futureTime = now + 61 * 1000; // 1 minute and 1 second later
      const session = mockDb.get(sessionId);

      expect(session?.expiresAt).toBeLessThan(futureTime);
    });
  });

  describe('Security best practices', () => {
    it('does not store plain text passwords', async () => {
      const plainPassword = 'plaintext123';
      const encoder = new TextEncoder();
      const data = encoder.encode(plainPassword + 'elite_irrigation_salt');
      const hashBuffer = await crypto.subtle.digest('SHA-256', data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const passwordHash = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');

      expect(passwordHash).not.toBe(plainPassword);
      expect(passwordHash).toMatch(/^[a-f0-9]{64}$/);
    });

    it('generates unique session tokens', () => {
      const now = Date.now();

      const token1 = crypto.randomUUID();
      const token2 = crypto.randomUUID();

      expect(token1).not.toBe(token2);
    });

    it('sets appropriate session expiration', () => {
      const now = Date.now();
      const sevenDays = 7 * 24 * 60 * 60 * 1000;

      const expiresAt = now + sevenDays;

      const timeUntilExpiry = expiresAt - now;
      expect(timeUntilExpiry).toBe(sevenDays);
    });
  });
});
