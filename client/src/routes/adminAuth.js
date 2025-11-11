// routes/adminAuth.js
const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();

// POST /api/admin/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  // Validaciones básicas
  if (!email || !password) {
    return res.status(400).json({ error: 'Email y contraseña son requeridos' });
  }

  try {
    // Buscar administrador por email
    const result = await req.pool.query(
      'SELECT * FROM administrador WHERE email = $1 AND activo = true',
      [email.toLowerCase().trim()]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Credenciales incorrectas' });
    }

    const admin = result.rows[0];
    
    // Verificar contraseña
    const isValidPassword = await bcrypt.compare(password, admin.password_hash);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Credenciales incorrectas' });
    }

    // Generar token (puedes usar JWT si prefieres algo más robusto)
    const token = generateAdminToken(admin.id);
    
    // Registrar el login (opcional)
    await req.pool.query(
      'UPDATE administrador SET fecha_creacion = CURRENT_TIMESTAMP WHERE id = $1',
      [admin.id]
    );

    res.json({
      success: true,
      token: token,
      email: admin.email,
      nombre_completo: admin.nombre_completo,
      message: 'Login exitoso'
    });

  } catch (error) {
    console.error('Error en login admin:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// GET /api/admin/verify - Verificar token
router.get('/verify', async (req, res) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ valid: false });
  }

  const token = authHeader.substring(7);
  
  try {
    const tokenData = parseToken(token);
    if (!tokenData || !tokenData.adminId) {
      return res.status(401).json({ valid: false });
    }

    // Verificar que el admin aún existe y está activo
    const result = await req.pool.query(
      'SELECT id FROM administrador WHERE id = $1 AND activo = true',
      [tokenData.adminId]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ valid: false });
    }

    res.json({ valid: true });

  } catch (error) {
    console.error('Error verifying token:', error);
    res.status(401).json({ valid: false });
  }
});

function generateAdminToken(adminId) {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2);
  return Buffer.from(JSON.stringify({
    adminId,
    timestamp,
    random
  })).toString('base64');
}

function parseToken(token) {
  try {
    return JSON.parse(Buffer.from(token, 'base64').toString());
  } catch {
    return null;
  }
}

module.exports = router;