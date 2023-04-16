import path from 'path';
import { v4 } from 'uuid';
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export const upload = (req, res, next) => {
  try{
      
    if (req.files == null) return res.status(400).json({ code: 400, message: "Debe proporcionar una foto." })
    
    let { foto } = req.files;
    
    let mimetype = foto.mimetype.split("/")[0];
    if(mimetype != "image") return res.status(400).json({code: 400, message: "El archivo subido no corresponde a una foto."})

    let nombreFoto = `${v4().slice(0,6)}-${foto.name}`
    let rutaPath = path.resolve(__dirname, "../public/img/"+nombreFoto)

    foto.mv(rutaPath, function(err) {
      if (err) {        
        return res.status(500).json({code: 500, message:"No se pudo guardar la imagen de la publicación."});
      }
      req.imagen = nombreFoto;      
      next();
    });
    
  } catch (error) {
    console.log('Error en carga imagen:',error);
    res.status(500).json({code: 500, message: "No se pudo cargar la foto."})
  }
}