# Fortress Fund - Deployment Guide

## Pre-Deployment Checklist

- [ ] All environment variables configured
- [ ] Database migrations applied
- [ ] Tests passing
- [ ] ESLint clean
- [ ] Security audit completed
- [ ] SSL/TLS certificate ready
- [ ] Domain DNS configured
- [ ] Backup strategy in place

---

## Environment Variables for Production

Create `.env.production.local` with:

```env
# Database
DATABASE_URL=postgresql://user:password@host:5432/fortress_fund

# NextAuth
NEXTAUTH_SECRET=<use `openssl rand -hex 32` to generate>
NEXTAUTH_URL=https://yourdomain.com

# AI
ANTHROPIC_API_KEY=sk-ant-...

# Application
NEXT_PUBLIC_APP_URL=https://yourdomain.com
NODE_ENV=production

# Security
NEXTAUTH_SESSION_STRATEGY=jwt
NEXTAUTH_SESSION_EXPIRE_IN_SECONDS=86400

# Logging
LOG_LEVEL=error
```

---

## Building for Production

```bash
# Build the application
npm run build

# Test production build locally
npm start
```

---

## Deployment Options

### Option 1: Vercel (Recommended for Next.js)

1. Push code to GitHub
2. Connect repository to Vercel
3. Set environment variables in Vercel dashboard
4. Configure PostgreSQL database connection
5. Deploy with one click

```bash
# Or deploy via CLI
npm i -g vercel
vercel --prod
```

### Option 2: Docker

Create `Dockerfile`:

```dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy application
COPY . .

# Build Next.js
RUN npm run build

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

# Start application
CMD ["npm", "start"]
```

Build and run:

```bash
docker build -t fortress-fund:latest .
docker run -p 3000:3000 --env-file .env.production.local fortress-fund:latest
```

### Option 3: VPS (AWS EC2, DigitalOcean, etc.)

#### Prerequisites
- Ubuntu 22.04 LTS
- Node.js 18+
- PostgreSQL 13+
- Nginx
- SSL certificate (Let's Encrypt)

#### Setup Script

```bash
#!/bin/bash
set -e

# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install PostgreSQL
sudo apt install -y postgresql postgresql-contrib

# Install Nginx
sudo apt install -y nginx

# Install PM2 for process management
sudo npm install -g pm2

# Create app directory
mkdir -p /var/www/fortress-fund
cd /var/www/fortress-fund

# Clone repository
git clone <repo-url> .

# Install dependencies
npm ci --only=production

# Build application
npm run build

# Setup environment
cp .env.example .env.production.local
# Edit .env.production.local with production values

# Run database migrations
npx prisma migrate deploy

# Start with PM2
pm2 start npm --name "fortress-fund" -- start
pm2 startup
pm2 save

# Configure Nginx
# (See nginx configuration below)

# Setup SSL with Let's Encrypt
sudo certbot certonly --webroot -w /var/www/fortress-fund/public -d yourdomain.com
```

#### Nginx Configuration

Save as `/etc/nginx/sites-available/fortress-fund`:

```nginx
upstream fortress_fund {
    server 127.0.0.1:3000;
}

server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    
    # Redirect to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;

    # SSL configuration
    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;

    # Compression
    gzip on;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss;

    location / {
        proxy_pass http://fortress_fund;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;

        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # Static files caching
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Deny access to sensitive files
    location ~ /\. {
        deny all;
    }
}
```

Enable the site:

```bash
sudo ln -s /etc/nginx/sites-available/fortress-fund /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

---

## Database Backup

### PostgreSQL Backup

```bash
# Manual backup
pg_dump $DATABASE_URL > backup.sql

# Automated backup (add to crontab)
0 2 * * * pg_dump $DATABASE_URL > /backups/fortress_fund_$(date +\%Y\%m\%d).sql
```

### Restore Backup

```bash
psql $DATABASE_URL < backup.sql
```

---

## Monitoring & Logging

### PM2 Monitoring

```bash
pm2 monit                    # Real-time monitoring
pm2 logs fortress-fund       # View logs
pm2 logs fortress-fund --err # View errors
```

### Database Monitoring

```bash
# Connect to database
psql $DATABASE_URL

# Check database size
SELECT datname, pg_size_pretty(pg_database_size(datname)) 
FROM pg_database 
WHERE datname = 'fortress_fund';

# Check active connections
SELECT count(*) FROM pg_stat_activity;
```

---

## Performance Optimization

### Database Optimization

```sql
-- Create indexes for common queries
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_portfolios_userId ON portfolios(userId);
CREATE INDEX idx_transactions_portfolioId ON transactions(portfolioId);
CREATE INDEX idx_aiConversations_userId ON ai_conversations(userId);

-- Vacuum and analyze
VACUUM ANALYZE;
```

### Caching

Enable caching for static assets and API responses using Redis or Memcached:

```typescript
// Example: Cache portfolio data
import { cache } from 'react';

export const getCachedPortfolio = cache(async (portfolioId: string) => {
  // This will be automatically deduped within a request
  return db.portfolio.findUnique({ where: { id: portfolioId } });
});
```

---

## Rollback Procedures

### Database Rollback

```bash
# Revert to previous migration
npx prisma migrate resolve --rolled-back <migration_name>

# Re-run migrations
npx prisma migrate deploy
```

### Application Rollback

```bash
# With PM2
pm2 restart fortress-fund

# With Git
git revert <commit-hash>
npm run build
npm start
```

---

## Security Hardening

1. **Update Dependencies Regularly**
   ```bash
   npm audit
   npm audit fix
   ```

2. **Enable CORS Properly**
   ```typescript
   // Only allow your domain
   const corsOptions = {
     origin: process.env.NEXT_PUBLIC_APP_URL,
     credentials: true,
   };
   ```

3. **Rate Limiting** (consider adding)
   ```bash
   npm install express-rate-limit
   ```

4. **WAF (Web Application Firewall)**
   - Use Cloudflare or AWS WAF

5. **Regular Security Audits**
   ```bash
   npm audit
   npm audit security
   ```

---

## Monitoring & Alerts

Set up monitoring for:
- CPU usage
- Memory usage
- Disk space
- Database connections
- API response times
- Error rates

Tools: DataDog, New Relic, CloudWatch, Prometheus

---

## Disaster Recovery

### RTO/RPO Targets
- Recovery Time Objective (RTO): 4 hours
- Recovery Point Objective (RPO): 1 hour

### Backup Schedule
- Daily incremental backups
- Weekly full backups
- Monthly archived backups (30 days retention)

### Test Recovery
- Monthly recovery drills
- Document recovery procedures
- Maintain runbooks

---

## Support & Maintenance

- Monitor error logs daily
- Security patches within 48 hours
- Feature deployments on Tuesday/Wednesday
- Database maintenance during off-peak hours (2 AM UTC)

For urgent issues, follow the incident response playbook.
