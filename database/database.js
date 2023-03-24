import Sequelize from 'sequelize';

export const sequelize = new Sequelize('portafolio_m7', 'postgres', '123456', {
  host: 'localhost',
  dialect: 'postgres'
})