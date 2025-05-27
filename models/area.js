const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Area = sequelize.define('Area', {
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
  }
}, {
  tableName: 'areas',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false
});

module.exports = Area;