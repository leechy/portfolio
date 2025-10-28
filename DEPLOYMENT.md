# 🚀 Deployment Checklist

## Prerequisites ✅

- [ ] DigitalOcean droplet created (Ubuntu 22.04 LTS)
- [ ] Domain DNS pointed to droplet IP
- [ ] Root/sudo access to server

## Server Setup 🖥️

- [ ] Run `scripts/setup-droplet.sh` on your server
- [ ] Replace `YOUR_DOMAIN_HERE` with actual domain in configs
- [ ] Set up SSL certificate with Let's Encrypt
- [ ] Add GitHub SSH key for deployment

## GitHub Configuration 🔧

- [ ] Add repository secrets:
  - `DEPLOY_SSH_KEY` - Private SSH key from server
  - `SERVER_HOST` - Server IP address
  - `SERVER_USER` - `portfolio`
  - `DOMAIN_NAME` - Your domain name
- [ ] Add deploy key to repository (public SSH key)

## First Deployment 🎯

- [ ] Clone repository to server: `/var/www/portfolio`
- [ ] Run initial build and start application
- [ ] Test application accessibility
- [ ] Verify admin login works

## Commands to Run

### 1. On Your Droplet:

```bash
# Download and run setup script
curl -O https://raw.githubusercontent.com/leechy/portfolio/main/scripts/setup-droplet.sh
chmod +x setup-droplet.sh
sudo ./setup-droplet.sh

# Configure domain (replace yourdomain.com)
sudo sed -i 's/YOUR_DOMAIN_HERE/yourdomain.com/g' /etc/nginx/sites-available/portfolio
sudo sed -i 's/YOUR_DOMAIN_HERE/yourdomain.com/g' /var/www/portfolio/ecosystem.config.js

# Setup SSL
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Get SSH public key for GitHub
sudo -u portfolio cat /home/portfolio/.ssh/id_ed25519.pub
```

### 2. On GitHub:

```bash
# Add the SSH public key as a deploy key in repository settings
# Add the private key as DEPLOY_SSH_KEY secret:
sudo -u portfolio cat /home/portfolio/.ssh/id_ed25519
```

### 3. First Deployment:

```bash
# Clone repository
sudo -u portfolio git clone git@github.com:yourusername/leechy.dev.git /var/www/portfolio

# Initial build and start
cd /var/www/portfolio
sudo -u portfolio npm ci
sudo -u portfolio npm run build
sudo -u portfolio pm2 start ecosystem.config.js
sudo -u portfolio pm2 save
sudo systemctl reload nginx
```

## Testing 🧪

- [ ] Visit https://yourdomain.com - should load homepage
- [ ] Visit https://yourdomain.com/admin - should load admin login
- [ ] Login with: `admin@leechy.dev` / `admin123!`
- [ ] Create a test blog post
- [ ] Push to main branch - should auto-deploy

## Monitoring 📊

```bash
# Check application status
sudo -u portfolio pm2 status

# View logs
sudo -u portfolio pm2 logs portfolio-app

# Check nginx
sudo systemctl status nginx

# Check SSL certificate
sudo certbot certificates
```

## Post-Deployment Security 🔒

- [ ] Change default admin password
- [ ] Update system packages regularly
- [ ] Monitor application logs
- [ ] Set up database backups (automated daily)
- [ ] Monitor disk space and memory usage

---

## Quick Links 🔗

- **GitHub Actions**: `.github/workflows/deploy.yml`
- **Server Setup**: `scripts/setup-droplet.sh`
- **Documentation**: `docs/production-setup.md`
- **PM2 Config**: `ecosystem.config.js` (created on server)
- **Nginx Config**: `/etc/nginx/sites-available/portfolio`

---

**🎉 After setup, every push to `main` branch will automatically deploy to production!**
