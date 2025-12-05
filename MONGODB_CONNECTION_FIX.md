# 🔧 MongoDB Connection Fix Guide

## Common Causes of "Database connection failed" Error

### 1. ✅ **MONGO_URI Not Set in Vercel** (Most Common)

**Problem:** Environment variable not configured in Vercel

**Solution:**
1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add variable:
   - **Name:** `MONGO_URI`
   - **Value:** Your MongoDB connection string
   - **Environment:** Select all (Production, Preview, Development)
3. **Redeploy** your project

**How to get MongoDB connection string:**
- MongoDB Atlas → Clusters → Connect → Connect your application
- Copy the connection string
- Replace `<password>` with your actual password
- Format: `mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority`

---

### 2. ✅ **MongoDB Atlas Network Access Blocking Vercel**

**Problem:** MongoDB Atlas only allows connections from specific IP addresses

**Solution:**
1. Go to MongoDB Atlas Dashboard
2. Click **Network Access** (left sidebar)
3. Click **Add IP Address**
4. Click **Allow Access from Anywhere** (adds `0.0.0.0/0`)
   - ⚠️ **Security Note:** This allows all IPs. For production, consider restricting.
5. Click **Confirm**
6. Wait 1-2 minutes for changes to propagate

**Alternative (More Secure):**
- Add Vercel's IP ranges (but this is complex)
- For development/testing, `0.0.0.0/0` is acceptable

---

### 3. ✅ **Wrong Connection String Format**

**Problem:** Connection string is malformed or incomplete

**Correct Format:**
```
mongodb+srv://username:password@cluster.mongodb.net/database_name?retryWrites=true&w=majority
```

**Common Mistakes:**
- ❌ Missing `mongodb+srv://` prefix
- ❌ Not replacing `<password>` placeholder
- ❌ Missing database name
- ❌ Special characters in password not URL-encoded

**Password with Special Characters:**
If your password has special characters like `@`, `#`, `%`, etc., you need to URL-encode them:
- `@` → `%40`
- `#` → `%23`
- `%` → `%25`
- `&` → `%26`

**Example:**
```
Password: MyP@ss#123
Encoded: MyP%40ss%23123
Connection: mongodb+srv://user:MyP%40ss%23123@cluster.mongodb.net/db
```

---

### 4. ✅ **MongoDB User Not Created or Wrong Credentials**

**Problem:** Database user doesn't exist or password is wrong

**Solution:**
1. Go to MongoDB Atlas → Database Access
2. Check if your user exists
3. If not, click **Add New Database User**
4. Create user with:
   - **Username:** Your username
   - **Password:** Generate a secure password
   - **Database User Privileges:** Read and write to any database (or specific database)
5. Use these credentials in your connection string

---

### 5. ✅ **Connection String Missing Database Name**

**Problem:** Connection string doesn't specify which database to use

**Solution:**
Add database name to connection string:
```
mongodb+srv://user:pass@cluster.mongodb.net/subscription_tracker?retryWrites=true&w=majority
                                                      ^^^^^^^^^^^^^^^^^^^^
                                                      Add your database name here
```

---

## 🔍 How to Debug

### Check Vercel Logs

1. Go to Vercel Dashboard → Your Project
2. Click on the latest deployment
3. Click **Functions** tab
4. Click on the function (usually `/api`)
5. Check **Runtime Logs** for error messages

**Look for:**
- `Error connecting to Database:`
- `Error name:` (e.g., `MongoServerError`, `MongoNetworkError`)
- `Error code:` (e.g., `ENOTFOUND`, `EAUTH`, `ETIMEDOUT`)

### Error Codes and Solutions

| Error Code | Meaning | Solution |
|------------|--------|----------|
| `ENOTFOUND` | Hostname not found | Check MONGO_URI format, verify cluster exists |
| `EAUTH` | Authentication failed | Check username/password, verify user exists in Atlas |
| `ETIMEDOUT` | Connection timeout | Check Network Access settings, allow `0.0.0.0/0` |
| `MongoServerError` | Server error | Check MongoDB Atlas status, verify cluster is running |
| `MongoNetworkError` | Network error | Check Network Access, firewall settings |

---

## ✅ Step-by-Step Fix Checklist

- [ ] **Step 1:** Verify `MONGO_URI` is set in Vercel Environment Variables
- [ ] **Step 2:** Check MongoDB Atlas → Network Access → Allow `0.0.0.0/0`
- [ ] **Step 3:** Verify connection string format is correct
- [ ] **Step 4:** Test connection string locally (if possible)
- [ ] **Step 5:** Check MongoDB user exists and credentials are correct
- [ ] **Step 6:** Redeploy on Vercel after making changes
- [ ] **Step 7:** Check Vercel function logs for specific error messages

---

## 🧪 Test Connection String Locally

You can test your connection string before deploying:

```bash
# Install mongosh (MongoDB Shell)
npm install -g mongosh

# Test connection
mongosh "your_connection_string_here"
```

If it connects successfully, the connection string is correct.

---

## 📝 Example Connection String

```
mongodb+srv://myuser:mypassword123@cluster0.abc123.mongodb.net/subscription_tracker?retryWrites=true&w=majority
```

**Breakdown:**
- `mongodb+srv://` - Protocol
- `myuser` - Username
- `mypassword123` - Password
- `cluster0.abc123.mongodb.net` - Cluster hostname
- `subscription_tracker` - Database name
- `?retryWrites=true&w=majority` - Connection options

---

## 🚨 Quick Fix (Most Likely Solution)

**90% of the time, the issue is one of these:**

1. **MONGO_URI not set in Vercel** → Add it in Environment Variables
2. **Network Access blocking** → Allow `0.0.0.0/0` in MongoDB Atlas
3. **Wrong password** → Regenerate password and update connection string

---

## 💡 Pro Tips

1. **Use MongoDB Atlas Free Tier** - Perfect for development
2. **Keep connection string secure** - Never commit to Git
3. **Test locally first** - Use the same connection string locally to verify
4. **Check Vercel logs** - They show the actual error, not just "Internal server error"

---

## 📞 Still Not Working?

If you've tried everything:
1. Check Vercel function logs for the specific error
2. Verify MongoDB Atlas cluster is running (not paused)
3. Try creating a new database user with a simple password
4. Test with a fresh connection string

