const express = require('express');
const router = express.Router();
const User = require('../models/user');
const { success, error } = require('../utils/responses');

// Health
router.get('/health', (req, res) => {
  return success(res, { status: 'ok' });
});

// Obtener todos los usuarios
router.get('/', async (req, res, next) => {
  try {
    const users = await User.findAll();
    return success(res, users);
  } catch (err) {
    next(err);
  }
});

// Obtener usuario por ID
router.get('/:id', async (req, res, next) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    return error(res, 400, 'ID inválido');
  }

  try {
    const user = await User.findByPk(id);
    if (!user) {
      return error(res, 404, 'Usuario no encontrado');
    }
    return success(res, user);
  } catch (err) {
    next(err);
  }
});

// Crear usuario
router.post('/', async (req, res, next) => {
  try {
    const user = await User.create(req.body);
    return success(res, user, 201, 'Usuario creado');
  } catch (err) {
    // Si el error es de clave duplicada (email único)
    if (err.name === 'SequelizeUniqueConstraintError') {
      return error(res, 409, 'El email ya está registrado');
    }

    next(err); // se va al middleware de errores
  }
});

module.exports = router;
