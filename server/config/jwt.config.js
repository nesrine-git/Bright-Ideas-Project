// import jwt from 'jsonwebtoken';
// import response from '../utils/response.js';

// const authenticate = (req, res, next) => {
//   jwt.verify(req.cookies.usertoken, process.env.SECRET_KEY, (err, payload) => {
//     if (err) { 
//       return response(res, 401, false, '❌ Unauthorized: Invalid or expired token');
//     } else {
//       req.user = payload; // Store the decoded user information
//       next();
//     }
//   });
// };

// export default authenticate;
