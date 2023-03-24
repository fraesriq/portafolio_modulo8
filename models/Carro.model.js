import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";

export const Carro = sequelize.define('carro', {

},{
  timestamps:false
});