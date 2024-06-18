module.exports = {
    apps: [
        {
            name: 'node-test',
            script: './src/index.js',
            watch: true,
            instances: 'max',
            exec_mode: 'cluster',
            ignore_watch: ['node_modules'],
            env: {
                NODE_ENV: 'development',
            },
            env_production: {
                NODE_ENV: 'production',
            },
        },
    ],

    deploy: {
        production: {
            user: 'root',
            host: '14.225.220.250',
            ref: 'origin/master',
            repo: 'GIT_REPOSITORY',
            path: 'DESTINATION_PATH',
            'pre-deploy-local': '',
            'post-deploy': 'npm install && pm2 reload ecosystem.config.cjs --env production',
            'pre-setup': '',
        },
    },
}
