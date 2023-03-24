import app from './app.js';

const main = () => {
  try {
    let PORT = 3002;
    app.listen(PORT, () => {console.log("Servidor escuchando en http://localhost:"+PORT);})
  } catch (error) {
    console.log('Ha ocurrido un error: ',error);
  }
}

main();