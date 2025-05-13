import jwt from 'jsonwebtoken';
import response from '../utils/response.js';

const authenticate = (req, res, next) => {
  const token = req.cookies.usertoken;
  
  if (!token) {
    return response(res, 401, false, '❌ Unauthorized: No token provided');
  }

  jwt.verify(token, process.env.SECRET_KEY, (err, payload) => {
    if (err) { 
      // Handling token expiration and invalid token
      if (err.name === 'TokenExpiredError') {
        return response(res, 401, false, '❌ Unauthorized: Token expired');
      }
      console.log('JWT Verification failed:', err);
      return response(res, 401, false, '❌ Unauthorized: Invalid token');
    } else {
      // Add the user ID to the request object
      req.userId = payload.id;
      next(); // continue to the controller
    }
  });
};

export default authenticate;
