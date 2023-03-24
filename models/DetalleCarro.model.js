import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";

export const DetalleCarro = sequelize.define('detalle_carro', {
  amount: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      notEmpty: true,
      min : 0
    }
  }
},{
  timestamps:false
});