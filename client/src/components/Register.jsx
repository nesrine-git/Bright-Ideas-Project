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

    // Debugging: Log the form data before sending to API
    console.log("Submitting form data:", formData);

    const authAction = isLogin
      ? userService.login(formData)
      : userService.register(formData);

    authAction      
      .then((res) => {
        console.log("User data:", res.data);
        setUser(res.data);
        nav('/home');
      })
      .catch((err) => {
        console.error('Auth error:', err);

        // Debugging: Log the error response
        console.log("Error response:", err?.response?.data);

        setErrors(err?.response?.data || { message: 'Unknown error' });
      });
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h2 className="card-title text-center">{isLogin ? 'Login' : 'Register'}</h2>
              <form onSubmit={handleSubmit}>
                {!isLogin && (
                  <>
                    <div className="mb-3">
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        className="form-control"
                        placeholder="Name"
                        onChange={handleChange}
                        onClick={() => setEnteredForm(true)}
                      />
                      {formErrors.name && enteredForm && <div className="text-danger small">{formErrors.name}</div>}
                      {errors.validations?.name && <div className="text-danger small">{errors.validations.name}</div>}
                    </div>

                    <div className="mb-3">
                      <input
                        type="text"
                        name="alias"
                        value={formData.alias}
                        className="form-control"
                        placeholder="Alias"
                        onChange={handleChange}
                        onClick={() => setEnteredForm(true)}
                      />
                      {formErrors.alias && enteredForm && <div className="text-danger small">{formErrors.alias}</div>}
                      {errors.validations?.alias && <div className="text-danger small">{errors.validations.alias}</div>}
                    </div>
                  </>
                )}

                <div className="mb-3">
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    className="form-control"
                    placeholder="Email"
                    onChange={handleChange}
                    onClick={() => setEnteredForm(true)}
                  />
                  {formErrors.email && enteredForm && <div className="text-danger small">{formErrors.email}</div>}
                  {errors.validations?.email && <div className="text-danger small">{errors.validations.email}</div>}
                </div>

                <div className="mb-3">
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    className="form-control"
                    placeholder="Password"
                    onChange={handleChange}
                    onClick={() => setEnteredForm(true)}
                  />
                  {formErrors.password && enteredForm && <div className="text-danger small">{formErrors.password}</div>}
                  {errors.validations?.password && <div className="text-danger small">{errors.validations.password}</div>}
                </div>

                {!isLogin && (
                  <div className="mb-3">
                    <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      className="form-control"
                      placeholder="Confirm Password"
                      onChange={handleChange}
                      onClick={() => setEnteredForm(true)}
                    />
                    {formErrors.confirmPassword && enteredForm && <div className="text-danger small">{formErrors.confirmPassword}</div>}
                    {errors.validations?.confirmPassword && <div className="text-danger small">{errors.validations.confirmPassword}</div>}
                  </div>
                )}

                <button
                  type="submit"
                  className="btn btn-primary w-100"
                  disabled={!isLogin && !validateForm()}
                >
                  {isLogin ? 'Login' : 'Register'}
                </button>
              </form>

              <p className="mt-3 text-center">
                {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
                <button className="btn btn-link p-0" onClick={() => setIsLogin(!isLogin)}>
                  {isLogin ? 'Register' : 'Login'}
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
