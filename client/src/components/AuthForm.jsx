import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import userService from '../services/userService';

const AuthForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    alias: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState({});
  const [entered, setEntered] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));

    // Basic validation
    let err = '';
    if (!value.trim()) {
      err = `${name[0].toUpperCase() + name.slice(1)} is required`;
    } else if (name === 'password' && value.length < 8) {
      err = 'Password must be at least 8 characters';
    } else if (name === 'confirmPassword' && value !== formData.password) {
      err = 'Passwords do not match';
    }

    setErrors((prev) => ({ ...prev, [name]: err }));
  };
  console.log("Submitting formData:", formData);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setEntered(true);

    try {
      const res = await userService.register(formData);
      console.log('Registered user:', res.data);
      navigate('/home');
    } catch (err) {
      console.error('Register error:', err);
      setErrors(err?.response?.data || { message: 'Registration failed' });
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <form className="card p-4 shadow" onSubmit={handleSubmit}>
            <h2 className="text-center mb-4">Register</h2>

            <input
              type="text"
              name="name"
              className="form-control mb-2"
              placeholder="Name"
              value={formData.name}
              onChange={handleChange}
            />
            {entered && errors.name && <small className="text-danger">{errors.name}</small>}

            <input
              type="text"
              name="alias"
              className="form-control mb-2"
              placeholder="Alias"
              value={formData.alias}
              onChange={handleChange}
            />
            {entered && errors.alias && <small className="text-danger">{errors.alias}</small>}

            <input
              type="email"
              name="email"
              className="form-control mb-2"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
            />
            {entered && errors.email && <small className="text-danger">{errors.email}</small>}

            <input
              type="password"
              name="password"
              className="form-control mb-2"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
            />
            {entered && errors.password && <small className="text-danger">{errors.password}</small>}

            <input
              type="password"
              name="confirmPassword"
              className="form-control mb-2"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
            {entered && errors.confirmPassword && (
              <small className="text-danger">{errors.confirmPassword}</small>
            )}

            <button type="submit" className="btn btn-primary w-100 mt-3">
              Register
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
