import { DataTypes } from 'sequelize'
import { sequelize } from '../database/database.js'

export const DetalleVenta = sequelize.define('detalle_venta', {
  amount: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      notEmpty: true,
      min: 0,
      isNumeric: true
    }
  },
  value: {
    type: DataTypes.DECIMAL,
    allowNull: false,
    validate: {
      notEmpty: true,
      min: 0,
      isDecimal: true
    }
  }
}, {
  timestamps: false
})
