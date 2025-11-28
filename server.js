const express = require('express');
const path = require('path');
const app = express();
const router = require('./public/scripts/router');
const PORT = process.env.PORT || 3000;
require('dotenv').config();

// Servir archivos estáticos desde la carpeta 'public/'
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(router);


// Iniciar servidor
app.listen(PORT, () => {
    console.log(`🚀 Servidor Home-Connect iniciado`);
    console.log(`🌐 URL: http://localhost:${PORT}`);

});
