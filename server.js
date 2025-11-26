const express = require('express');
const path = require('path');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging middleware (simple)
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// Servir archivos estáticos desde la carpeta 'app/views'
// NOTA: Más adelante moveremos esto a 'public/'
app.use(express.static(path.join(__dirname, 'app', 'views')));

// Ruta principal - servir home.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'app', 'views', 'InicioSesion.html'));
});

// Rutas para las diferentes páginas HTML
app.get('/perfil-profesional', (req, res) => {
    res.sendFile(path.join(__dirname, 'app', 'views', 'perfilProfesional.html'));
});

app.get('/cuenta-profesional', (req, res) => {
    res.sendFile(path.join(__dirname, 'app', 'views', 'CuentaProfesional.html'));
});

app.get('/home-profesional', (req, res) => {
    res.sendFile(path.join(__dirname, 'app', 'views', 'homeProfesional.html'));
});

app.get('/cuenta', (req, res) => {
    res.sendFile(path.join(__dirname, 'app', 'views', 'Cuenta.html'));
});

//app.get('/inicio-sesion', (req, res) => {
//   res.sendFile(path.join(__dirname, 'app', 'views', 'InicioSesion.html'));
//});

app.get('/registro', (req, res) => {
    res.sendFile(path.join(__dirname, 'app', 'views', 'Registro.html'));
});

// Ruta para clientes
app.get('/clientes/home', (req, res) => {
    res.sendFile(path.join(__dirname, 'app', 'views', 'clientes', 'home.html'));
});

app.get('/clientes/cuenta', (req, res) => {
    res.sendFile(path.join(__dirname, 'app', 'views', 'clientes', 'Cuenta.html'));
});

// Ruta para profesionales
app.get('/profesionales/perfil', (req, res) => {
    res.sendFile(path.join(__dirname, 'app', 'views', 'profesionales', 'perfilProfesional.html'));
});

// API Proxy (opcional - para cuando tengas backend)
// Descomentar cuando tengas el backend corriendo
/*
const { createProxyMiddleware } = require('http-proxy-middleware');
app.use('/api', createProxyMiddleware({
    target: process.env.API_URL || 'http://localhost:5000',
    changeOrigin: true,
    onProxyReq: (proxyReq, req, res) => {
        console.log(`Proxying ${req.method} ${req.url} to backend`);
    }
}));
*/

// Manejo de errores 404
app.use((req, res) => {
    res.status(404).send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>404 - Página no encontrada</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 100vh;
                    margin: 0;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                }
                .container {
                    text-align: center;
                }
                h1 {
                    font-size: 6rem;
                    margin: 0;
                }
                p {
                    font-size: 1.5rem;
                }
                a {
                    color: white;
                    text-decoration: underline;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>404</h1>
                <p>Página no encontrada</p>
                <a href="/">Volver al inicio</a>
            </div>
        </body>
        </html>
    `);
});

// Manejo de errores del servidor
app.use((err, req, res, next) => {
    console.error('Error:', err.stack);
    res.status(500).send('Error interno del servidor');
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`🚀 Servidor Home-Connect iniciado`);
    console.log(`📍 Entorno: ${NODE_ENV}`);
    console.log(`🌐 URL: http://localhost:${PORT}`);
    console.log(`📁 Sirviendo archivos desde: app/views/`);
    console.log('\n📋 Rutas disponibles:');
    console.log(`   - http://localhost:${PORT}/`);
    console.log(`   - http://localhost:${PORT}/perfil-profesional`);
    console.log(`   - http://localhost:${PORT}/cuenta-profesional`);
    console.log(`   - http://localhost:${PORT}/home-profesional`);
    console.log(`   - http://localhost:${PORT}/cuenta`);
    console.log(`   - http://localhost:${PORT}/inicio-sesion`);
    console.log(`   - http://localhost:${PORT}/registro`);
    console.log(`   - http://localhost:${PORT}/clientes/home`);
    console.log(`   - http://localhost:${PORT}/clientes/cuenta`);
    console.log(`   - http://localhost:${PORT}/profesionales/perfil`);
});
