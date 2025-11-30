# 🔧 Troubleshooting Guide - CMMC Level 1 Compliance Platform

## Overview

This comprehensive troubleshooting guide helps resolve common issues with the CMMC Level 1 Compliance Platform. Issues are organized by category and include step-by-step solutions.

## Table of Contents

- [Quick Diagnostics](#quick-diagnostics)
- [Authentication Issues](#authentication-issues)
- [Assessment Problems](#assessment-problems)
- [Evidence Upload Issues](#evidence-upload-issues)
- [Performance Problems](#performance-problems)
- [Browser Compatibility](#browser-compatibility)
- [Database Issues](#database-issues)
- [Deployment Problems](#deployment-problems)
- [Error Messages](#error-messages)
- [Advanced Troubleshooting](#advanced-troubleshooting)

---

## Quick Diagnostics

### Health Check Commands

```bash
# Check if the application is running
curl -I https://your-domain.com/health

# Check API status
curl https://your-domain.com/api/v1/health

# Check database connectivity
curl https://your-domain.com/api/v1/db/status
```

### Browser Console Diagnostics

1. Open browser Developer Tools (F12)
2. Check Console tab for errors
3. Check Network tab for failed requests
4. Check Application tab for storage issues

### Common Quick Fixes

| Issue | Quick Fix |
|-------|-----------|
| Page won't load | Clear browser cache and cookies |
| Login fails | Check internet connection, try incognito mode |
| Slow performance | Disable browser extensions, check memory usage |
| Upload fails | Check file size and format |

---

## Authentication Issues

### Problem: Cannot Login

**Symptoms:**
- Login form shows "Invalid credentials" error
- User gets redirected back to login page
- "Authentication failed" message appears

**Solutions:**

1. **Verify Credentials**
   ```bash
   # Check if user exists in database
   SELECT * FROM cmmc_compliance.cmmc_profiles WHERE email = 'user@example.com';
   ```

2. **Check Password Reset**
   - Use "Forgot Password" link
   - Check email for reset instructions
   - Ensure email is not in spam folder

3. **Clear Browser Data**
   - Clear cookies and local storage
   - Try incognito/private browsing mode
   - Disable browser extensions

4. **Check Network Connectivity**
   ```bash
   # Test API connectivity
   curl -X POST https://your-domain.com/api/v1/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"test@example.com","password":"test123"}'
   ```

### Problem: Session Expires Too Quickly

**Symptoms:**
- User gets logged out frequently
- "Session expired" messages
- Need to re-login multiple times

**Solutions:**

1. **Check Session Configuration**
   ```javascript
   // In browser console
   console.log('Session timeout:', localStorage.getItem('session_timeout'));
   console.log('Last activity:', localStorage.getItem('last_activity'));
   ```

2. **Extend Session Timeout**
   - Contact administrator to increase session duration
   - Check if "Remember Me" option is selected

3. **Check System Clock**
   - Ensure system clock is synchronized
   - Check timezone settings

### Problem: MFA Not Working

**Symptoms:**
- MFA setup fails
- Verification codes not accepted
- QR code not displaying

**Solutions:**

1. **Check MFA Setup**
   ```sql
   -- Check MFA status
   SELECT * FROM cmmc_compliance.user_mfa_settings WHERE user_id = 'user-uuid';
   ```

2. **Verify Authenticator App**
   - Ensure time is synchronized in authenticator app
   - Try regenerating QR code
   - Use backup codes if available

3. **Check Email Delivery**
   - Verify email address is correct
   - Check spam folder
   - Test with different email provider

---

## Assessment Problems

### Problem: Assessment Won't Load

**Symptoms:**
- Assessment page shows loading spinner indefinitely
- "Assessment not found" error
- Blank assessment page

**Solutions:**

1. **Check Assessment ID**
   ```javascript
   // In browser console
   console.log('Current assessment ID:', window.location.pathname);
   console.log('Assessment data:', localStorage.getItem('current_assessment'));
   ```

2. **Verify Database Connection**
   ```bash
   # Check if assessment exists
   curl https://your-domain.com/api/v1/assessments/assessment-id
   ```

3. **Clear Local Storage**
   ```javascript
   // Clear assessment cache
   localStorage.removeItem('current_assessment');
   localStorage.removeItem('assessment_data');
   location.reload();
   ```

### Problem: Assessment Progress Not Saving

**Symptoms:**
- Changes not persisting after page refresh
- "Save failed" error messages
- Progress percentage not updating

**Solutions:**

1. **Check Network Connection**
   - Verify internet connectivity
   - Check for network timeouts
   - Try saving on different network

2. **Verify Permissions**
   ```sql
   -- Check user permissions
   SELECT role, permissions FROM cmmc_compliance.cmmc_profiles WHERE id = 'user-uuid';
   ```

3. **Check Browser Storage**
   ```javascript
   // Check local storage usage
   console.log('Storage used:', JSON.stringify(localStorage).length);
   console.log('Storage available:', navigator.storage.estimate());
   ```

### Problem: Control Status Not Updating

**Symptoms:**
- Control status changes don't save
- Status reverts after page refresh
- "Update failed" error

**Solutions:**

1. **Check Data Validation**
   ```javascript
   // Validate control data
   const controlData = {
     status: 'implemented', // Must be valid status
     maturity_score: 4,     // Must be 1-5
     notes: 'Valid notes'   // Must be string
   };
   ```

2. **Verify API Endpoint**
   ```bash
   # Test control update endpoint
   curl -X PUT https://your-domain.com/api/v1/assessments/assessment-id/controls/control-id \
     -H "Authorization: Bearer token" \
     -H "Content-Type: application/json" \
     -d '{"status":"implemented","maturity_score":4}'
   ```

---

## Evidence Upload Issues

### Problem: File Upload Fails

**Symptoms:**
- Upload progress stops
- "Upload failed" error message
- File not appearing in evidence list

**Solutions:**

1. **Check File Requirements**
   - File size: Must be under 50MB
   - File types: PDF, DOC, DOCX, XLS, XLSX, PNG, JPG
   - File name: No special characters

2. **Check Network Stability**
   ```javascript
   // Monitor upload progress
   const xhr = new XMLHttpRequest();
   xhr.upload.addEventListener('progress', (e) => {
     console.log('Upload progress:', (e.loaded / e.total) * 100);
   });
   ```

3. **Verify Storage Quota**
   ```sql
   -- Check organization storage usage
   SELECT 
     organization_id,
     SUM(file_size) as total_size,
     COUNT(*) as file_count
   FROM cmmc_compliance.cmmc_evidence 
   GROUP BY organization_id;
   ```

### Problem: Evidence Not Linking to Controls

**Symptoms:**
- Evidence uploads successfully but doesn't appear in control
- "Evidence not found" when viewing control
- Evidence count shows 0

**Solutions:**

1. **Check Control ID**
   ```javascript
   // Verify control ID is correct
   console.log('Control ID:', controlId);
   console.log('Evidence control_id:', evidence.control_id);
   ```

2. **Verify Association**
   ```sql
   -- Check evidence-control association
   SELECT * FROM cmmc_compliance.cmmc_evidence 
   WHERE control_id = 'control-id' AND assessment_id = 'assessment-id';
   ```

---

## Performance Problems

### Problem: Slow Page Loading

**Symptoms:**
- Pages take more than 5 seconds to load
- Loading spinners appear frequently
- Browser becomes unresponsive

**Solutions:**

1. **Check Bundle Size**
   ```bash
   # Analyze bundle size
   npm run build:analyze
   ```

2. **Clear Browser Cache**
   - Hard refresh (Ctrl+F5 or Cmd+Shift+R)
   - Clear browser cache and cookies
   - Disable browser extensions

3. **Check Network Speed**
   ```javascript
   // Check connection speed
   navigator.connection && console.log('Connection:', navigator.connection.effectiveType);
   ```

4. **Monitor Resource Usage**
   - Open Task Manager (Windows) or Activity Monitor (Mac)
   - Check CPU and memory usage
   - Close unnecessary browser tabs

### Problem: Memory Leaks

**Symptoms:**
- Browser becomes slow over time
- High memory usage
- Browser crashes after extended use

**Solutions:**

1. **Check for Memory Leaks**
   ```javascript
   // Monitor memory usage
   setInterval(() => {
     console.log('Memory usage:', performance.memory?.usedJSHeapSize);
   }, 10000);
   ```

2. **Clear Component State**
   - Refresh the page periodically
   - Close unused browser tabs
   - Restart browser if necessary

---

## Browser Compatibility

### Problem: Features Not Working in Specific Browser

**Symptoms:**
- Buttons don't respond
- Styling appears broken
- JavaScript errors in console

**Solutions:**

1. **Check Browser Support**
   - Chrome 90+ (Recommended)
   - Firefox 88+
   - Safari 14+
   - Edge 90+

2. **Enable JavaScript**
   - Ensure JavaScript is enabled
   - Check for ad blockers blocking scripts
   - Disable browser extensions temporarily

3. **Update Browser**
   - Install latest browser version
   - Clear browser cache
   - Reset browser settings

### Problem: Mobile Issues

**Symptoms:**
- Layout appears broken on mobile
- Touch interactions not working
- Text too small to read

**Solutions:**

1. **Check Viewport Settings**
   ```html
   <meta name="viewport" content="width=device-width, initial-scale=1.0">
   ```

2. **Test Responsive Design**
   - Use browser developer tools
   - Test different screen sizes
   - Check touch interactions

---

## Database Issues

### Problem: Data Not Syncing

**Symptoms:**
- Changes not appearing across devices
- Data appears outdated
- "Sync failed" messages

**Solutions:**

1. **Check Database Connection**
   ```bash
   # Test database connectivity
   curl https://your-domain.com/api/v1/db/status
   ```

2. **Verify User Permissions**
   ```sql
   -- Check user database permissions
   SELECT * FROM information_schema.role_table_grants 
   WHERE grantee = 'cmmc_user';
   ```

3. **Check for Conflicts**
   ```sql
   -- Check for data conflicts
   SELECT * FROM cmmc_compliance.cmmc_assessments 
   WHERE updated_at > created_at + interval '1 hour';
   ```

### Problem: Migration Errors

**Symptoms:**
- Database migration fails
- "Schema not found" errors
- Data integrity issues

**Solutions:**

1. **Check Migration Status**
   ```bash
   # Check migration history
   supabase migration list
   ```

2. **Run Migrations Manually**
   ```bash
   # Apply specific migration
   supabase db push --file migration_file.sql
   ```

3. **Verify Schema**
   ```sql
   -- Check if schema exists
   SELECT schema_name FROM information_schema.schemata 
   WHERE schema_name = 'cmmc_compliance';
   ```

---

## Deployment Problems

### Problem: Build Fails

**Symptoms:**
- Build process stops with errors
- "Build failed" messages
- Missing dependencies

**Solutions:**

1. **Check Dependencies**
   ```bash
   # Install dependencies
   npm install
   
   # Check for vulnerabilities
   npm audit
   
   # Fix vulnerabilities
   npm audit fix
   ```

2. **Clear Build Cache**
   ```bash
   # Clear npm cache
   npm cache clean --force
   
   # Remove node_modules
   rm -rf node_modules package-lock.json
   npm install
   ```

3. **Check Environment Variables**
   ```bash
   # Verify environment variables
   npm run check:env
   ```

### Problem: Deployment Fails

**Symptoms:**
- Deployment process stops
- "Deployment failed" messages
- Site not accessible after deployment

**Solutions:**

1. **Check Build Output**
   ```bash
   # Test build locally
   npm run build
   npm run preview
   ```

2. **Verify Configuration**
   - Check netlify.toml or vercel.json
   - Verify environment variables
   - Check build settings

3. **Check Logs**
   - Review deployment logs
   - Check for specific error messages
   - Verify build commands

---

## Error Messages

### Common Error Messages and Solutions

| Error Message | Cause | Solution |
|---------------|-------|----------|
| "Network Error" | Connection issues | Check internet connection, try again |
| "Authentication Failed" | Invalid credentials | Verify username/password, reset if needed |
| "Permission Denied" | Insufficient permissions | Contact administrator for access |
| "File Too Large" | File exceeds size limit | Compress file or use smaller file |
| "Invalid File Type" | Unsupported file format | Use supported file types (PDF, DOC, etc.) |
| "Session Expired" | Session timeout | Log in again |
| "Database Error" | Database connectivity | Contact support |
| "Validation Error" | Invalid input data | Check form data and try again |

---

## Advanced Troubleshooting

### Debug Mode

Enable debug mode for detailed logging:

```javascript
// In browser console
localStorage.setItem('debug_mode', 'true');
location.reload();
```

### Performance Profiling

```javascript
// Start performance profiling
performance.mark('troubleshooting-start');

// Your operations here

// End profiling
performance.mark('troubleshooting-end');
performance.measure('troubleshooting', 'troubleshooting-start', 'troubleshooting-end');

// View results
console.log(performance.getEntriesByType('measure'));
```

### Database Debugging

```sql
-- Enable query logging
SET log_statement = 'all';
SET log_min_duration_statement = 0;

-- Check active connections
SELECT * FROM pg_stat_activity WHERE state = 'active';

-- Check database locks
SELECT * FROM pg_locks WHERE NOT granted;
```

### Network Debugging

```bash
# Check DNS resolution
nslookup your-domain.com

# Test connectivity
ping your-domain.com

# Check SSL certificate
openssl s_client -connect your-domain.com:443 -servername your-domain.com
```

---

## Getting Help

### Before Contacting Support

1. **Gather Information**
   - Browser type and version
   - Operating system
   - Error messages (screenshots)
   - Steps to reproduce the issue
   - Network environment

2. **Check Logs**
   - Browser console errors
   - Network request failures
   - Application logs

3. **Try Basic Solutions**
   - Clear browser cache
   - Restart browser
   - Try different browser
   - Check internet connection

### Contact Information

- **Email Support**: support@cmmc-platform.com
- **Documentation**: [https://docs.cmmc-platform.com](https://docs.cmmc-platform.com)
- **Status Page**: [https://status.cmmc-platform.com](https://status.cmmc-platform.com)
- **Community Forum**: [https://community.cmmc-platform.com](https://community.cmmc-platform.com)

### Escalation Process

1. **Level 1**: Basic troubleshooting (this guide)
2. **Level 1**: Email support with detailed information
3. **Level 3**: Phone support for critical issues
4. **Level 4**: On-site support for enterprise customers

---

*Last Updated: January 2025*  
*Version: 2.0.0*