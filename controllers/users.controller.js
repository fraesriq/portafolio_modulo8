import { Usuario } from "../models/Usuario.model.js";
import jwt from 'jsonwebtoken'
//-------------------------------------------------------
//------------------------- POST ------------------------
//-------------------------------------------------------

export const addUser = async (req, res) => {
  try {
    let objUser = req.body;
    console.log('objUser: ',objUser);
    
    let newUser = await Usuario.create(objUser)
    
    res.status(201)
      .json({
        code: 201,
        user: newUser,
        message: 'Usuario creado correctamente'
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({code: 500, message: "Error al guardar el usuario."})
  }
}

export const getUserByEmailPassword = async (req, res) => {
  try {
    let objUser = req.body;

    const user = await Usuario.findOne({
      raw:true,
      where: {        
        email: objUser.email
      },
      attributes: ['id','name','email','password']
    })

    if (user === null) {
      return res.status(401).json({code:401,message:'Usuario no encontrado'})
    }

    if (user.password == objUser.password) {
      //Generar Token      
      let tokenKey
      try {
        
        //Elimino las claves que no quiero guardar en el token
        delete user['password'];        

        jwt.sign({user}, process.env.SECRETO, (err, token) => {
          if(err){
            res.status(500).json({ code: 500, message: "No se pudo emitir el token" })
          }else{
            tokenKey = token;
            res.status(200).json({code:200, token:tokenKey ,message:'Usuario encontrado'})
          }
        })
                
      } catch (error) {
        console.log('error: ',error);
      }
      
      
    } else {
      return res.status(401).json({code:401,message:'La contraseña no coincide'})
    }
    
  } catch (error) {
    
  }
}