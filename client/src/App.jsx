import Register from './components/Register'
import { Routes, Route } from 'react-router-dom' 
import Home from './components/Home'
import { AuthProvider } from './context/AuthContext'
import PrivateRoute from './components/PrivateRoute'
import LikeStatus from './components/LikeStatus'
import UserProfile from './components/UserProfile'

function App() {
  
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Register />} />
        <Route path="/home" element={<PrivateRoute><Home /></PrivateRoute>} />
        <Route path="/ideas/:id/likes" element={<PrivateRoute><LikeStatus/></PrivateRoute>} />
        <Route path="/users/:id" element={<PrivateRoute><UserProfile /></PrivateRoute>} />
      </Routes>
    </AuthProvider>
  )
}

export default App
