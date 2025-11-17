# Vercel Deployment Guide

This guide will help you deploy your Finance Tracker application to Vercel.

## Prerequisites

- GitHub account
- Vercel account (sign up at https://vercel.com)
- MongoDB Atlas account (for database)

## Step 1: Prepare Your Repository

1. Commit all changes:
```bash
git add .
git commit -m "Prepare for Vercel deployment"
git push origin main
```

## Step 2: Deploy Backend to Vercel

### 2.1 Create New Project
1. Go to https://vercel.com/new
2. Import your GitHub repository
3. Configure the project:
   - **Project Name**: `finance-tracker-backend` (or your preferred name)
   - **Framework Preset**: Other
   - **Root Directory**: `backend`
   - **Build Command**: Leave empty
   - **Output Directory**: Leave empty
   - **Install Command**: `npm install`

### 2.2 Set Environment Variables
Click on "Environment Variables" and add the following:

```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
GEMINI_API_KEY=your_gemini_api_key
NODE_ENV=production
```

**Important**: Don't set `CLIENT_URL` yet - we'll add it after deploying the frontend.

### 2.3 Deploy
1. Click **Deploy**
2. Wait for deployment to complete
3. Copy your backend URL (e.g., `https://finance-tracker-backend.vercel.app`)

## Step 3: Deploy Frontend to Vercel

### 3.1 Create New Project
1. Go to https://vercel.com/new again
2. Import the same GitHub repository
3. Configure the project:
   - **Project Name**: `finance-tracker-frontend` (or your preferred name)
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend/finance-tracker`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

### 3.2 Set Environment Variables
Click on "Environment Variables" and add:

```
VITE_API_URL=https://your-backend.vercel.app
VITE_WEB3FORMS_KEY=b527ab92-6d1d-483d-b973-ec67ff5b67bf
```

**Replace** `your-backend.vercel.app` with your actual backend URL from Step 2.3.

### 3.3 Deploy
1. Click **Deploy**
2. Wait for deployment to complete
3. Copy your frontend URL (e.g., `https://finance-tracker-frontend.vercel.app`)

## Step 4: Update Backend Environment Variables

1. Go back to your backend project in Vercel
2. Navigate to **Settings** → **Environment Variables**
3. Add a new variable:
```
CLIENT_URL=https://your-frontend.vercel.app
```
**Replace** with your actual frontend URL from Step 3.3.

4. Go to **Deployments** tab
5. Click the three dots (•••) on the latest deployment
6. Click **Redeploy** to apply the new environment variable

## Step 5: Configure MongoDB Atlas

1. Go to MongoDB Atlas (https://cloud.mongodb.com)
2. Navigate to **Network Access**
3. Click **Add IP Address**
4. Select **Allow Access from Anywhere** (0.0.0.0/0)
5. Click **Confirm**

This allows Vercel's serverless functions to connect to your database.

## Step 6: Test Your Deployment

1. Visit your frontend URL
2. Try to register/login
3. Test all features to ensure they work

## Important Notes

### File Uploads
Vercel's serverless functions are stateless, so file uploads to the local filesystem won't persist. For the bill scanning feature to work in production, you need to use cloud storage:

**Option 1: Vercel Blob Storage** (Recommended)
```bash
npm install @vercel/blob
```

**Option 2: Cloudinary**
```bash
npm install cloudinary
```

**Option 3: AWS S3**
```bash
npm install @aws-sdk/client-s3
```

### Environment Variables Summary

**Backend (Vercel):**
- `MONGO_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `GEMINI_API_KEY` - Google Gemini API key
- `CLIENT_URL` - Frontend URL (e.g., https://your-frontend.vercel.app)
- `NODE_ENV` - Set to `production`

**Frontend (Vercel):**
- `VITE_API_URL` - Backend URL (e.g., https://your-backend.vercel.app)
- `VITE_WEB3FORMS_KEY` - Web3Forms access key

## Troubleshooting

### 404 Errors
- Verify the Root Directory is set correctly in Vercel project settings
- Check that `vercel.json` exists in the backend directory
- Review deployment logs for specific errors

### CORS Errors
- Ensure `CLIENT_URL` is set correctly in backend environment variables
- Verify the frontend URL matches exactly (including https://)

### Database Connection Errors
- Verify `MONGO_URI` is correct
- Check MongoDB Atlas Network Access allows 0.0.0.0/0
- Review backend deployment logs

### API Connection Errors
- Ensure `VITE_API_URL` in frontend matches your backend URL
- Don't include `/api/v1` in `VITE_API_URL` (it's already in the API paths)
- Redeploy frontend after changing environment variables

## Redeploying After Changes

Whenever you push changes to GitHub:
1. Vercel will automatically redeploy both projects
2. If you change environment variables, manually redeploy from the Vercel dashboard

## Custom Domain (Optional)

To use a custom domain:
1. Go to your project in Vercel
2. Navigate to **Settings** → **Domains**
3. Add your custom domain
4. Update DNS records as instructed
5. Update environment variables with new domain URLs
