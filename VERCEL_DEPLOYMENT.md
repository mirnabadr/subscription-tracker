# Vercel Deployment Guide

## Issues Fixed

1. ✅ Created `vercel.json` - Configuration for Vercel serverless functions
2. ✅ Created `api/index.js` - Serverless function handler for Vercel
3. ✅ Updated `app.js` - Removed server listen in Vercel environment
4. ✅ Updated `database/mongodb.js` - Added serverless-friendly connection handling
5. ✅ Updated `config/env.js` - Auto-detect Vercel URL for SERVER_URL

## Required Environment Variables in Vercel

Go to your Vercel project settings → Environment Variables and add:

### Required Variables:
```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d
JWT_COOKIE_EXPIRE=7
ARCJET_API_KEY=your_arcjet_api_key
ARCJET_ENV=production
QSTASH_TOKEN=your_upstash_qstash_token
QSTASH_URL=https://qstash.upstash.io/v2
EMAIL_PASSWORD=your_gmail_app_password
NODE_ENV=production
```

### Optional (Auto-set by Vercel):
```
VERCEL_URL=your-app.vercel.app (automatically set by Vercel)
SERVER_URL=https://your-app.vercel.app (optional, will auto-detect from VERCEL_URL)
```

## Deployment Steps

1. **Push changes to GitHub**
   ```bash
   git add .
   git commit -m "fix: Add Vercel serverless configuration"
   git push origin main
   ```

2. **In Vercel Dashboard:**
   - Go to your project settings
   - Add all environment variables listed above
   - Redeploy the project

3. **Verify Deployment:**
   - Check Vercel logs for any errors
   - Test the API endpoints

## Important Notes

- **Database Connection**: The connection is now optimized for serverless cold starts
- **QStash URL**: Use the production URL (`https://qstash.upstash.io/v2`) not localhost
- **SERVER_URL**: Will automatically use Vercel URL if not explicitly set
- **Workflow Endpoints**: Make sure QStash can reach your Vercel URL (it should be publicly accessible)

## Troubleshooting

If you still see errors:
1. Check Vercel function logs in the dashboard
2. Verify all environment variables are set correctly
3. Ensure MongoDB connection string is correct
4. Check that QStash token is valid for production

