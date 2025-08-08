# Deployment Guide

This guide covers deployment strategies for CodeUtilsHub across different environments.

## Prerequisites

- Node.js 18+ 
- npm or yarn
- Git repository 
- Vercel account (for production deployment)
- Supabase project
- Environment variables configured

## Environment Setup

### Development
```bash
# Copy environment template
cp .env.development.example .env.development

# Configure required variables
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Staging
```bash
# Copy environment template  
cp .env.staging.example .env.staging

# Configure staging-specific variables
NEXT_PUBLIC_APP_URL=https://your-app-staging.vercel.app
```

### Production
```bash
# Production environment variables are managed in Vercel dashboard
# See .env.production for reference values
```

## Vercel Deployment

### 1. Initial Setup

1. **Connect Repository**
   ```bash
   # Install Vercel CLI
   npm i -g vercel
   
   # Login to Vercel
   vercel login
   
   # Deploy from project root
   vercel
   ```

2. **Configure Project**
   - Framework Preset: Next.js
   - Build Command: `npm run build`
   - Output Directory: `.next`
   - Install Command: `npm install`

### 2. Environment Variables

Set the following environment variables in Vercel Dashboard:

#### Required Variables
```bash
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
NEXT_PUBLIC_API_URL=https://your-domain.vercel.app/api

# Database
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# OAuth (Optional)
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Analytics (Optional)
NEXT_PUBLIC_GA_MEASUREMENT_ID=your_ga_id

# Error Monitoring (Optional)
SENTRY_DSN=your_sentry_dsn

# Feature Flags
NEXT_PUBLIC_ENABLE_ANALYTICS=true
NEXT_PUBLIC_ENABLE_OAUTH=true
NEXT_PUBLIC_ENABLE_CODE_EXECUTION=true
NEXT_PUBLIC_ENABLE_REPUTATION_SYSTEM=true
```

### 3. Domain Configuration

1. **Custom Domain** (Optional)
   ```bash
   # Add custom domain in Vercel dashboard
   vercel domains add your-custom-domain.com
   ```

2. **SSL Certificate**
   - Automatically provisioned by Vercel
   - No additional configuration required

### 4. Database Setup

#### Supabase Configuration

1. **Create Supabase Project**
   - Visit [supabase.com](https://supabase.com)
   - Create new project
   - Note URL and anon key

2. **Database Schema**
   ```sql
   -- User profiles table
   create table user_profiles (
     id uuid references auth.users on delete cascade,
     email text,
     name text,
     avatar_url text,
     bio text,
     github_username text,
     website text,
     created_at timestamp with time zone default timezone('utc'::text, now()) not null,
     updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
     primary key (id)
   );

   -- Enable Row Level Security
   alter table user_profiles enable row level security;

   -- Policies
   create policy "Users can view own profile" on user_profiles
     for select using (auth.uid() = id);

   create policy "Users can update own profile" on user_profiles
     for update using (auth.uid() = id);
   ```

3. **OAuth Providers**
   ```bash
   # Enable OAuth providers in Supabase dashboard
   # Configure redirect URLs:
   # - Development: http://localhost:3000/auth/callback
   # - Production: https://your-domain.com/auth/callback
   ```

## CI/CD Pipeline

### GitHub Actions Integration

Vercel automatically deploys on:
- **Production**: Push to `main` branch
- **Preview**: Pull requests and feature branches

### Manual Deployment

```bash
# Production deployment
vercel --prod

# Preview deployment  
vercel

# Check deployment status
vercel ls
```

## Monitoring & Analytics

### 1. Sentry Error Monitoring

```bash
# Configure Sentry DSN in environment variables
SENTRY_DSN=https://your-sentry-dsn@sentry.io/project

# Error monitoring is automatically initialized
```

### 2. Performance Monitoring

- Web Vitals tracking enabled
- Performance API integration
- Custom performance metrics

### 3. Analytics

```bash
# Google Analytics integration (optional)
NEXT_PUBLIC_GA_MEASUREMENT_ID=GA_MEASUREMENT_ID

# Custom analytics endpoint available at /api/analytics
```

## Performance Optimization

### 1. Build Optimization

```json
// next.config.ts
{
  "experimental": {
    "optimizeCss": true,
    "optimizeImages": true
  },
  "compress": true,
  "poweredByHeader": false
}
```

### 2. Caching Strategy

- Static assets: 1 year cache
- API routes: Custom cache headers
- ISR for dynamic content

### 3. Bundle Analysis

```bash
# Analyze bundle size
npm run analyze

# Check bundle composition
npm run build -- --analyze
```

## Security Considerations

### 1. Environment Variables

- Never commit `.env` files
- Use Vercel environment variables for secrets
- Separate development/staging/production configs

### 2. Content Security Policy

```javascript
// Configured in next.config.ts
const securityHeaders = [
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on'
  },
  {
    key: 'X-XSS-Protection', 
    value: '1; mode=block'
  },
  {
    key: 'X-Frame-Options',
    value: 'SAMEORIGIN'
  }
]
```

### 3. API Security

- Rate limiting configured
- CORS headers set
- Input validation on all endpoints

## Troubleshooting

### Common Issues

1. **Build Failures**
   ```bash
   # Check build logs
   vercel logs your-deployment-url
   
   # Local build test
   npm run build
   ```

2. **Environment Variables**
   ```bash
   # Verify environment variables
   vercel env ls
   
   # Pull environment variables locally
   vercel env pull .env.local
   ```

3. **Database Connection**
   ```bash
   # Test Supabase connection
   curl -I https://your-project.supabase.co/rest/v1/
   ```

### Support

- Vercel Documentation: [vercel.com/docs](https://vercel.com/docs)
- Supabase Documentation: [supabase.com/docs](https://supabase.com/docs)
- Next.js Documentation: [nextjs.org/docs](https://nextjs.org/docs)

## Post-Deployment Checklist

- [ ] Verify all environment variables are set
- [ ] Test OAuth authentication flow  
- [ ] Confirm database connectivity
- [ ] Check error monitoring integration
- [ ] Validate analytics tracking
- [ ] Test all major features
- [ ] Verify SEO meta tags
- [ ] Check mobile responsiveness
- [ ] Test performance metrics
- [ ] Confirm security headers
