# Production Environment Setup Guide

## DigitalOcean Droplet Configuration

### Prerequisites

- Ubuntu 22.04 LTS droplet
- Domain name pointed to your droplet's IP
- Root or sudo access to the server

### 1. Initial Server Setup

1. **Connect to your droplet:**

   ```bash
   ssh root@your-server-ip
   ```

2. **Run the setup script:**

   ```bash
   # Download and run the setup script
   curl -sSL https://raw.githubusercontent.com/yourusername/leechy.dev/main/scripts/setup-droplet.sh | bash

   # Or upload the script and run it
   chmod +x setup-droplet.sh
   ./setup-droplet.sh
   ```

3. **Configure your domain:**
   ```bash
   # Replace YOUR_DOMAIN_HERE with your actual domain
   sed -i 's/YOUR_DOMAIN_HERE/yourdomain.com/g' /etc/nginx/sites-available/portfolio
   sed -i 's/YOUR_DOMAIN_HERE/yourdomain.com/g' /var/www/portfolio/ecosystem.config.js
   ```

### 2. SSL Certificate Setup

```bash
# Install SSL certificate with Let's Encrypt
certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Test automatic renewal
certbot renew --dry-run
```

### 3. GitHub Repository Setup

1. **Add deployment SSH key to GitHub:**

   ```bash
   # Display the public key
   sudo -u portfolio cat /home/portfolio/.ssh/id_ed25519.pub
   ```

   Copy this key and add it to your GitHub repository:
   - Go to Settings > Deploy keys
   - Add new deploy key
   - Paste the key and enable "Allow write access"

2. **Clone your repository:**
   ```bash
   sudo -u portfolio git clone git@github.com:yourusername/leechy.dev.git /var/www/portfolio
   ```

### 4. GitHub Secrets Configuration

Add these secrets to your GitHub repository (Settings > Secrets and variables > Actions):

| Secret Name      | Description                          | Example Value                                 |
| ---------------- | ------------------------------------ | --------------------------------------------- |
| `DEPLOY_SSH_KEY` | Private SSH key for deployment       | Contents of `/home/portfolio/.ssh/id_ed25519` |
| `SERVER_HOST`    | Your server's IP address or hostname | `123.456.789.012`                             |
| `SERVER_USER`    | Username for SSH connection          | `portfolio`                                   |
| `DOMAIN_NAME`    | Your domain name                     | `yourdomain.com`                              |

### 5. Environment Variables

The application uses these environment variables in production:

```bash
# In /var/www/portfolio/ecosystem.config.js
NODE_ENV=production
PORT=3000
ORIGIN=https://yourdomain.com
```

## Database Management

### Database Location

- Production database: `/var/www/portfolio/data/portfolio.db`
- Backups: `/var/www/portfolio/data/portfolio-backup-*.db`

### Manual Database Operations

```bash
# Backup database
sudo -u portfolio cp /var/www/portfolio/data/portfolio.db /var/www/portfolio/data/manual-backup-$(date +%Y%m%d).db

# View database contents
sudo -u portfolio sqlite3 /var/www/portfolio/data/portfolio.db ".tables"
sudo -u portfolio sqlite3 /var/www/portfolio/data/portfolio.db "SELECT * FROM users;"

# Restore from backup
sudo -u portfolio cp /var/www/portfolio/data/portfolio-backup-YYYYMMDD.db /var/www/portfolio/data/portfolio.db
sudo -u portfolio pm2 restart portfolio-app
```

## Monitoring & Maintenance

### Application Logs

```bash
# View application logs
sudo -u portfolio pm2 logs portfolio-app

# View last 50 lines
sudo -u portfolio pm2 logs portfolio-app --lines 50

# Monitor logs in real-time
sudo -u portfolio pm2 logs portfolio-app --follow
```

### System Monitoring

```bash
# Check application status
sudo -u portfolio pm2 status

# Check Nginx status
systemctl status nginx

# Check disk usage
df -h

# Check memory usage
free -h

# View system logs
journalctl -u nginx -f
```

### Manual Deployment

```bash
# If you need to deploy manually
sudo -u portfolio /home/portfolio/deploy.sh
```

## Security Considerations

### Firewall Rules

- Port 22 (SSH) - Open
- Port 80 (HTTP) - Open (redirects to HTTPS)
- Port 443 (HTTPS) - Open
- Port 3000 (Node.js) - Internal only

### Security Headers

The Nginx configuration includes security headers:

- X-Frame-Options
- X-XSS-Protection
- X-Content-Type-Options
- Content Security Policy

### Regular Maintenance

- Automatic database backups (daily)
- Log rotation (daily, keeps 14 days)
- System updates (manual)
- SSL certificate renewal (automatic)

## Troubleshooting

### Common Issues

1. **Application won't start:**

   ```bash
   sudo -u portfolio pm2 logs portfolio-app
   sudo -u portfolio pm2 restart portfolio-app
   ```

2. **Database permission issues:**

   ```bash
   sudo chown portfolio:portfolio /var/www/portfolio/data/portfolio.db
   ```

3. **Nginx configuration errors:**

   ```bash
   nginx -t
   systemctl reload nginx
   ```

4. **SSL certificate issues:**
   ```bash
   certbot certificates
   certbot renew --force-renewal -d yourdomain.com
   ```

### Performance Optimization

1. **Enable Nginx caching:**

   ```bash
   # Add to Nginx config for static files caching
   location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
       expires 1y;
       add_header Cache-Control "public, immutable";
   }
   ```

2. **Monitor memory usage:**

   ```bash
   # Restart if memory usage gets too high
   sudo -u portfolio pm2 restart portfolio-app
   ```

3. **Database optimization:**
   ```bash
   # Vacuum database periodically
   sudo -u portfolio sqlite3 /var/www/portfolio/data/portfolio.db "VACUUM;"
   ```
