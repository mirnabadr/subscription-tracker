# Vercel Environment Variables Guide

## 📋 Complete List of Environment Variables

Copy and paste these into your Vercel Dashboard → Settings → Environment Variables

---

## 🔴 **REQUIRED** - Must be set for the app to work

### Database
```
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/database_name?retryWrites=true&w=majority
```
**Description:** Your MongoDB connection string  
**How to get:** From MongoDB Atlas dashboard → Connect → Connection string

### Authentication
```
JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_random
```
**Description:** Secret key for signing JWT tokens (use a long random string)  
**Example:** `sk_live_abc123xyz789...` or any random 32+ character string

```
JWT_EXPIRES_IN=7d
```
**Description:** How long JWT tokens are valid  
**Options:** `1d`, `7d`, `30d`, `1h`, etc.

```
JWT_COOKIE_EXPIRE=7
```
**Description:** Cookie expiration in days  
**Value:** `7` (matches JWT_EXPIRES_IN)

### Email Configuration
```
EMAIL_PASSWORD=your_gmail_app_password
```
**Description:** Gmail App Password (not your regular Gmail password)  
**How to get:** 
1. Go to Google Account → Security
2. Enable 2-Step Verification
3. Generate App Password
4. Use that 16-character password here

**Note:** The email sender is hardcoded to `mirna.b.ibrahim@gmail.com` in `config/nodemailer.js`

---

## 🟡 **IMPORTANT** - Should be set for production features

### Upstash QStash & Workflows
```
QSTASH_TOKEN=your_upstash_qstash_token
```
**Description:** Upstash QStash token for workflow orchestration  
**How to get:** From Upstash Dashboard → QStash → API Keys

```
QSTASH_URL=https://qstash.upstash.io/v2
```
**Description:** Upstash QStash API URL (use production URL, NOT localhost!)  
**Value:** `https://qstash.upstash.io/v2` (for production)

**Note:** These are optional if you don't need workflow features, but required for email reminders to work.

### Arcjet Security
```
ARCJET_API_KEY=your_arcjet_api_key
```
**Description:** Arcjet API key for rate limiting and bot protection  
**How to get:** From Arcjet Dashboard → API Keys

```
ARCJET_ENV=production
```
**Description:** Arcjet environment mode  
**Value:** `production` (for Vercel deployment)

**Note:** Optional, but recommended for API security

---

## 🟢 **OPTIONAL** - Auto-configured or optional

### Server Configuration
```
NODE_ENV=production
```
**Description:** Node environment  
**Value:** `production` (Vercel sets this automatically, but you can override)

```
SERVER_URL=https://your-app.vercel.app
```
**Description:** Your Vercel app URL  
**Note:** Auto-detected from `VERCEL_URL`, but you can set it explicitly

```
PORT=3000
```
**Description:** Server port  
**Note:** Not needed for Vercel (serverless functions don't use ports)

### Upstash Signing Keys (Optional)
```
QSTASH_CURRENT_SIGNING_KEY=sig_xxxxx
QSTASH_NEXT_SIGNING_KEY=sig_xxxxx
```
**Description:** QStash signing keys for webhook verification  
**Note:** Only needed if you're using webhook signatures

---

## 📝 Quick Setup Checklist

### Minimum Required (App will work but limited features):
- [ ] `MONGO_URI`
- [ ] `JWT_SECRET`
- [ ] `JWT_EXPIRES_IN`
- [ ] `JWT_COOKIE_EXPIRE`
- [ ] `EMAIL_PASSWORD`

### Full Features (Recommended):
- [ ] All above +
- [ ] `QSTASH_TOKEN`
- [ ] `QSTASH_URL=https://qstash.upstash.io/v2`
- [ ] `ARCJET_API_KEY`
- [ ] `ARCJET_ENV=production`
- [ ] `NODE_ENV=production`

---

## 🚀 How to Add in Vercel

1. Go to your Vercel project dashboard
2. Click **Settings** → **Environment Variables**
3. Click **Add New**
4. Enter the **Name** and **Value**
5. Select **Environment**: Choose `Production`, `Preview`, and/or `Development`
6. Click **Save**
7. **Redeploy** your project after adding variables

---

## ⚠️ Important Notes

1. **Never commit these values to Git** - They're already in `.gitignore`
2. **Use different values for Production vs Development** if needed
3. **QSTASH_URL must be production URL** - Don't use `http://127.0.0.1:8080` in Vercel
4. **Gmail App Password** - Must be an App Password, not your regular password
5. **JWT_SECRET** - Use a strong, random string (at least 32 characters)

---

## 🔍 Verify Variables Are Set

After adding variables, check Vercel logs:
1. Go to your deployment
2. Click **Functions** tab
3. Check logs for any "undefined" or missing variable errors

---

## 📞 Troubleshooting

**Error: "Database connection failed"**
→ Check `MONGO_URI` is correct and MongoDB allows connections from Vercel IPs

**Error: "JWT_SECRET is required"**
→ Make sure `JWT_SECRET` is set

**Error: "Email sending failed"**
→ Verify `EMAIL_PASSWORD` is a Gmail App Password (not regular password)

**Workflows not working**
→ Check `QSTASH_TOKEN` and `QSTASH_URL` are set correctly

