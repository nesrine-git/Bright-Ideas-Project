import mongoose, { Schema, model } from 'mongoose';
import bcrypt from 'bcrypt';


// Define the User schema
const UserSchema = new Schema({
  name: {
    type: String,
    required: [true, "{PATH} is required"],
    minlength: [2, "{PATH} must be at least 2 characters long"],
    maxlength: [30, "{PATH} must be at most 30 characters long."]
  },
  alias: {
    type: String,
    required: [true, "{PATH} is required"],
    minlength: [2, "{PATH} must be at least 2 characters long"],
    maxlength: [15, "{PATH} must be at most 15 characters long."]
  },
  email: {
    type: String,
    required: [true, "{PATH} is required"],
    unique: true, // Make sure no duplicate emails are registered
    validate: {
        validator: val => /^([\w-\.]+@([\w-]+\.)+[\w-]+)?$/.test(val),
        message: "Please enter a valid {PATH}"
    }
  },
  password: {
    type: String,
    required: [true, "{PATH} is required"],
    minlength: [8, "{PATH} must be at least 8 characters long"],
    maxlength: [128, "{PATH} must be at most 128 characters long."],
    select: false // 👈 This hides password by default when querying
  },

  // store the picture URL
  image: {
    type: String,
    default: '' // Or you can set a default avatar path
  }
}, { timestamps: true }); // Adds createdAt and updatedAt timestamps

// Virtual field: confirmPassword is not saved to DB, just used for validation
UserSchema.virtual('confirmPassword')
  //avoid rewriting the callback function using an arrow function as it will not have the correct scope for 'this'
  .get(function () {
    return this._confirmPassword;
  })
  .set(function (value) {
    this._confirmPassword = value;
  });



// Middleware to check that password and confirmPassword match
UserSchema.pre('validate', function(next) {
    if (this.password !== this.confirmPassword) {
      this.invalidate('confirmPassword', 'Password must match confirm password');
    }
    next();
  });
  
  

// Middleware to hash the password before saving it to the DB
UserSchema.pre('save', async function (next) {
  try {
    // Hash the password with a salt round of 10
    this.password = await bcrypt.hash(this.password, 10);
    next();
  } catch (err) {
    next(err); // Pass any error to Mongoose
  }
});

// Export the model
const User = model('User', UserSchema);
export default User;
