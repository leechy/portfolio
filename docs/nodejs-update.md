# 🔄 Node.js Version Update Guide

## ⚠️ **Important: Node.js 20 Required**

Your SvelteKit application now requires **Node.js 20+** instead of Node.js 18. If you already have a server running with Node.js 18, follow this guide to update it.

## 🔍 **Check Current Version**

```bash
node --version
npm --version
```

If you see Node.js v18.x.x, you need to upgrade to v20.x.x.

## 🚀 **Update Node.js on Existing Server**

### Option 1: Update via NodeSource Repository

```bash
# Remove old Node.js setup
sudo apt remove -y nodejs npm

# Install Node.js 20 LTS
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Verify installation
node --version  # Should show v20.x.x
npm --version   # Should show 10.x.x
```

### Option 2: Using Node Version Manager (nvm)

```bash
# Install nvm if not already installed
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.bashrc

# Install and use Node.js 20
nvm install 20
nvm use 20
nvm alias default 20

# Verify
node --version
```

## 🔄 **Update Application After Node.js Upgrade**

```bash
# Navigate to your application
cd /var/www/portfolio

# Stop the application
sudo -u portfolio pm2 stop portfolio-app

# Clear npm cache and node_modules
sudo -u portfolio rm -rf node_modules package-lock.json
sudo -u portfolio npm cache clean --force

# Reinstall dependencies with Node.js 20
sudo -u portfolio npm install

# Rebuild the application
sudo -u portfolio npm run build

# Restart the application
sudo -u portfolio pm2 start ecosystem.config.js
sudo -u portfolio pm2 save
```

## 🧪 **Test After Update**

```bash
# Check PM2 status
sudo -u portfolio pm2 status

# Check application logs
sudo -u portfolio pm2 logs portfolio-app

# Test the website
curl -I https://yourdomain.com
```

## 🔧 **Update PM2 and Global Packages**

```bash
# Update PM2 to latest version
sudo npm install -g pm2@latest

# Update other global packages if needed
sudo npm update -g
```

## ⚡ **Quick Update Script**

Save this as `update-nodejs.sh` and run it:

```bash
#!/bin/bash

set -e

echo "🔄 Updating Node.js to version 20..."

# Stop the application
sudo -u portfolio pm2 stop portfolio-app || true

# Update Node.js
sudo apt remove -y nodejs npm
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Update PM2
sudo npm install -g pm2@latest

# Navigate to app directory
cd /var/www/portfolio

# Clean and reinstall dependencies
sudo -u portfolio rm -rf node_modules package-lock.json
sudo -u portfolio npm cache clean --force
sudo -u portfolio npm ci

# Rebuild application
sudo -u portfolio npm run build

# Restart application
sudo -u portfolio pm2 start ecosystem.config.js
sudo -u portfolio pm2 save

echo "✅ Node.js update completed!"
echo "📊 New versions:"
node --version
npm --version
```

## 🚨 **Troubleshooting**

### Error: "Not compatible with your version of node/npm"

This means you still have Node.js 18. Double-check:

```bash
node --version
which node
```

### PM2 Issues After Update

```bash
# Reinstall PM2
sudo npm uninstall -g pm2
sudo npm install -g pm2@latest

# Restart PM2
sudo -u portfolio pm2 kill
sudo -u portfolio pm2 resurrect
```

### Permission Issues

```bash
# Fix ownership
sudo chown -R portfolio:portfolio /var/www/portfolio
sudo chown -R portfolio:portfolio /home/portfolio
```

---

**✅ After updating, your GitHub Actions deployments will work correctly with Node.js 20!**
