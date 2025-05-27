const express = require('express');
const app = express();
const { sequelize } = require('./models');

// Importar rutas
const areaRoutes = require('./routes/areas');
const custodioRoutes = require('./routes/custodios');
const assetRoutes = require('./routes/assets');
const movimientoRoutes = require('./routes/movimientos');

app.use(express.json());

app.get('/', (req, res) => {
  res.send('¡Bienvenido al API de Gestión de Activos!');
});

// Configurar rutas
app.use('/api/areas', areaRoutes);
app.use('/api/custodios', custodioRoutes);
app.use('/api/assets', assetRoutes);
app.use('/api/movimientos', movimientoRoutes);

const PORT = process.env.PORT || 4000;

app.listen(PORT, async () => {
  try {
    await sequelize.authenticate();
    console.log('Conexión a la base de datos exitosa');
    
    // Sincronizar modelos (solo en desarrollo)
    // await sequelize.sync({ alter: true });
    
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
  } catch (error) {
    console.error('Error de conexión a la base de datos:', error);
  }
});