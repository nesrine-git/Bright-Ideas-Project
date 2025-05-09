import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import userService from '../services/userService';

const Navbar = () => {
  const { user, setUser } = useContext(AuthContext);

  const handleLogout = async () => {
    try {
      await userService.logout();
      setUser(false); // mark as unauthenticated
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  return (
    <nav style={{ padding: '1rem', backgroundColor: '#333', color: '#fff' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div><strong>Bright Ideas+</strong></div>
        <div>
          {user && typeof user === 'object' ? (
            <>
              <span style={{ marginRight: '1rem' }}>
                Welcome, {user.alias || user.name || 'User'}!
              </span>
              <button onClick={handleLogout} style={{ padding: '0.5rem 1rem' }}>
                Logout
              </button>
            </>
          ) : (
            <span>Please log in</span>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
