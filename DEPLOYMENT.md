# 🚀 Deployment Guide

## Production Deployment Checklist

### 1. Environment Configuration

Update `.env` for production:

```env
NODE_ENV=production
PORT=5000

# Use production MongoDB (MongoDB Atlas recommended)
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/excel_db

# Generate strong secrets
JWT_SECRET=use_a_very_long_random_string_here_min_32_chars
API_KEY=generate_a_strong_api_key_here

# Restrict CORS to your frontend domain
ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com

# Adjust rate limiting for production
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### 2. Security Hardening

#### Generate Strong Secrets

```bash
# Generate JWT secret
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Generate API key
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

#### Update Admin Credentials

```env
ADMIN_EMAIL=your-admin@yourdomain.com
ADMIN_PASSWORD=use_a_very_strong_password_here
```

### 3. Build for Production

```bash
# Install dependencies
npm install --production

# Build TypeScript
npm run build

# Test production build
npm start
```

### 4. MongoDB Atlas Setup (Recommended)

1. Create account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster (free tier available)
3. Create database user with password
4. Whitelist your server IP or use 0.0.0.0/0 (all IPs)
5. Get connection string and update `MONGO_URI` in `.env`

Example connection string:

```
mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/excel_db?retryWrites=true&w=majority
```

## Deployment Options

### Option 1: Deploy to Heroku

```bash
# Install Heroku CLI
brew install heroku/brew/heroku  # macOS
# or download from https://devcenter.heroku.com/articles/heroku-cli

# Login
heroku login

# Create app
heroku create your-app-name

# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set MONGO_URI="your_mongodb_uri"
heroku config:set JWT_SECRET="your_jwt_secret"
heroku config:set API_KEY="your_api_key"
heroku config:set ALLOWED_ORIGINS="https://yourdomain.com"

# Deploy
git push heroku main

# Check logs
heroku logs --tail
```

### Option 2: Deploy to Railway

1. Go to [Railway.app](https://railway.app)
2. Click "New Project" → "Deploy from GitHub"
3. Select your repository
4. Add environment variables in Railway dashboard
5. Railway will auto-deploy on git push

### Option 3: Deploy to DigitalOcean App Platform

1. Go to [DigitalOcean](https://www.digitalocean.com)
2. Create new App
3. Connect GitHub repository
4. Configure build command: `npm run build`
5. Configure run command: `npm start`
6. Add environment variables
7. Deploy

### Option 4: Deploy to AWS EC2

```bash
# SSH into EC2 instance
ssh -i your-key.pem ubuntu@your-ec2-ip

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 (process manager)
sudo npm install -g pm2

# Clone repository
git clone your-repo-url
cd your-repo

# Install dependencies
npm install

# Build
npm run build

# Create .env file
nano .env
# Paste your production environment variables

# Start with PM2
pm2 start dist/server.js --name excel-api

# Save PM2 configuration
pm2 save
pm2 startup

# Check status
pm2 status
pm2 logs excel-api
```

### Option 5: Deploy with Docker

Create `Dockerfile`:

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY . .
RUN npm run build

EXPOSE 5000

CMD ["npm", "start"]
```

Create `docker-compose.yml`:

```yaml
version: "3.8"

services:
  api:
    build: .
    ports:
      - "5000:5000"
    environment:
      - NODE_ENV=production
      - MONGO_URI=${MONGO_URI}
      - JWT_SECRET=${JWT_SECRET}
      - API_KEY=${API_KEY}
    volumes:
      - ./uploads:/app/uploads
    restart: unless-stopped

  mongodb:
    image: mongo:7
    ports:
      - "27017:27017"
    volumes:
      - mongodb_data:/data/db
    restart: unless-stopped

volumes:
  mongodb_data:
```

Deploy:

```bash
# Build and run
docker-compose up -d

# Check logs
docker-compose logs -f

# Stop
docker-compose down
```

## Nginx Reverse Proxy (Optional)

If deploying on VPS, use Nginx as reverse proxy:

```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        # Increase timeout for large file uploads
        proxy_read_timeout 300s;
        proxy_connect_timeout 75s;
    }

    # Increase max body size for file uploads
    client_max_body_size 50M;
}
```

Enable HTTPS with Let's Encrypt:

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com
```

