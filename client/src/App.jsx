import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Register from './components/Register';
import Home from './components/Home';
import LikeStatus from './components/LikeStatus';
import UserProfile from './components/UserProfile';
import PrivateRoute from './components/PrivateRoute';
import { AuthProvider } from './context/AuthContext';
import EditProfile from './components/EditProfile';


function App() {
  return (
    <AuthProvider>
      <>
        <ToastContainer position="top-right" autoClose={3000} />
        <Routes>
          <Route path="/" element={<Register />} />
          <Route path="/home" element={<PrivateRoute><Home /></PrivateRoute>} />
          <Route path="/ideas/:id/likes" element={<PrivateRoute><LikeStatus /></PrivateRoute>} />
          <Route path="/users/:id" element={<PrivateRoute><UserProfile /></PrivateRoute>} />
          <Route path="/profile" element={<PrivateRoute><EditProfile /></PrivateRoute>} />
          <Route path="*" element={<h2 className="text-center mt-5">404 - Page Not Found</h2>} />
        </Routes>
      </>
    </AuthProvider>
  );
}

export default App;
