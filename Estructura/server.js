// server.js
require('dotenv').config();          // Carga variables de .env
const express = require('express');
const { Pool } = require('pg');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Conexión a PostgreSQL
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

// Probar conexión
pool.connect()
    .then(() => console.log("Conectado a PostgreSQL"))
    .catch(err => console.error("Error al conectar:", err));

// Middleware para servir archivos estáticos (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, 'public')));

// Endpoint para obtener productos
app.get('/api/productos', async (req, res) => {
    try {
        const resultado = await pool.query('SELECT * FROM producto ORDER BY id_producto ASC');
        res.json(resultado.rows);
    } catch (err) {
        console.error("Error al obtener productos:", err);
        res.status(500).json({ error: 'Error al obtener productos' });
    }
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log('Servidor corriendo en http://localhost:${PORT}');
});