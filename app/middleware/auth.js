import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { TOKEN_KEY, SALT_ROUNDS } from './auth.config';

export const verifyToken = (req, res, next) => {
  const token =
    req.body.token || req.query.token || req.headers['x-access-token'];
  if (!token) {
    return res.status(403).send('Un token es requerido para la autorización');
  }
  try {
    const decoded = jwt.verify(token, TOKEN_KEY);
    req.user = decoded;
    return next();
  } catch (err) {
    return res.status(401).send('Token no valido, acceso denegado');
  }
};

export const hashPassword = async (password) => {
  try {
    const salt = await bcrypt.genSalt(SALT_ROUNDS);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
  } catch (err) {
    throw err;
  }
};

export const auth = verifyToken;
