const express = require('express');
const router = express.Router();
const Task = require('../models/task');
const axios = require('axios');
const { success, error } = require('../utils/responses'); 
require('dotenv').config();

// Verifica si el usuario existe consultando el microservicio de usuarios
const userExists = async (userId) => {
  try {
    const res = await axios.get(`${process.env.USER_SERVICE_URL}/${userId}`);
    return res.status === 200;
  } catch {
    return false;
  }
};

// Health
router.get('/health', (req, res) => {
  return success(res, { status: 'ok' });
});

// Obtener tareas (todas o por usuario)
router.get('/', async (req, res, next) => {
  try {
    const userId = req.query.user_id;
    const where = userId ? { userId } : undefined;
    const tasks = await Task.findAll({ where });
    return success(res, tasks);
  } catch (err) {
    next(err);
  }
});

// Obtener tarea por ID
router.get('/:id', async (req, res, next) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return error(res, 400, "ID inválido");

  try {
    const task = await Task.findByPk(id);
    if (!task) return error(res, 404, "Tarea no encontrada");
    return success(res, task);
  } catch (err) {
    next(err);
  }
});

// Crear tarea
router.post('/', async (req, res, next) => {
  const { title, description, userId } = req.body;

  if (!title || !userId) {
    return error(res, 422, "Faltan campos requeridos", { required: ['title', 'userId'] });
  }

  try {
    const exists = await userExists(userId);
    if (!exists) return error(res, 404, "Usuario no existe");

    const task = await Task.create({ title, description, userId });
    return success(res, task, 201, "Tarea creada");
  } catch (err) {
    next(err);
  }
});

// Actualizar tarea
router.put('/:id', async (req, res, next) => {
  const id = parseInt(req.params.id);
  const { status } = req.body;

  if (isNaN(id)) return error(res, 400, "ID inválido");

  if (!['pendiente', 'en progreso', 'completada'].includes(status)) {
    return error(res, 400, "Estado inválido. Debe ser: pendiente, en progreso o completada");
  }

  try {
    const task = await Task.findByPk(id);
    if (!task) return error(res, 404, "Tarea no encontrada");

    task.status = status;
    await task.save();

    return success(res, task, 200, "Estado actualizado");
  } catch (err) {
    next(err);
  }
});

module.exports = router;
