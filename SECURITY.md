# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |

## Security Updates

### Latest Security Improvements (v1.0.0)

✅ **Multer upgraded to 2.x** - Fixed multiple vulnerabilities in file upload handling

- Upgraded from Multer 1.4.5-lts.1 to 2.0.0-rc.4
- Patches security issues in multipart/form-data parsing
- Improved file validation and error handling

✅ **SheetJS (xlsx) upgraded to 0.20.3** - Fixed prototype pollution and ReDoS vulnerabilities

- Upgraded from 0.18.5 to 0.20.3
- Addresses GHSA-4r6h-8v6p-xvw6 (Prototype Pollution)
- Addresses GHSA-5pgg-2g8v-p4x9 (ReDoS)

## Security Features

### Authentication & Authorization

- **JWT tokens** with configurable expiration
- **API key validation** for all endpoints
- **Password hashing** using bcrypt with salt rounds
- **Token-based authentication** for protected routes

### Input Validation & Sanitization

- **express-validator** for input validation
- **express-mongo-sanitize** prevents NoSQL injection
- **File type validation** (only .xlsx, .xls allowed)
- **File size limits** (max 50MB)
- **Query parameter sanitization**

### Rate Limiting & DDoS Protection

- **Rate limiting**: 100 requests per 15 minutes per IP
- **Configurable limits** via environment variables
- **IP-based tracking**

### Security Headers

- **Helmet.js** for security headers
  - X-Content-Type-Options
  - X-Frame-Options
  - X-XSS-Protection
  - Strict-Transport-Security (HSTS)
  - Content-Security-Policy

### CORS Protection

- **Configurable origins** via environment variables
- **Credentials support** with proper origin validation
- **Preflight request handling**

### Data Protection

- **MongoDB connection encryption** (TLS/SSL support)
- **Environment variable isolation** (.env not committed)
- **Stack trace hiding** in production mode
- **Sensitive data filtering** in logs

## Best Practices

### For Developers

1. **Keep dependencies updated**

   ```bash
   npm audit
   npm update
   ```

2. **Use strong secrets**

   ```bash
   # Generate strong JWT secret (64 bytes)
   node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

   # Generate strong API key (32 bytes)
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

3. **Never commit secrets**

   - Use `.env` for local development
   - Use environment variables in production
   - Add `.env` to `.gitignore`

4. **Validate all inputs**

   - Use express-validator for request validation
   - Sanitize user inputs
   - Validate file types and sizes

5. **Use HTTPS in production**
   - Never use HTTP for production APIs
   - Use Let's Encrypt for free SSL certificates
   - Enable HSTS headers

### For Deployment

1. **Environment Configuration**

   ```env
   NODE_ENV=production
   JWT_SECRET=<64-char-random-string>
   API_KEY=<32-char-random-string>
   ALLOWED_ORIGINS=https://yourdomain.com
   ```

2. **MongoDB Security**

   - Enable authentication
   - Use strong passwords
   - Whitelist IP addresses
   - Use MongoDB Atlas with encryption at rest
   - Enable audit logging

3. **Server Hardening**

   - Keep OS and packages updated
   - Use firewall rules
   - Disable unnecessary services
   - Use non-root user for Node.js
   - Implement log monitoring

4. **Monitoring & Alerts**
   - Set up error tracking (Sentry, Rollbar)
   - Monitor failed login attempts
   - Track API usage patterns
   - Set up uptime monitoring
   - Enable security alerts

## Reporting a Vulnerability

If you discover a security vulnerability, please follow these steps:

1. **Do NOT** open a public issue
2. Email security details to: [your-email@example.com]
3. Include:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if any)

### Response Timeline

- **Initial response**: Within 48 hours
- **Status update**: Within 7 days
- **Fix timeline**: Depends on severity
  - Critical: 24-48 hours
  - High: 7 days
  - Medium: 30 days
  - Low: 90 days

## Security Checklist

Before deploying to production:

- [ ] Changed default `JWT_SECRET` to strong random string
- [ ] Changed default `API_KEY` to strong random string
- [ ] Updated `ADMIN_PASSWORD` to strong password
- [ ] Configured `ALLOWED_ORIGINS` to specific domains
- [ ] Set `NODE_ENV=production`
- [ ] Using HTTPS (SSL/TLS certificate)
- [ ] MongoDB authentication enabled
- [ ] MongoDB connection uses TLS/SSL
- [ ] Firewall rules configured
- [ ] Rate limiting configured appropriately
- [ ] Error tracking set up
- [ ] Log monitoring enabled
- [ ] Regular backups configured
- [ ] Dependencies up to date (`npm audit`)
- [ ] Security headers verified (helmet.js)
- [ ] CORS properly configured

## Known Limitations

### File Upload Security

- Maximum file size: 50MB (configurable)
- Only Excel files accepted (.xlsx, .xls)
- Files are temporarily stored on disk
- Automatic cleanup after processing

**Recommendation**: For production with high traffic, consider:

- Using cloud storage (S3, GCS) instead of local disk
- Implementing virus scanning for uploaded files
- Adding file content validation beyond extension check

### Rate Limiting

- Current implementation is IP-based
- May not work correctly behind proxies without proper configuration

**Recommendation**:

- Configure `trust proxy` in Express for production
- Consider using Redis for distributed rate limiting
- Implement user-based rate limiting for authenticated routes

### JWT Token Storage

- Tokens are stateless and cannot be revoked before expiration
- No token blacklist implementation

**Recommendation**:

- Keep token expiration short (7 days default)
- Implement token refresh mechanism
- Consider adding token blacklist for critical applications

## Security Audit History

| Date       | Version | Auditor  | Findings                   | Status   |
| ---------- | ------- | -------- | -------------------------- | -------- |
| 2025-11-11 | 1.0.0   | Internal | Multer 1.x vulnerabilities | ✅ Fixed |
| 2025-11-11 | 1.0.0   | Internal | xlsx vulnerabilities       | ✅ Fixed |

## Compliance

This application implements security best practices aligned with:

- OWASP Top 10 Web Application Security Risks
- OWASP API Security Top 10
- CWE/SANS Top 25 Most Dangerous Software Errors

## Additional Resources

- [OWASP API Security Project](https://owasp.org/www-project-api-security/)
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)
- [Express Security Best Practices](https://expressjs.com/en/advanced/best-practice-security.html)
- [MongoDB Security Checklist](https://docs.mongodb.com/manual/administration/security-checklist/)

---

**Last Updated**: 2025-11-11
**Version**: 1.0.0
