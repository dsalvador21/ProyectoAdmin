const User = require('./models/user');

const runSeed = async () => {
  const count = await User.count();
  if (count === 0) {
    await User.bulkCreate([
      { name: 'Juan Pérez', email: 'juan@example.com' },
      { name: 'Ana Torres', email: 'ana@example.com' },
      { name: 'Carlos Soto', email: 'carlos@example.com' }
    ]);
    console.log("Usuarios precargados (seed).");
  } else {
    console.log("Usuarios ya existen. Seed no necesario.");
  }
};

module.exports = runSeed;
