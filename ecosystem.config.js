module.exports = {
  apps: [{
    name: 'banking-oauth',
    script: './app.js',
    instances: 'max', // Leverages all CPU cores
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'development',
    },
    env_production: {
      NODE_ENV: 'production',
    }
  }]
};