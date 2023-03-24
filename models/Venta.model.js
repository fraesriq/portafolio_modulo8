import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";

export const Venta = sequelize.define('venta', {
  date: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
    validate: {
      notEmpty: true,
      isDate:true
    }
  },
  value: {
    type: DataTypes.DECIMAL,
    allowNull: false,
    validate: {
      min:0
    }
  }
},{
  timestamps:false
});