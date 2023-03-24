import { DataTypes } from "sequelize";
import { sequelize } from "../database/database.js";

export const Producto = sequelize.define('productos', {
  sku: {
    type: DataTypes.STRING(50),
    allowNull: false,
    validate: {
      notEmpty:true
    }
  },
  nameProduct: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      notEmpty:true
    }
  },
  description: {
    type: DataTypes.STRING(500),
    allowNull: false,
    validate: {
      notEmpty:true
    }
  },
  image: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      notEmpty:true
    }
  },
  det1: {
    type: DataTypes.STRING(100)
  },
  det2: {
    type: DataTypes.STRING(100)    
  },
  det3: {
    type: DataTypes.STRING(100)    
  },
  value: {
    type: DataTypes.DECIMAL,
    allowNull: false,
    validate: {
      min:0
    }
  },
  discount: {
    type: DataTypes.DECIMAL,
    allowNull: false,
    validate: {
      min:0
    }
  },
  stock: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min:0
    }
  }
}, {
  timestamps: false
})