require('dotenv').config()
const { PORT } = process.env

module.exports = {
    apps: [
        {
            name: 'nodejs custom by BRIAN LUU',
            script: './src/server.js',
            instances: 'max',
            exec_mode: 'cluster',
            env: {
                NODE_ENV: 'development',
                PORT,
            },
            env_production: {
                NODE_ENV: 'production',
                PORT,
            },
            node_args:
                '--experimental-specifier-resolution=node --es-module-specifier-resolution=node',
        },
    ],
}
