const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Custodio = sequelize.define('Custodio', {
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
  area_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'areas',
      key: 'id'
    }
  }
}, {
  tableName: 'custodios',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false
});

module.exports = Custodio;