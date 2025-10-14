import 'dotenv/config';
import express from 'express';
import pkg from 'pg';
const { Pool } = pkg;
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

pool.connect()
    .then(() => console.log("Conectado a PostgreSQL"))
    .catch(err => console.error("Error al conectar:", err));

app.use(express.static(path.join(__dirname, 'public')));

// ✅ RUTA PARA LA RAÍZ 
app.get('/', (req, res) => {
    res.json({ 
        message: 'Servidor de Servipuertas Morelia funcionando',
        endpoints: {
            productos: '/api/productos',
            test: '/api/test'
        }
    });
});

// Endpoint para obtener productos
app.get('/api/productos', async (req, res) => {
    try {
        const resultado = await pool.query(`
            SELECT 
                id_producto as id,
                nombre as nombre,
                descripcion as descripcion,
                precio_referencia as precio,
                precio_tipo as precio_tipo,
                stock as stock,
                imagen_url as imagen_url,
                marca as marca
            FROM producto 
            ORDER BY id_producto ASC
        `);
        
        // Headers para evitar caché y problemas de CORS
        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', '0');
        res.setHeader('Access-Control-Allow-Origin', '*');
        
        res.json(resultado.rows);
    } catch (err) {
        console.error("Error al obtener productos:", err);
        res.status(500).json({ error: 'Error al obtener productos' });
    }
});

// Endpoint de prueba
app.get('/api/test', (req, res) => {
    res.json({ message: '✅ API funcionando', status: 'ok' });
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});