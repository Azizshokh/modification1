module.exports = {
    apps: [
        {
            name: "PetFood",
            cwd: "./",
            script: "./dist/server.js",
            watch: false,
            env_production: {
                NODE_ENV: "production",
                PORT: 4111,
            },
            env_development: {
                NODE_ENV: "development",
            },
            instances: 1,
            exec_mode: "cluster",
        },
    ],
};
