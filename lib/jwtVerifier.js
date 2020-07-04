import * as jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';
dotenv.config();

export default (req, res, next) => {
  const tokenHeader = req.headers['authorization'];
  // Note to self: the reason why the 'tokenHeader &&' part is needed to define token const below is
  // *because if there is no token provided, there will be nothing to split and you will get a 'never-resolving request'
  const token = tokenHeader && tokenHeader.split(' ')[1];
  if (token == null) {
    return res.status(403).send({message: "token not provided"});
  }
  try {
    jwt.verify(token, process.env.SECRET);
    next()
  }
  catch (err) {
    console.error(err);
    return res.status(403).send({message: "token invalid or expired"});
  }
}
