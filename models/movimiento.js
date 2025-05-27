const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Movimiento = sequelize.define('Movimiento', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  activo_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'assets',
      key: 'id'
    }
  },
  custodio_anterior_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'custodios',
      key: 'id'
    }
  },
  custodio_nuevo_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'custodios',
      key: 'id'
    }
  },
  area_anterior_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'areas',
      key: 'id'
    }
  },
  area_nueva_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'areas',
      key: 'id'
    }
  },
  motivo: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  fecha_movimiento: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'movimientos',
  timestamps: false
});

module.exports = Movimiento;