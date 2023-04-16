import jwt from "jsonwebtoken";
const SECRETO = process.env.SECRETO 

export const verifyToken = (req, res, next) => {
  
  let token;
  let tokenQuery = req.query.token;
  if (tokenQuery) token = tokenQuery;
  let tokenHeader = req.headers['authorization'];

  if (tokenHeader) {
    tokenHeader = tokenHeader.split(" ");
    tokenHeader = tokenHeader[1];
    token = tokenHeader;
  }

  if (token) {
    jwt.verify(token, SECRETO, (err, data) => {      
      if (err) return res.status(401).json({ code: 401, message: "Debe iniciar sesión con un usuario valido." })
      req.user = data.user;
      next();
    })
  } else {
    return res.status(401).json({ code: 401, message: "Debe proporcionar un token." });
  }
}