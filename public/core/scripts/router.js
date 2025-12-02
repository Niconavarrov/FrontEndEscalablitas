const express = require('express');
const path = require('path');
const router = express.Router();

router.use((req, res, next) => {
    // Si la ruta viene con /api, la removemos para procesamiento interno
    if (req.path.startsWith('/view')) {
        req.url = req.url.replace('/view', '');
        req.originalUrl = req.originalUrl.replace('/view', '');
    }
    next();
});

// Ruta principal - servir Index.html
router.get('/', (req, res) => { res.sendFile(path.join(process.cwd(), 'public', 'Index.html')); });

// Rutas para las diferentes páginas HTML
router.get('/InicioSesion', (req, res) => { res.sendFile(path.join(process.cwd(), 'public', 'login', 'views', 'InicioSesion.html')); });
router.get('/perfil-de-profesional', (req, res) => { res.sendFile(path.join(process.cwd(), 'public', 'perfilProfesional', 'views', 'perfilProfesional.html')); });
router.get('/cuenta-profesional', (req, res) => { res.sendFile(path.join(process.cwd(), 'public', 'cuentaProfesional', 'views', 'CuentaProfesional.html')); });
router.get('/home-profesional', (req, res) => { res.sendFile(path.join(process.cwd(), 'public', 'homeProfesional', 'views', 'homeProfesional.html')); });
router.get('/cuenta', (req, res) => { res.sendFile(path.join(process.cwd(), 'public', 'cuentaCliente', 'views', 'Cuenta.html')); });
router.get('/registro', (req, res) => { res.sendFile(path.join(process.cwd(), 'public', 'register', 'views', 'Registro.html')); });
router.get('/TyC', (req, res) => { res.sendFile(path.join(process.cwd(), 'public', 'register', 'views', 'terminos.html')); });
router.get('/privacidad', (req, res) => { res.sendFile(path.join(process.cwd(), 'public', 'register', 'views', 'privacidad.html')); });
router.get('/home', (req, res) => { res.sendFile(path.join(process.cwd(), 'public', 'homeCliente', 'views', 'home.html')); });
router.get('/FAQs', (req, res) => { res.sendFile(path.join(process.cwd(), 'public', 'core', 'views', 'FAQs.html')); });
router.get('/verification', (req, res) => { res.sendFile(path.join(process.cwd(), 'public', 'EmailVerification', 'views', 'verification.html')); });
router.get('/chats', (req, res) => { res.sendFile(path.join(process.cwd(), 'public', 'chatsService', 'views', 'chats.html')); });

// Manejo de errores 404
router.use((req, res) => {
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
router.use((err, req, res, next) => {
    console.error('Error:', err.stack);
    res.status(500).send('Error interno del servidor');
});

module.exports = router;