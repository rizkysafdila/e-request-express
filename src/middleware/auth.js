import jwt from 'jsonwebtoken';
import { errorResponse } from '../utils/response.js';

const jwtMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return errorResponse(res, 'Token tidak ditemukan', 401);
    }

    const token = authHeader.substring(7);
    const JWT_SECRET = process.env.JWT_SECRET;
    
    const decoded = jwt.verify(token, JWT_SECRET, {algorithms: ['HS256']});
    req.user = decoded;
    
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return errorResponse(res, 'Token telah kadaluarsa', 401);
    }
    
    if (error.name === 'JsonWebTokenError') {
      return errorResponse(res, 'Token tidak valid', 401);
    }
    
    return errorResponse(res, 'Terjadi kesalahan pada autentikasi', 500);
  }
};

export default jwtMiddleware;