import { useState } from 'react'
import Register from './components/Register'
import { Routes, Route } from 'react-router-dom' 
import Home from './components/Home'
import { AuthProvider } from './context/AuthContext'
import PrivateRoute from './components/PrivateRoute'
import LikeStatus from './components/LikeStatus'
import AuthForm from './components/AuthForm'


function App() {
  
  return (
    <AuthProvider>
      <Routes>
        <Route path="/b" element={<AuthForm />} />
        <Route path="/" element={<Register />} />
        <Route path="/ideas/:id/likes" element={<PrivateRoute><LikeStatus/></PrivateRoute>} />
        <Route path="/home" element={<PrivateRoute><Home /></PrivateRoute>} />
      </Routes>
    </AuthProvider>
  )
}

export default App
