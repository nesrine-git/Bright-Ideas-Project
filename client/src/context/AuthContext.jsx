import { createContext, useState, useEffect, useContext } from 'react';
import userService from '../services/userService';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); 
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const res = await userService.getCurrentUser();
        setUser(res.data); // Adjust based on actual structure: { success, data, message }
      } catch (err) {
        console.error('🔐 Auth error:', err.message || err);
        setUser(false); // `false` = not authenticated
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// Optional helper to use context more cleanly in components
export const useAuth = () => useContext(AuthContext);
