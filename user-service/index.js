const express = require('express');
const app = express();
const sequelize = require('./config/db');
const userRoutes = require('./routes/users');
const runSeed = require('./seed');
require('dotenv').config();

console.log('👉 DATABASE_URL:', process.env.DATABASE_URL);

app.use(express.json());
app.use('/users', userRoutes);

// ✅ Middleware global para errores
app.use((err, req, res, next) => {
  console.error("💥 Error no capturado:", err);
  res.status(500).json({ error: 'Error interno del servidor' });
});

const PORT = process.env.PORT || 3000;
const MAX_RETRIES = 10;
let attempts = 0;

const startServer = async () => {
  try {
    console.log(`⏳ Intentando conectar a la base de datos... (intento ${attempts + 1})`);
    await sequelize.authenticate();
    console.log("✅ Base de datos conectada");

    await sequelize.sync();

    app.listen(PORT, async () => {
      console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
      await runSeed(); // solo se ejecuta si todo está ok
    });

  } catch (err) {
    console.error(`❌ Error de conexión: ${err.message}`);
    attempts++;
    if (attempts < MAX_RETRIES) {
      setTimeout(startServer, 3000);
    } else {
      console.error("💥 Falló conexión tras múltiples intentos. Abortando.");
      process.exit(1);
    }
  }
};

startServer();
