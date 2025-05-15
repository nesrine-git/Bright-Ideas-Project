import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Toaster, toast } from 'react-hot-toast';
import userService from '../services/userService';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [isLogin, setIsLogin] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    alias: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [serverErrors, setServerErrors] = useState({});
  const nav = useNavigate();
  const { setUser } = useAuth();

  const validateField = (name, value) => {
    const val = value.trim();
    if (name === 'name') {
      if (!val) return 'Name is required';
      if (val.length < 2) return 'Name must be at least 2 characters';
      if (val.length > 30) return 'Name must be at most 30 characters';
    }
    if (name === 'alias') {
      if (!val) return 'Alias is required';
      if (val.length < 2) return 'Alias must be at least 2 characters';
      if (val.length > 15) return 'Alias must be at most 15 characters';
    }
    if (name === 'email') {
      if (!val) return 'Email is required';
      if (!/^[\w-.]+@([\w-]+\.)+[\w-]+$/.test(val)) return 'Enter a valid email';
    }
    if (name === 'password') {
      if (!val) return 'Password is required';
      if (val.length < 8) return 'Password must be at least 8 characters';
      if (val.length > 128) return 'Password must be at most 128 characters';
    }
    if (name === 'confirmPassword') {
      if (!val) return 'Please confirm your password';
      if (val !== formData.password) return 'Passwords do not match';
    }
    return '';
  };

  const validateForm = () => {
    const errors = {};
    Object.keys(formData).forEach((key) => {
      if (!isLogin || key === 'email' || key === 'password') {
        const error = validateField(key, formData[key]);
        if (error) errors[key] = error;
      }
    });
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFormErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
    setServerErrors((prev) => ({ ...prev, [name]: null }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const action = isLogin ? userService.login : userService.register;
      const res = await action(formData);

      setUser(res); // ✅ Update AuthContext immediately
      toast.success(`${isLogin ? 'Logged in' : 'Registered'} successfully!`);
      nav('/home');
    } catch (err) {
      const data = err?.response?.data || { message: err.message || 'Unknown error' };
      setServerErrors(data.validations || { message: data.message });
      toast.error(data.message || 'Authentication failed');
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 bg-gray-100"
      style={{
        backgroundImage: 'url("https://images.pexels.com/photos/1129413/pexels-photo-1129413.jpeg?cs=srgb&dl=pexels-valeriya-1129413.jpg&fm=jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <Toaster position="top-center" />
      <motion.div
        key={isLogin ? 'login' : 'register'}
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -40 }}
        transition={{ duration: 0.4 }}
        className="bg-white bg-opacity-90 backdrop-blur-md p-8 rounded-xl shadow-lg w-full max-w-md"
      >
        <h1 className="text-4xl font-bold text-indigo-700 text-center mb-1">Bright Ideas+</h1>
        <p className="text-center text-gray-600 italic mb-6">"Where creativity meets action."</p>

        <h2 className="text-2xl font-semibold text-center mb-6">{isLogin ? 'Login' : 'Register'}</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <>
              <InputField name="name" value={formData.name} onChange={handleChange} placeholder="Name"
                error={formErrors.name} serverError={serverErrors.name} />

              <InputField name="alias" value={formData.alias} onChange={handleChange} placeholder="Alias"
                error={formErrors.alias} serverError={serverErrors.alias} />
            </>
          )}

          <InputField name="email" value={formData.email} onChange={handleChange} placeholder="Email" type="email"
            error={formErrors.email} serverError={serverErrors.email} />

          <InputField name="password" value={formData.password} onChange={handleChange} placeholder="Password" type="password"
            error={formErrors.password} serverError={serverErrors.password} />

          {!isLogin && (
            <InputField name="confirmPassword" value={formData.confirmPassword} onChange={handleChange}
              placeholder="Confirm Password" type="password"
              error={formErrors.confirmPassword} serverError={serverErrors.confirmPassword} />
          )}

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition duration-300"
          >
            {isLogin ? 'Login' : 'Register'}
          </button>
        </form>

        <p className="mt-4 text-center text-sm">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
          <button className="text-indigo-600 hover:underline" onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? 'Register' : 'Login'}
          </button>
        </p>
      </motion.div>
    </div>
  );
};

const InputField = ({ name, value, onChange, placeholder, type = "text", error, serverError }) => (
  <div>
    <input
      type={type}
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-indigo-400"
    />
    {(error || serverError) && (
      <p className="text-red-500 text-sm">{error || serverError}</p>
    )}
  </div>
);

export default Register;
