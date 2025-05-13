import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import userService from '../services/userService';

const Register = () => {
  const [isLogin, setIsLogin] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    alias: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [formErrors, setFormErrors] = useState({
    name: "Name is required",
    alias: "Alias is required!",
    email: "Email is required",
    password: "Password is required",
    confirmPassword: "Please confirm your password"
  });
  const [enteredForm, setEnteredForm] = useState(false);
  const [user, setUser] = useState(null);
  const nav = useNavigate();

  const validateForm = () => Object.values(formErrors).every(v => v === '');

  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;
    const val = value.trim();

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));

    let errorMsg = '';
    if (name === 'name') {
      if (val === '') errorMsg = 'Name is required';
      else if (val.length < 2) errorMsg = 'Name must be at least 2 characters';
      else if (val.length > 30) errorMsg = 'Name must be at most 30 characters';
    }

    if (name === 'alias') {
      if (val === '') errorMsg = 'Alias is required';
      else if (val.length < 2) errorMsg = 'Alias must be at least 2 characters';
      else if (val.length > 15) errorMsg = 'Alias must be at most 15 characters';
    }

    if (name === 'email') {
      if (val === '') errorMsg = 'Email is required';
      else if (!/^([\w-.]+@([\w-]+\.)+[\w-]+)?$/.test(val)) errorMsg = 'Enter a valid email';
    }

    if (name === 'password') {
      if (val === '') errorMsg = 'Password is required';
      else if (val.length < 8) errorMsg = 'Password must be at least 8 characters';
      else if (val.length > 128) errorMsg = 'Password must be at most 128 characters';
    }

    if (name === 'confirmPassword') {
      if (val === '') errorMsg = 'Please confirm your password';
      else if (val !== formData.password) errorMsg = 'Passwords do not match';
    }

    setFormErrors((prev) => ({ ...prev, [name]: errorMsg }));
    setErrors((prev) => ({ ...prev, [name]: null }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setEnteredForm(true);

    const authAction = isLogin
      ? userService.login(formData)
      : userService.register(formData);

    authAction
      .then((res) => {
        setUser(res.data);
        nav('/home');
      })
      .catch((err) => {
        setErrors(err?.response?.data || { message: 'Unknown error' });
      });
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{
        backgroundImage: 'url("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR1AWJnlcIHpCv8NFjgBJxacwwSv5fPW5peAw&s")', 
      }}
    >
      <div className="bg-white bg-opacity-90 backdrop-blur-md p-8 rounded-xl shadow-lg w-full max-w-md">
        <h1 className="text-4xl font-bold text-indigo-700 text-center mb-1">Bright Ideas+</h1>
        <p className="text-center text-gray-600 italic mb-6">"Where creativity meets action."</p>

        <h2 className="text-2xl font-semibold text-center mb-6">{isLogin ? 'Login' : 'Register'}</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <>
              <div>
                <input
                  type="text"
                  name="name"
                  placeholder="Name"
                  value={formData.name}
                  onChange={handleChange}
                  onClick={() => setEnteredForm(true)}
                  className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-indigo-400"
                />
                {formErrors.name && enteredForm && <p className="text-red-500 text-sm">{formErrors.name}</p>}
                {errors.validations?.name && <p className="text-red-500 text-sm">{errors.validations.name}</p>}
              </div>

              <div>
                <input
                  type="text"
                  name="alias"
                  placeholder="Alias"
                  value={formData.alias}
                  onChange={handleChange}
                  onClick={() => setEnteredForm(true)}
                  className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-indigo-400"
                />
                {formErrors.alias && enteredForm && <p className="text-red-500 text-sm">{formErrors.alias}</p>}
                {errors.validations?.alias && <p className="text-red-500 text-sm">{errors.validations.alias}</p>}
              </div>
            </>
          )}

          <div>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              onClick={() => setEnteredForm(true)}
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-indigo-400"
            />
            {formErrors.email && enteredForm && <p className="text-red-500 text-sm">{formErrors.email}</p>}
            {errors.validations?.email && <p className="text-red-500 text-sm">{errors.validations.email}</p>}
          </div>

          <div>
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              onClick={() => setEnteredForm(true)}
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-indigo-400"
            />
            {formErrors.password && enteredForm && <p className="text-red-500 text-sm">{formErrors.password}</p>}
            {errors.validations?.password && <p className="text-red-500 text-sm">{errors.validations.password}</p>}
          </div>

          {!isLogin && (
            <div>
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
                onClick={() => setEnteredForm(true)}
                className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-indigo-400"
              />
              {formErrors.confirmPassword && enteredForm && (
                <p className="text-red-500 text-sm">{formErrors.confirmPassword}</p>
              )}
              {errors.validations?.confirmPassword && (
                <p className="text-red-500 text-sm">{errors.validations.confirmPassword}</p>
              )}
            </div>
          )}

          <button
            type="submit"
            disabled={!isLogin && !validateForm()}
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
      </div>
    </div>
  );
};

export default Register;
