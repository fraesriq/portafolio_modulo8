import app from './app.js';
import { sequelize } from './database/database.js';

const main = async () => {
  try {
    await sequelize.authenticate();
    console.log('Nos hemos conectado con éxito');
    await sequelize.sync({ force: true, alter: true});
    let PORT = 3002;
    app.listen(PORT, () => {console.log("Servidor escuchando en http://localhost:"+PORT);})
  } catch (error) {
    console.log('Ha ocurrido un error: ',error);
  }
}

main();