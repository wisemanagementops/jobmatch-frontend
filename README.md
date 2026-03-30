# JobMatch AI - Frontend

React-based frontend for JobMatch AI job application assistant.

## Deployment to Vercel

### Quick Deploy

1. **Push this code to GitHub**

2. **Import to Vercel**
   - Go to https://vercel.com
   - Click "New Project"
   - Import `jobmatch-frontend` repository

3. **Set Environment Variable**
   - Go to Settings → Environment Variables
   - Add: `VITE_API_URL`
   - Value: `https://skillful-miracle-production.up.railway.app/api`
   - Environment: Production

4. **Deploy**
   - Vercel will auto-build and deploy

## Important

**Make sure to set `VITE_API_URL` in Vercel dashboard!**

Without this, the frontend cannot connect to your backend.

## License

MIT
