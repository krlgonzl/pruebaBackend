const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Asset = sequelize.define('Asset', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  valor: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  category: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  custodio_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'custodios',
      key: 'id'
    }
  },
  status: {
    type: DataTypes.STRING(20),
    allowNull: false,
    defaultValue: 'activo',
    validate: {
      isIn: [['activo', 'dado de baja', 'trasladado']]
    }
  },
  deleted_at: {
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: null
  }
}, {
  tableName: 'assets',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = Asset;
