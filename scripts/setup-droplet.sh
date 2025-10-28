#!/bin/bash

# DigitalOcean Droplet Setup Script for SvelteKit Portfolio
# Run this script as root on your Ubuntu droplet

set -e

echo "🚀 Starting DigitalOcean droplet setup for SvelteKit Portfolio..."

# Update system
echo "📦 Updating system packages..."
apt update && apt upgrade -y

# Install essential packages
echo "🔧 Installing essential packages..."
apt install -y curl wget git ufw fail2ban nginx certbot python3-certbot-nginx

# Install Node.js 18 LTS
echo "📱 Installing Node.js 18 LTS..."
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
apt install -y nodejs

# Verify installations
echo "✅ Verifying installations..."
node --version
npm --version

# Install PM2 globally
echo "⚙️ Installing PM2 process manager..."
npm install -g pm2

# Create application user
echo "👤 Creating application user..."
useradd -m -s /bin/bash portfolio
usermod -aG sudo portfolio

# Create application directory
echo "📁 Creating application directories..."
mkdir -p /var/www/portfolio
chown portfolio:portfolio /var/www/portfolio

# Create data directory for SQLite
mkdir -p /var/www/portfolio/data
chown portfolio:portfolio /var/www/portfolio/data

# Setup firewall
echo "🔒 Configuring firewall..."
ufw default deny incoming
ufw default allow outgoing
ufw allow ssh
ufw allow 'Nginx Full'
ufw --force enable

# Configure fail2ban
echo "🛡️ Configuring fail2ban..."
systemctl enable fail2ban
systemctl start fail2ban

# Setup Nginx configuration
echo "🌐 Setting up Nginx configuration..."
cat > /etc/nginx/sites-available/portfolio << 'EOF'
server {
    listen 80;
    server_name YOUR_DOMAIN_HERE www.YOUR_DOMAIN_HERE;
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied expired no-cache no-store private must-revalidate auth;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/javascript;

    # Main proxy to SvelteKit app
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # Timeout settings
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # Static files caching
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Security: deny access to sensitive files
    location ~ /\. {
        deny all;
    }
    
    location ~ \.(env|log|db)$ {
        deny all;
    }
}
EOF

# Enable the site
ln -sf /etc/nginx/sites-available/portfolio /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

# Test Nginx configuration
nginx -t

# Setup log rotation for application logs
echo "📋 Setting up log rotation..."
cat > /etc/logrotate.d/portfolio << 'EOF'
/var/www/portfolio/logs/*.log {
    daily
    missingok
    rotate 14
    compress
    notifempty
    create 0640 portfolio portfolio
    postrotate
        pm2 reload portfolio-app > /dev/null 2>&1 || true
    endscript
}
EOF

# Create logs directory
mkdir -p /var/www/portfolio/logs
chown portfolio:portfolio /var/www/portfolio/logs

# Create systemd service for backup
echo "💾 Setting up automated backups..."
cat > /etc/systemd/system/portfolio-backup.service << 'EOF'
[Unit]
Description=Portfolio Database Backup
After=network.target

[Service]
Type=oneshot
User=portfolio
ExecStart=/bin/bash -c 'cp /var/www/portfolio/data/portfolio.db /var/www/portfolio/data/portfolio-backup-$(date +\%Y-\%m-\%d).db && find /var/www/portfolio/data -name "portfolio-backup-*.db" -mtime +7 -delete'
EOF

cat > /etc/systemd/system/portfolio-backup.timer << 'EOF'
[Unit]
Description=Run portfolio backup daily
Requires=portfolio-backup.service

[Timer]
OnCalendar=daily
Persistent=true

[Install]
WantedBy=timers.target
EOF

systemctl enable portfolio-backup.timer
systemctl start portfolio-backup.timer

# Setup deployment script
echo "🔄 Creating deployment script..."
cat > /home/portfolio/deploy.sh << 'EOF'
#!/bin/bash

set -e

REPO_URL="$1"
BRANCH="${2:-main}"
APP_DIR="/var/www/portfolio"
BACKUP_DIR="/var/www/portfolio/backups"

echo "🚀 Starting deployment..."

# Create backup directory
mkdir -p "$BACKUP_DIR"

# Backup current database if it exists
if [ -f "$APP_DIR/data/portfolio.db" ]; then
    echo "💾 Backing up database..."
    cp "$APP_DIR/data/portfolio.db" "$BACKUP_DIR/portfolio-$(date +%Y%m%d-%H%M%S).db"
    
    # Keep only last 5 backups
    ls -t "$BACKUP_DIR"/portfolio-*.db | tail -n +6 | xargs -r rm
fi

# Navigate to app directory
cd "$APP_DIR"

# Pull latest changes
echo "📥 Pulling latest changes..."
git fetch origin
git reset --hard "origin/$BRANCH"

# Install/update dependencies
echo "📦 Installing dependencies..."
npm ci --production

# Build the application
echo "🔨 Building application..."
npm run build

# Restart PM2 process
echo "🔄 Restarting application..."
pm2 reload portfolio-app || pm2 start ecosystem.config.js

# Reload Nginx
echo "🌐 Reloading Nginx..."
sudo systemctl reload nginx

echo "✅ Deployment completed successfully!"
EOF

chmod +x /home/portfolio/deploy.sh
chown portfolio:portfolio /home/portfolio/deploy.sh

# Create PM2 ecosystem file
echo "⚙️ Creating PM2 ecosystem configuration..."
su - portfolio -c "cat > /var/www/portfolio/ecosystem.config.js << 'EOF'
module.exports = {
  apps: [{
    name: 'portfolio-app',
    script: 'build/index.js',
    cwd: '/var/www/portfolio',
    instances: 1,
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000,
      ORIGIN: 'https://YOUR_DOMAIN_HERE'
    },
    error_file: '/var/www/portfolio/logs/err.log',
    out_file: '/var/www/portfolio/logs/out.log',
    log_file: '/var/www/portfolio/logs/combined.log',
    time: true,
    max_memory_restart: '1G',
    node_args: '--max_old_space_size=1024'
  }]
}
EOF"

# Setup SSH key for GitHub (to be done manually)
echo "🔑 Setting up SSH for GitHub access..."
su - portfolio -c "ssh-keygen -t ed25519 -C 'portfolio@yourdomain.com' -f ~/.ssh/id_ed25519 -N ''"

# Set up sudo permissions for portfolio user (for deployment)
echo "👥 Setting up sudo permissions..."
echo "portfolio ALL=(ALL) NOPASSWD: /bin/systemctl reload nginx, /bin/systemctl restart nginx" > /etc/sudoers.d/portfolio

echo ""
echo "🎉 Droplet setup completed!"
echo ""
echo "📋 Next steps:"
echo "1. Replace 'YOUR_DOMAIN_HERE' with your actual domain in:"
echo "   - /etc/nginx/sites-available/portfolio"
echo "   - /var/www/portfolio/ecosystem.config.js"
echo ""
echo "2. Add the SSH public key to your GitHub repository:"
echo "   Display it with: sudo -u portfolio cat /home/portfolio/.ssh/id_ed25519.pub"
echo ""
echo "3. Set up SSL certificate with: certbot --nginx -d yourdomain.com -d www.yourdomain.com"
echo ""
echo "4. Clone your repository: sudo -u portfolio git clone git@github.com:yourusername/yourrepository.git /var/www/portfolio"
echo ""
echo "5. Run initial deployment: sudo -u portfolio /home/portfolio/deploy.sh"
echo ""