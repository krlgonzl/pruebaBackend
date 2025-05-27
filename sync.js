const { sequelize } = require('./models');

async function syncDatabase() {
  try {
    await sequelize.sync({ force: false }); // usar force: true solo para recrear tablas
    console.log('Base de datos sincronizada');
    process.exit(0);
  } catch (error) {
    console.error('Error sincronizando:', error);
    process.exit(1);
  }
}

syncDatabase();