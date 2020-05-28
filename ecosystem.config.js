module.exports = {
  apps : [{
    name   : "meat-api",
    script : "./dist/main.js",
    instances: 1,
    exec_mode: "cluster",
    watch: true,
    merge_logs: true,
    env: {
      SERVER_PORT: 5000,
      DB_URL: 'mongodb://localhost:27017/meat-api',
      NODE_ENV: 'development'
    },
    env_production: {
      SERVER_PORT: 6000,
      DB_URL: 'mongodb://localhost:27017/meat-api',
      NODE_ENV: 'env_production'
    },
    env_docker:{
      SERVER_PORT: 7000,
      DB_URL: 'mongodb://meat-db:27017/meat-api',
      NODE_ENV: 'env_production'
    }
  }]
}
