module.exports = {
    development: {
        port: 3000,
        apiUrl: 'http://localhost:5000', // URL de tu backend
        staticPath: 'public'
    },
    production: {
        port: process.env.PORT || 8080,
        apiUrl: process.env.API_URL || 'https://api.home-connect.com',
        staticPath: 'public'
    }
};
