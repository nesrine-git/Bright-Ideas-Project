import jwt from 'jsonwebtoken';
import response from '../utils/response.js';

const authenticate = async (req, res, next) => {
  const token = req.cookies.usertoken;
  
  if (!token) {
    return response(res, 401, false, '❌ Unauthorized: No token provided');
  }

  try {
    const payload = await jwt.verify(token, process.env.SECRET_KEY);
    req.userId = payload.id;
    next(); // Continue to the controller
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return response(res, 401, false, '❌ Unauthorized: Token expired');
    }
    console.log('JWT Verification failed:', err);
    return response(res, 401, false, '❌ Unauthorized: Invalid token');
  }
};

export default authenticate;
