const express = require('express');
const path = require('path');
const { createProxyMiddleware } = require('http-proxy-middleware');
const app = express();
const router = require('./public/core/scripts/router');
const PORT = process.env.PORT || 3000;
require('dotenv').config();

// Servir archivos estáticos desde la carpeta 'public/'
app.use(express.json());

// Proxy para las llamadas a la API
app.use('/api', createProxyMiddleware({
    target: 'http://localhost:3001',
    changeOrigin: true,
    onProxyReq: (proxyReq, req, res) => {
        console.log(`[Proxy] ${req.method} ${req.url} -> http://localhost:3001${req.url}`);
    },
    onError: (err, req, res) => {
        console.error('[Proxy Error]', err);
        res.status(500).json({ error: 'Error al conectar con el servicio backend' });
    }
}));

app.use(express.static(path.join(__dirname, 'public')));
app.use(router);


// Iniciar servidor
app.listen(PORT, () => {
    console.log(`🚀 Servidor Home-Connect iniciado`);
    console.log(`🌐 URL: http://localhost:${PORT}`);
    console.log(`🔗 Proxy API: http://localhost:${PORT}/api -> http://localhost:3001/api`);
});
