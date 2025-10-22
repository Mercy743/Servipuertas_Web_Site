import 'dotenv/config';
import express from 'express';
import pkg from 'pg';
const { Pool } = pkg;
import cors from 'cors';

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

// GET - Obtener todos los productos
app.get('/api/productos', async (req, res) => {
    try {
        const resultado = await pool.query('SELECT * FROM producto ORDER BY id ASC');
        res.json(resultado.rows);
    } catch (err) {
        res.status(500).json({ error: 'Error al obtener productos' });
    }
});

// GET - Obtener un producto por ID
app.get('/api/productos/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const resultado = await pool.query('SELECT * FROM producto WHERE id = $1', [id]);
        
        if (resultado.rows.length === 0) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }
        
        res.json(resultado.rows[0]);
    } catch (err) {
        res.status(500).json({ error: 'Error al obtener producto' });
    }
});

// POST - Crear nuevo producto
app.post('/api/productos', async (req, res) => {
    try {
        const { nombre, descripcion, precio, precio_tipo, stock, imagen_url, marca, categoria } = req.body;
        
        const resultado = await pool.query(
            `INSERT INTO producto (nombre, descripcion, precio, precio_tipo, stock, imagen_url, marca, categoria) 
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
            [nombre, descripcion, precio, precio_tipo, stock, imagen_url, marca, categoria]
        );
        
        res.status(201).json(resultado.rows[0]);
    } catch (err) {
        res.status(500).json({ error: 'Error al crear producto' });
    }
});

// PUT - Actualizar producto
app.put('/api/productos/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, descripcion, precio, precio_tipo, stock, imagen_url, marca, categoria } = req.body;
        
        const resultado = await pool.query(
            `UPDATE producto SET nombre=$1, descripcion=$2, precio=$3, precio_tipo=$4, stock=$5, imagen_url=$6, marca=$7, categoria=$8 
             WHERE id = $9 RETURNING *`,
            [nombre, descripcion, precio, precio_tipo, stock, imagen_url, marca, categoria, id]
        );
        
        if (resultado.rows.length === 0) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }
        
        res.json(resultado.rows[0]);
    } catch (err) {
        res.status(500).json({ error: 'Error al actualizar producto' });
    }
});

// DELETE - Eliminar producto
app.delete('/api/productos/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const resultado = await pool.query('DELETE FROM producto WHERE id = $1 RETURNING *', [id]);
        
        if (resultado.rows.length === 0) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }
        
        res.json({ message: 'Producto eliminado', producto: resultado.rows[0] });
    } catch (err) {
        res.status(500).json({ error: 'Error al eliminar producto' });
    }
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});