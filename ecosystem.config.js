module.exports = {
  apps: [
    {
      name: 'portfolio-app',
      script: 'build/index.js',
      cwd: '/var/www/portfolio',
      instances: 1,
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
        ORIGIN: process.env.DOMAIN_NAME
          ? `https://${process.env.DOMAIN_NAME}`
          : 'https://leechy.dev'
      },
      error_file: '/var/www/portfolio/logs/err.log',
      out_file: '/var/www/portfolio/logs/out.log',
      log_file: '/var/www/portfolio/logs/combined.log',
      time: true,
      max_memory_restart: '1G',
      node_args: '--max_old_space_size=1024'
    }
  ]
};
