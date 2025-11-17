# Vercel Deployment Checklist

Use this checklist to ensure your deployment is successful.

## Pre-Deployment

- [ ] All code changes committed to Git
- [ ] `.env` files are in `.gitignore` (never commit secrets!)
- [ ] MongoDB Atlas database is set up
- [ ] MongoDB Atlas Network Access allows 0.0.0.0/0

## Backend Deployment

- [ ] Create new Vercel project
- [ ] Set Root Directory to `backend`
- [ ] Add environment variables:
  - [ ] `MONGO_URI`
  - [ ] `JWT_SECRET`
  - [ ] `GEMINI_API_KEY`
  - [ ] `NODE_ENV=production`
- [ ] Deploy backend
- [ ] Copy backend URL
- [ ] Test backend health: `https://your-backend.vercel.app/` should return JSON

## Frontend Deployment

- [ ] Create new Vercel project
- [ ] Set Root Directory to `frontend/finance-tracker`
- [ ] Set Framework Preset to `Vite`
- [ ] Add environment variables:
  - [ ] `VITE_API_URL=https://your-backend.vercel.app`
  - [ ] `VITE_WEB3FORMS_KEY`
- [ ] Deploy frontend
- [ ] Copy frontend URL

## Post-Deployment

- [ ] Add `CLIENT_URL` to backend environment variables
- [ ] Redeploy backend with new `CLIENT_URL`
- [ ] Test login/register functionality
- [ ] Test all API endpoints
- [ ] Test dashboard and data visualization
- [ ] Test income/expense CRUD operations
- [ ] Test AI features (if applicable)

## Known Limitations

⚠️ **File Uploads**: The bill scanning feature uploads files to local storage, which won't persist on Vercel's serverless platform. You'll need to implement cloud storage (Vercel Blob, Cloudinary, or S3) for this feature to work in production.

## Quick Reference

**Local Development URLs:**
- Frontend: http://localhost:5173
- Backend: http://localhost:8000

**Production URLs:**
- Frontend: https://your-frontend.vercel.app
- Backend: https://your-backend.vercel.app

**Environment Variables:**
```
# Backend
MONGO_URI=mongodb+srv://...
JWT_SECRET=your_secret
GEMINI_API_KEY=your_key
CLIENT_URL=https://your-frontend.vercel.app
NODE_ENV=production

# Frontend
VITE_API_URL=https://your-backend.vercel.app
VITE_WEB3FORMS_KEY=your_key
```
