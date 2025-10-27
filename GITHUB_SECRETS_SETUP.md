# GitHub Secrets Setup Guide

## Required GitHub Secrets for Vercel Deployment

Go to: **https://github.com/YOUR_USERNAME/YOUR_REPO/settings/secrets/actions**

Click **"New repository secret"** for each of the following:

### ✅ Supabase Secrets (Already configured with fallbacks in workflow)

1. **VITE_SUPABASE_URL**
   - Value: `https://rjyyicattwrqtjiqwwvv.supabase.co`
   - Status: ✅ Has fallback in workflow

2. **VITE_SUPABASE_ANON_KEY**
   - Value: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJqeXlpY2F0dHdycXRqaXF3d3Z2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE1NDA2NjMsImV4cCI6MjA3NzExNjY2M30.GMVCQ3Gx9roGV652YvAn6aYJ-q_ET-CDrsvAypBrk_Y`
   - Status: ✅ Has fallback in workflow

### 🚀 Vercel Secrets (Required for primary deployment)

3. **VERCEL_TOKEN**
   - Value: Get from https://vercel.com/account/tokens
   - Create a new token, copy the value, add as secret
   - Status: ⚠️ Required for Vercel deployment

4. **ORG_ID**
   - Value: Get from your Vercel project settings
   - Path: Project → Settings → General → Organization ID
   - Status: ⚠️ Required for Vercel deployment

5. **VERCEL_PROJECT_ID**
   - Value: `prj_3yPNQmNK3UBJSLtXfe4xFcKUE40i` ✅ (Correct project ID)
   - Project name: `cyber-certitude-level2-by-ermits-v1`
   - Status: ✅ Ready to add

### 🔄 Netlify Secrets (Optional - for fallback only)

6. **NETLIFY_AUTH_TOKEN**
   - Value: Get from Netlify dashboard (optional)
   - Status: ⚠️ Optional - only needed if Vercel fails

7. **NETLIFY_SITE_ID**
   - Value: Get from Netlify dashboard (optional)
   - Status: ⚠️ Optional - only needed if Vercel fails

---

## Quick Setup Steps

### Step 1: Get Vercel Token
1. Go to https://vercel.com/account/tokens
2. Click **"Create Token"**
3. Name it "GitHub Actions" (or similar)
4. Copy the token value immediately (you won't see it again!)
5. Add as `VERCEL_TOKEN` secret in GitHub

### Step 2: Get Organization ID
1. Go to your Vercel dashboard
2. Click on your project
3. Go to **Settings** → **General**
4. Find **Organization ID**
5. Copy and add as `ORG_ID` secret in GitHub

### Step 3: Add Project ID
1. Go to GitHub secrets page
2. Click **"New repository secret"**
3. Name: `VERCEL_PROJECT_ID`
4. Value: `prj_3yPNQmNK3UBJSLtXfe4xFcKUE40i`
5. Click **"Add secret"**

---

## Current Workflow Behavior

With the updated workflow:

1. **Primary Deployment**: Vercel
   - Tries to deploy to Vercel first
   - Uses your project ID: `prj_3yPNQmNK3UBJSLtXfe4xFcKUE40i`
   - Project name: `cyber-certitude-level2-by-ermits-v1`
   - Falls back to Netlify if it fails or secrets are missing

2. **Fallback Deployment**: Netlify
   - Only runs if Vercel deployment fails
   - Uses Netlify secrets if configured
   - Otherwise just builds and validates

3. **Environment Variables**
   - Uses Supabase credentials with fallbacks
   - No secrets needed for Supabase (has hardcoded fallbacks)

---

## Security Notes

- ✅ Supabase keys have fallbacks (no secrets required)
- ✅ Vercel secrets are required for primary deployment
- ✅ Netlify secrets are optional (fallback only)
- ✅ All sensitive data should be in GitHub secrets
- ✅ Never commit secrets to code

---

## Testing the Deployment

After adding the required secrets:

1. Push a commit to main branch
2. Watch the GitHub Actions workflow run
3. Check for:
   - ✅ Successful Vercel deployment
   - ✅ Or Netlify fallback if Vercel fails
4. Visit your deployed site

---

## Need Help?

If you encounter issues:

- **Vercel deployment fails**: Check VERCEL_TOKEN, ORG_ID, VERCEL_PROJECT_ID are set
- **Netlify fallback fails**: This is expected if Netlify secrets aren't set
- **Build fails**: Check Supabase credentials are correct
- **Can't find ORG_ID**: Check Project → Settings → General in Vercel dashboard

---

**Status**: Ready to deploy once GitHub secrets are configured! 🚀

