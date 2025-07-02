const express = require('express');
const app = express();
const sequelize = require('./config/db');
const userRoutes = require('./routes/users');
require('dotenv').config();

app.use(express.json());
app.use('/users', userRoutes);

const { error } = require('./utils/responses');
app.use((err, req, res, next) => {
  console.error("Error no capturado:", err);
  const status = err.status || 500;
  const message = err.message || 'Error interno del servidor';
  error(res, status, message);
});

const PORT = process.env.PORT || 3000;
const MAX_RETRIES = 10;
let attempts = 0;

const startServer = async () => {
  try {
    console.log(`Intentando conectar a la base de datos... (intento ${attempts + 1})`);
    await sequelize.authenticate();
    console.log("Base de datos conectada");

    await sequelize.sync();

    app.listen(PORT, async () => {
      console.log(`user-service corriendo en puerto ${PORT}`);
    });

  } catch (err) {
    console.error(`Error de conexión: ${err.message}`);
    attempts++;
    if (attempts < MAX_RETRIES) {
      setTimeout(startServer, 3000);
    } else {
      console.error("Falló conexión tras múltiples intentos. Abortando.");
      process.exit(1);
    }
  }
};

startServer();