## Environment Variables Reference

| Variable                | Required | Description               | Example                |
| ----------------------- | -------- | ------------------------- | ---------------------- |
| NODE_ENV                | Yes      | Environment mode          | production             |
| PORT                    | Yes      | Server port               | 5000                   |
| MONGO_URI               | Yes      | MongoDB connection string | mongodb+srv://...      |
| JWT_SECRET              | Yes      | JWT signing secret        | random_64_char_string  |
| JWT_EXPIRE              | No       | JWT expiration            | 7d                     |
| ADMIN_EMAIL             | Yes      | Admin user email          | admin@example.com      |
| ADMIN_PASSWORD          | Yes      | Admin user password       | strong_password        |
| API_KEY                 | Yes      | API key for endpoints     | random_32_char_string  |
| ALLOWED_ORIGINS         | Yes      | CORS allowed origins      | https://yourdomain.com |
| RATE_LIMIT_WINDOW_MS    | No       | Rate limit window         | 900000                 |
| RATE_LIMIT_MAX_REQUESTS | No       | Max requests per window   | 100                    |

## Post-Deployment

### 1. Health Check

```bash
curl https://yourdomain.com/health
```

Expected response:

```json
{
  "status": "OK",
  "timestamp": "2025-11-11T10:30:00.000Z"
}
```

### 2. Test Authentication

```bash
curl -X POST https://yourdomain.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"your_password"}'
```

### 3. Monitor Logs

**PM2:**

```bash
pm2 logs excel-api
pm2 monit
```

**Docker:**

```bash
docker-compose logs -f
```

**Heroku:**

```bash
heroku logs --tail
```

### 4. Set Up Monitoring

Consider using:

- **Uptime monitoring**: UptimeRobot, Pingdom
- **Error tracking**: Sentry, Rollbar
- **Performance monitoring**: New Relic, DataDog
- **Log management**: Papertrail, Loggly

## Backup Strategy

### MongoDB Backup

**Manual backup:**

```bash
mongodump --uri="your_mongodb_uri" --out=/backup/$(date +%Y%m%d)
```

**Automated backup (cron):**

```bash
# Add to crontab (daily at 2 AM)
0 2 * * * mongodump --uri="your_mongodb_uri" --out=/backup/$(date +\%Y\%m\%d)
```

**MongoDB Atlas:** Enable automated backups in Atlas dashboard

## Scaling Considerations

### Horizontal Scaling

- Use load balancer (Nginx, AWS ALB)
- Deploy multiple instances
- Use Redis for session storage (if needed)

### Vertical Scaling

- Increase server resources (CPU, RAM)
- Optimize MongoDB indexes
- Use MongoDB sharding for large datasets

### Performance Optimization

- Enable MongoDB connection pooling
- Implement caching (Redis)
- Use CDN for static assets
- Compress responses (gzip)

## Troubleshooting Production Issues

### High Memory Usage

```bash
# Check memory
free -h

# Restart PM2 process
pm2 restart excel-api
```

### MongoDB Connection Issues

- Check MongoDB Atlas IP whitelist
- Verify connection string
- Check network connectivity

### File Upload Failures

- Verify uploads/ directory permissions
- Check disk space
- Increase Nginx client_max_body_size

### Rate Limit Issues

- Adjust RATE_LIMIT_MAX_REQUESTS
- Implement IP whitelisting for trusted clients

## Security Best Practices

1. ✅ Use HTTPS only (SSL/TLS certificate)
2. ✅ Keep dependencies updated (`npm audit`)
3. ✅ Use strong JWT secrets (min 32 characters)
4. ✅ Implement API key rotation
5. ✅ Enable MongoDB authentication
6. ✅ Restrict CORS to specific domains
7. ✅ Use environment variables (never commit secrets)
8. ✅ Implement request logging
9. ✅ Set up firewall rules
10. ✅ Regular security audits

## Support

For issues or questions:

- Check logs first
- Review error messages
- Test with Postman collection
- Verify environment variables

---

**Your API is now production-ready!** 🎉
