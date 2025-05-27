const sequelize = require('./config/database');
const Area = require('./area');
const Custodio = require('./custodio');
const Asset = require('./Asset');
const Movimiento = require('./movimiento');

// Definir relaciones
Area.hasMany(Custodio, { foreignKey: 'area_id', as: 'custodios' });
Custodio.belongsTo(Area, { foreignKey: 'area_id', as: 'area' });

Custodio.hasMany(Asset, { foreignKey: 'custodio_id', as: 'assets' });
Asset.belongsTo(Custodio, { foreignKey: 'custodio_id', as: 'custodio' });

Asset.hasMany(Movimiento, { foreignKey: 'activo_id', as: 'movimientos' });
Movimiento.belongsTo(Asset, { foreignKey: 'activo_id', as: 'activo' });

Movimiento.belongsTo(Custodio, { foreignKey: 'custodio_anterior_id', as: 'custodioAnterior' });
Movimiento.belongsTo(Custodio, { foreignKey: 'custodio_nuevo_id', as: 'custodioNuevo' });
Movimiento.belongsTo(Area, { foreignKey: 'area_anterior_id', as: 'areaAnterior' });
Movimiento.belongsTo(Area, { foreignKey: 'area_nueva_id', as: 'areaNueva' });

module.exports = {
  sequelize,
  Area,
  Custodio,
  Asset,
  Movimiento
};