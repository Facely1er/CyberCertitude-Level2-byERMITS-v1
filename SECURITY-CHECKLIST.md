# Production Security Checklist

## Pre-Deployment Security Verification

### Critical Security Items

- [ ] **No secrets in version control**
  ```bash
  # Run this command to verify:
  git grep -E 'SUPABASE_URL|SUPABASE_ANON_KEY|SENTRY_DSN|JWT_SECRET|API_KEY' -- ':!.env.example' ':!*.md'
  ```
  ✅ Should return no results

- [ ] **Environment variables properly configured**
  - All secrets in platform environment variables
  - Different keys for staging/production
  - No hardcoded credentials in code

- [ ] **Security headers configured**
  - X-Frame-Options: DENY
  - X-Content-Type-Options: nosniff
  - Strict-Transport-Security
  - Content-Security-Policy
  - Referrer-Policy

- [ ] **HTTPS enforced**
  - SSL certificate valid
  - HTTP redirects to HTTPS
  - HSTS header present

- [ ] **Authentication security**
  - Password requirements enforced (min 8 chars)
  - Session timeout configured (8 hours default)
  - Secure cookie settings
  - CSRF protection enabled
  - Rate limiting on auth endpoints

### Database Security

- [ ] **Row Level Security (RLS) enabled**
  ```sql
  -- Verify RLS on all tables:
  SELECT tablename, rowsecurity
  FROM pg_tables
  WHERE schemaname = 'public' AND rowsecurity = false;
  ```
  ✅ Should return no rows

- [ ] **RLS policies tested**
  - Users can only access their own data
  - Admin access works correctly
  - No unauthorized data access possible

- [ ] **Database credentials secure**
  - Strong database password
  - Connection pooling enabled
  - No direct database access from client

- [ ] **Backup strategy in place**
  - Automated daily backups
  - Backup retention policy (30 days)
  - Backup restoration tested

### Input Validation

- [ ] **Client-side validation**
  - All user inputs validated
  - XSS protection (DOMPurify)
  - SQL injection prevention (parameterized queries)

- [ ] **File upload security**
  - File type validation
  - File size limits (10MB max)
  - Malware scanning (if applicable)
  - Secure file storage

- [ ] **API security**
  - Rate limiting enabled
  - Request size limits
  - Input sanitization
  - Output encoding

### Code Security

- [ ] **Dependency audit passed**
  ```bash
  npm audit
  ```
  ✅ No critical/high vulnerabilities

- [ ] **No console.log in production**
  ```bash
  # Check for console statements:
  grep -r "console.log" src/ --exclude-dir=node_modules
  ```
  ✅ Only in logger utility

- [ ] **Error handling secure**
  - No sensitive info in error messages
  - Errors logged to monitoring service
  - Generic error messages to users

- [ ] **Source maps disabled**
  - No .map files in production
  - Source code not exposed

### Infrastructure Security

- [ ] **Service worker secure**
  - Cache policies appropriate
  - No sensitive data cached
  - Offline fallback secure

- [ ] **CDN configured**
  - Assets served over CDN
  - Cache headers correct
  - No sensitive data in CDN

- [ ] **Monitoring enabled**
  - Error tracking (Sentry)
  - Performance monitoring
  - Security event logging
  - Uptime monitoring

### Compliance & Audit

- [ ] **Audit logging enabled**
  - User actions logged
  - Admin actions logged
  - Security events logged
  - Log retention policy

- [ ] **Data privacy**
  - CUI protection measures
  - Data encryption at rest
  - Data encryption in transit
  - Privacy policy in place

- [ ] **Access control**
  - Role-based access control (RBAC)
  - Principle of least privilege
  - Regular access reviews
  - MFA available

### Testing

- [ ] **Security tests passed**
  ```bash
  npm run test:security
  ```

- [ ] **Penetration testing completed**
  - SQL injection tested
  - XSS tested
  - CSRF tested
  - Authentication bypass tested

- [ ] **Load testing completed**
  - Application handles expected load
  - No resource exhaustion
  - Rate limiting works

### Documentation

- [ ] **Security documentation complete**
  - Security architecture documented
  - Threat model documented
  - Incident response plan
  - Disaster recovery plan

- [ ] **Team training completed**
  - Security best practices
  - Incident response procedures
  - CMMC compliance requirements

---

## Verification Commands

```bash
# 1. Check for secrets in code
git grep -i "password\|secret\|key" --exclude-dir=node_modules --exclude="*.md" --exclude=".env.example"

# 2. Run security audit
npm audit --production

# 3. Check bundle for exposed secrets
npm run build && grep -r "sk_\|pk_\|secret" dist/ || echo "✅ No secrets found"

# 4. Verify security headers
curl -I https://your-domain.com | grep -E "X-Frame-Options|Strict-Transport-Security|Content-Security-Policy"

# 5. Test authentication
curl -X POST https://your-domain.com/api/auth -d '{}' -H "Content-Type: application/json"

# 6. Check SSL configuration
curl -I https://your-domain.com | grep -i "strict-transport-security"
```

---

## Security Incident Response

### If Security Issue Discovered:

1. **Immediately:**
   - Document the issue
   - Assess severity
   - Contain the issue if possible

2. **Within 1 Hour:**
   - Notify security team
   - Determine scope of impact
   - Begin remediation

3. **Within 4 Hours:**
   - Implement fix or workaround
   - Deploy to production
   - Verify fix works

4. **Within 24 Hours:**
   - Complete post-mortem
   - Update documentation
   - Implement preventive measures

---

## Regular Security Tasks

### Daily
- Monitor error logs
- Review failed auth attempts
- Check for security alerts

### Weekly
- Review access logs
- Check for new vulnerabilities
- Update dependencies (if needed)

### Monthly
- Run full security audit
- Review and update policies
- Test backup restoration
- Review user access

### Quarterly
- Penetration testing
- Security training
- Disaster recovery drill
- Policy review and update

---

## Security Contacts

- **Security Team:** [security@your-company.com]
- **On-Call Security:** [phone number]
- **Supabase Support:** https://supabase.com/support
- **CERT:** https://www.cisa.gov/uscert

---

**Last Updated:** 2025-10-16
**Next Review:** 2025-11-16
