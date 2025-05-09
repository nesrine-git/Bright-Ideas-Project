import User from '../models/user.model.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import response from '../utils/response.js';

const userController = {
  //✅ Register a new user
  register: async (req, res, next) => {
    try {
      // Check if user already exists
      const existingUser = await User.findOne({  email: req.body.email });
      if (existingUser) {
        return response(res, 400, false, '❌ Email is already in use');
      }
      // Create the new user
      const newUser = await User.create(req.body);
      // Generate JWT token
      const userToken = jwt.sign({ id: newUser._id },process.env.SECRET_KEY, { expiresIn: '1d' });

    // Send cookie
    res.cookie('usertoken', userToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Lax',
    });

    // Send response
    // Remove password before sending response
    // use .toObject() to convert the Mongoose document into a plain JS object before destructuring
    const { password: _, ...userData } = newUser.toObject();
    return response(res, 201, true, '✅ User registered successfully', userData);
    } catch (error) {
    next(error);
    }
    },
    /////////////////////
  // ✅Login user
  login: async (req, res, next) => {
    try {
      const { email, password } = req.body;

      // Find the user
      const user = await User.findOne({ email }).select('+password'); // include password
      // email not found in users collection
      if (!user) {
        return response(res, 400, false, '❌ Invalid email or password');
      }

     // if we made it this far, we found a user with this email address
     // let's compare the supplied password to the hashed password in the database
      const isMatch = await bcrypt.compare(password, user.password);
      // password wasn't a match!
      if (!isMatch) {
        return response(res, 400, false, '❌ Invalid email or password');
      }
      // if we made it this far, the password was correct
      // So Create JWT
      const userToken = jwt.sign({ id: user._id }, process.env.SECRET_KEY, { expiresIn: '1d' } );

      // Send cookie
      res.cookie('usertoken', userToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Lax',
      });

      // Send response
      const { password: _, ...userData } = user.toObject();
      return response(res, 200, true, '✅ Login successful', userData);
    } catch (error) {
      next(error);
    }
  },
  /////////////////////
  // ✅ Logout User
    logout: (req, res) => {
        res.clearCookie('usertoken', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Lax',
        });
        return response(res, 200, true, '✅ Logged out successfully');
    },
    // ✅ Get all users (for admin or internal use)
    getAll: async (req, res) => {
      try {
        const users = await User.find().select('-password'); // Exclude password
        response(res, 200, true, '👥 All users fetched', users);
      } catch (err) {
        response(res, 400, false, '❌ Failed to fetch users', err);
      }
    },
    // ✅ Get one user
    getOne: async (req, res) => {
      try {
        const user = await User.findById(req.params.id).select('-password'); // exclude password
        if (!user) {
          return response(res, 404, false, '❌ User not found');
        }
        response(res, 200, true, '👤 User fetched successfully', user);
      } catch (err) {
        response(res, 400, false, '❌ Failed to fetch user', err);
      }
    },
    //✅ Get current user
    getCurrentUser: async (req, res) => {
      try {
        console.log('💡 req.userId:', req.userId);
        const user = await User.findById(req.userId).select('-password');
        if (!user) return response(res, 404, false, 'User not found');

        return response(res, 200, true, 'Current user fetched', user);
      } catch (err) {
        return response(res, 400, false, '❌ Failed to fetch user', err);
      }
    }
    
};

export default userController;
