# Security Guide

This document provides comprehensive security information for the Elite Irrigation & Landscaping OS application.

## Table of Contents

1. [Security Architecture Overview](#security-architecture-overview)
2. [Authentication & Authorization](#authentication--authorization)
3. [Data Protection](#data-protection)
4. [Rate Limiting & DDoS Protection](#rate-limiting--ddos-protection)
5. [File Upload Security](#file-upload-security)
6. [Session Security](#session-security)
7. [API Security](#api-security)
8. [Environment Configuration](#environment-configuration)
9. [Security Best Practices](#security-best-practices)
10. [Incident Response](#incident-response)
11. [Security Checklist](#security-checklist)

---

## Security Architecture Overview

### Multi-Layered Security Approach

The application implements defense-in-depth with multiple security layers:

- **Transport Layer**: HTTPS enforcement, TLS/SSL
- **Application Layer**: Input validation, output encoding, CSRF protection
- **Session Layer**: Secure session management, IP tracking
- **Data Layer**: Encrypted passwords, audit logging
- **Infrastructure Layer**: Rate limiting, IP blocking

### Security Features

✅ **PBKDF2 Password Hashing** - 100,000 iterations with unique salts
✅ **Rate Limiting** - Configurable per-action limits with sliding windows
✅ **Session Security** - IP and user agent tracking, concurrent session limits
✅ **Input Validation** - Comprehensive sanitization of all user inputs
✅ **XSS Protection** - Content Security Policy, output encoding
✅ **CSRF Protection** - Token-based validation for mutations
✅ **File Upload Security** - Type validation, size limits, magic byte verification
✅ **Audit Logging** - Comprehensive security event tracking
✅ **Role-Based Access Control (RBAC)** - Granular permission system
✅ **Security Monitoring** - Automated threat detection

---

## Authentication & Authorization

### Password Security

**Hashing Algorithm**: PBKDF2-SHA256
- **Iterations**: 100,000
- **Salt**: Unique per password (UUID-based)
- **Pepper**: Server-side secret (AUTH_SESSION_SECRET)

**Password Requirements**:
- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number
- At least one special character
- Not in common password list

### Session Management

**Session Duration**:
- Standard: 24 hours
- Remember Me: 30 days
- Maximum concurrent sessions: 3 per user

**Session Security Features**:
- IP address tracking
- User agent validation
- Automatic session rotation on critical actions
- Suspicious activity detection

### Role-Based Access Control (RBAC)

**Roles**:
- `admin` - Full system access
- `manager` - Business operations management
- `office` - Administrative tasks
- `technician` - Field operations
- `customer` - Limited self-service
- `guest` - Read-only access

**Permission Format**: `resource:action`
- Examples: `users:read`, `estimates:approve`, `payments:process`

---

## Data Protection

### Encryption

**At Rest**:
- Passwords: PBKDF2 with unique salts
- Sessions: Encrypted tokens
- Sensitive data: Application-level encryption

**In Transit**:
- All data transmitted over HTTPS/TLS
- Convex uses encrypted connections

### Data Validation

**Input Sanitization**:
- HTML tag stripping
- Event handler removal
- XSS pattern detection
- SQL injection prevention

**Output Encoding**:
- HTML entity encoding
- JavaScript escaping
- URL parameter encoding

---

## Rate Limiting & DDoS Protection

### Default Rate Limits

| Action | Limit | Window |
|--------|-------|--------|
| Login | 5 attempts | 15 minutes |
| Registration | 3 attempts | 1 hour |
| API Requests | 100 requests | 1 minute |
| File Uploads | 10 uploads | 1 hour |
| Messages | 20 messages | 1 minute |

### IP Blocking

**Automatic Triggers**:
- Brute force attack detection (10+ failed attempts in 5 minutes)
- Rate limit violations
- Suspicious activity patterns

**Block Duration**:
- First offense: 15 minutes
- Repeat offenses: 1 hour
- Severe violations: 24 hours

---

## File Upload Security

### Allowed File Types

**Images**:
- JPEG (.jpg, .jpeg)
- PNG (.png)

**Documents**:
- PDF (.pdf)
- Word (.doc, .docx)

### Security Checks

1. **File Size Limit**: 10MB maximum
2. **MIME Type Validation**: Server-side verification
3. **Extension Whitelist**: Only allowed extensions
4. **Magic Byte Verification**: Actual file content checked
5. **Filename Sanitization**: Path traversal prevention
6. **Virus Scanning**: (Recommended for production)

---

## Session Security

### Session Lifecycle

1. **Creation**: On successful authentication
2. **Validation**: On each request
3. **Rotation**: After critical actions
4. **Expiration**: Automatic timeout
5. **Invalidation**: On logout or suspicious activity

### Hijacking Prevention

- IP address validation
- User agent consistency checks
- Geographic location tracking (optional)
- Device fingerprinting (optional)

---

## API Security

### Convex Security

- **Authentication**: Required for all mutations
- **Authorization**: Permission checks on sensitive operations
- **Validation**: Input validation on all arguments
- **Rate Limiting**: Per-action limits
- **Audit Logging**: All sensitive actions logged

### CORS Configuration

```env
ALLOWED_ORIGINS=http://localhost:5173,https://yourdomain.com
```

**Production**:
- Only allow your production domain
- Use specific URLs, not wildcards

---

## Environment Configuration

### Required Security Variables

```bash
# Authentication
AUTH_SESSION_SECRET=<random 32+ character string>
ENCRYPTION_KEY=<random 32+ character string>

# Rate Limiting
RATE_LIMIT_MAX_REQUESTS=100
RATE_LIMIT_WINDOW_MS=60000
MAX_LOGIN_ATTEMPTS=5
LOGIN_LOCKOUT_MINUTES=15
MAX_CONCURRENT_SESSIONS=3

# CORS
ALLOWED_ORIGINS=https://yourdomain.com
```

### Secret Generation

Generate secure secrets using:

```bash
# Generate 32-byte random secret
openssl rand -hex 32

# Or use Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## Security Best Practices

### Development

1. **Never commit secrets** to version control
2. **Use environment variables** for configuration
3. **Validate all inputs** on client and server
4. **Sanitize all outputs** before rendering
5. **Use parameterized queries** (Convex handles this)
6. **Implement proper error handling** without exposing sensitive info
7. **Keep dependencies updated**
8. **Run security audits** regularly

### Production

1. **Enable HTTPS** with valid certificates
2. **Configure CSP headers** properly
3. **Set up monitoring** and alerting
4. **Regular security reviews**
5. **Penetration testing** before major releases
6. **Incident response plan** ready
7. **Backup and disaster recovery** tested
8. **DDoS protection** enabled

### Operational

1. **Review audit logs** daily
2. **Monitor failed login attempts**
3. **Check security dashboard** weekly
4. **Update security patches** immediately
5. **Test restore procedures** monthly
6. **Review access permissions** quarterly

---

## Incident Response

### Security Incident Types

1. **Unauthorized Access** - Compromised accounts
2. **Data Breach** - Sensitive data exposure
3. **DDoS Attack** - Service disruption
4. **Malware** - Infected systems
5. **Social Engineering** - Phishing attacks

### Response Steps

1. **Detect** - Identify the incident
2. **Contain** - Limit the damage
3. **Eradicate** - Remove the threat
4. **Recover** - Restore services
5. **Post-Incident Review** - Learn and improve

### Emergency Contacts

- Security Team: [Contact Info]
- Development Team: [Contact Info]
- Management: [Contact Info]
- Legal Counsel: [Contact Info]

---

## Security Checklist

### Pre-Deployment

- [ ] All secrets moved to environment variables
- [ ] HTTPS configured with valid certificates
- [ ] CSP headers properly configured
- [ ] Rate limiting enabled
- [ ] Audit logging active
- [ ] File upload security tested
- [ ] Session security verified
- [ ] CORS configuration correct
- [ ] Security tests passing
- [ ] Dependencies up to date
- [ ] Backup procedures tested
- [ ] Monitoring configured

### Post-Deployment

- [ ] Security dashboard active
- [ ] Audit log monitoring setup
- [ ] Alert configuration verified
- [ ] Performance baseline established
- [ ] Incident response team briefed
- [ ] Documentation complete
- [ ] User training conducted

### Ongoing Maintenance

- [ ] Weekly: Review audit logs
- [ ] Monthly: Security updates
- [ ] Quarterly: Access review
- [ ] Semi-annually: Penetration test
- [ ] Annually: Security assessment

---

## Vulnerability Reporting

If you discover a security vulnerability, please:

1. **Do not** create a public issue
2. **Email** security@eliteirrigation.com
3. **Include**: Description, steps to reproduce, impact
4. **Allow** 30 days for remediation before disclosure

### Responsible Disclosure Policy

We appreciate responsible disclosure and will:
- Respond within 48 hours
- Keep you informed of progress
- Credit you (if desired)
- Work with you on disclosure timing

---

## Additional Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [OWASP Cheat Sheets](https://cheatsheetseries.owasp.org/)
- [Web Security Guidelines](https://wiki.mozilla.org/Security/Guidelines)
- [Convex Security](https://docs.convex.dev/security)

---

## Changelog

### Version 1.0.0 (Current)
- Initial security implementation
- PBKDF2 password hashing
- Rate limiting
- Session security
- Audit logging
- RBAC system
- File upload security
- Security monitoring
- Admin security dashboard

---

**Last Updated**: 2025-01-30
**Document Version**: 1.0.0
**Maintained By**: Development Team
