module.exports = {
    user: 'SA',
    password: 'yourStrong(!)Password',
    server: 'localhost',
    database: 'master',
    options: {
        encrypt: false
    },
    pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000
    }
};