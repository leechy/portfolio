#!/bin/bash
set -e

echo "🔧 Setting up nginx and SSL for leechy.dev..."

# Update system packages
echo "📦 Updating system packages..."
sudo apt update

# Install certbot for Let's Encrypt SSL certificates
echo "🔒 Installing certbot for SSL certificates..."
sudo apt install -y certbot python3-certbot-nginx

# Disable default nginx site
echo "❌ Disabling default nginx site..."
sudo rm -f /etc/nginx/sites-enabled/default

# Install our portfolio configuration
echo "📝 Installing portfolio nginx configuration..."
sudo cp /tmp/nginx-portfolio.conf /etc/nginx/sites-available/portfolio

# Enable our site (create symlink)
echo "✅ Enabling portfolio site..."
sudo ln -sf /etc/nginx/sites-available/portfolio /etc/nginx/sites-enabled/

# Test nginx configuration
echo "🧪 Testing nginx configuration..."
sudo nginx -t

# Restart nginx to apply changes
echo "🔄 Restarting nginx..."
sudo systemctl restart nginx

# Obtain SSL certificate from Let's Encrypt
echo "🔒 Obtaining SSL certificate from Let's Encrypt..."
echo "This will ask you some questions about your domain and email..."
sudo certbot --nginx -d leechy.dev -d www.leechy.dev

echo "✅ Setup completed!"
echo "🌐 Your site should now be accessible at https://leechy.dev"
echo ""
echo "Next steps:"
echo "- Test HTTP redirect: curl -I http://leechy.dev"
echo "- Test HTTPS: curl -I https://leechy.dev"
echo "- Check certificate: sudo certbot certificates"
echo "- Auto-renewal is set up automatically by certbot"