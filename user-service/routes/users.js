const express = require('express');
const router = express.Router();
const User = require('../models/user');

// Health
router.get('/health', (req, res) => {
  console.log('[GET] /users/health');
  res.json({ status: 'ok' });
});

// Obtener usuarios
router.get('/', async (req, res, next) => {
  console.log('[GET] /users - Listar usuarios');
  try {
    const users = await User.findAll();
    console.log(`  → Se encontraron ${users.length} usuarios`);
    res.json(users);
  } catch (err) {
    console.error('  × Error al obtener usuarios:', err.message);
    next(err);
  }
});

// Obtener usuario por ID
router.get('/:id', async (req, res, next) => {
  const id = parseInt(req.params.id);
  console.log(`[GET] /users/${id} - Buscar usuario por ID`);

  if (isNaN(id)) {
    console.warn('  × ID inválido recibido');
    return res.status(400).json({ error: "ID inválido" });
  }

  try {
    const user = await User.findByPk(id);
    if (!user) {
      console.warn('  × Usuario no encontrado');
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    console.log(`  → Usuario encontrado: ${user.name || 'sin nombre'}`);
    res.json(user);
  } catch (err) {
    console.error('  × Error al buscar usuario:', err.message);
    next(err);
  }
});

// Crear usuario
router.post('/', async (req, res, next) => {
  console.log('[POST] /users - Crear usuario');
  console.log('  → Body recibido:', req.body);

  try {
    const user = await User.create(req.body);
    console.log(`  ✓ Usuario creado con ID ${user.id}`);
    res.status(201).json(user);
  } catch (err) {
    console.error('  × Error al crear usuario:', err.message);
    next(err);
  }
});

module.exports = router;
