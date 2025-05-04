import jwt from 'jsonwebtoken';
import response from '../utils/response.js';

const authenticate = (req, res, next) => {
  jwt.verify(req.cookies.usertoken, process.env.SECRET_KEY, (err, payload) => {
    if (err) { 
      return response(res, 401, false, '❌ Unauthorized: Invalid or expired token');
    } else {
      // ✅ Add the user ID to the request object
      req.userId = payload.id;
      next(); // continue to the controller
    }
  });
};

export default authenticate;
