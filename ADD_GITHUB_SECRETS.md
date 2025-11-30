# 🔑 Add GitHub Secrets - Step-by-Step Guide

## Why These Secrets Are Needed

Your GitHub Actions workflow needs three secrets to deploy to Vercel:
1. **VERCEL_TOKEN** - Authentication token for Vercel
2. **ORG_ID** - Your Vercel organization ID
3. **VERCEL_PROJECT_ID** - Your specific project ID (already known)

---

## Step 1: Get VERCEL_TOKEN (5 minutes)

1. Go to: https://vercel.com/account/tokens
2. Click **"Create Token"**
3. Name it: `GitHub Actions - CMMC Platform`
4. Copy the token **immediately** (it won't be shown again!)
5. **Save it temporarily** - you'll add it to GitHub next

---

## Step 2: Get ORG_ID (3 minutes)

1. Go to: https://vercel.com/dashboard
2. Find your project: `cyber-certitude-level2-by-ermits-v1`
3. Click on the project
4. Go to **Settings** → **General**
5. Scroll down to **"Organization ID"**
6. Copy this value
7. **Save it temporarily**

---

## Step 3: Add All 3 Secrets to GitHub (5 minutes)

Go to: https://github.com/Facely1er/CyberCertitude-Level2-byERMITS-v1/settings/secrets/actions/new

### Secret #1: VERCEL_TOKEN
- Click **"New repository secret"**
- Name: `VERCEL_TOKEN`
- Value: [paste the token from Step 1]
- Click **"Add secret"**

### Secret #2: ORG_ID
- Click **"New repository secret"** (again)
- Name: `ORG_ID`
- Value: [paste the organization ID from Step 2]
- Click **"Add secret"**

### Secret #3: VERCEL_PROJECT_ID
- Click **"New repository secret"** (again)
- Name: `VERCEL_PROJECT_ID`
- Value: `prj_3yPNQmNK3UBJSLtXfe4xFcKUE40i`
- Click **"Add secret"**

---

## Step 4: Verify Secrets Added

Go to: https://github.com/Facely1er/CyberCertitude-Level2-byERMITS-v1/settings/secrets/actions

You should see:
- ✅ VERCEL_TOKEN
- ✅ ORG_ID
- ✅ VERCEL_PROJECT_ID

---

## ✅ Ready to Deploy!

Once all three secrets are added, you can trigger deployment by running:

```bash
cd C:\Users\facel\Downloads\GitHub\CyberCertitude-Level2-byERMITS-v1\CyberCertitude-Level2-byERMITS-v1
git commit --allow-empty -m "Deploy to production"
git push origin main
```

**Or tell me when you're ready and I'll trigger it for you!**

---

## 🆘 Troubleshooting

### "Secret not found" error
- Verify secrets are added to the correct repository
- Check secret names are EXACT (case-sensitive)

### "Invalid token" error
- Verify VERCEL_TOKEN is correct
- Make sure you copied the entire token

### "Project not found" error
- Verify VERCEL_PROJECT_ID is correct
- Check ORG_ID matches your organization

---

## ⏱️ Estimated Time: 15 minutes

Once complete, return here and say "ready to deploy" and I'll trigger the deployment!

