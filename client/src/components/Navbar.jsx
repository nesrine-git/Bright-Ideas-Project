import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import userService from '../services/userService';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const { user, setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  // navigate to home
  const goHome = () => {
    navigate('/home');
  };

  // navigate to profile
  const goToProfile = () => {
    navigate('/profile');
  };

  // handle logout
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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        {/* App Title + Home */}
        <div style={{ cursor: 'pointer' }} onClick={goHome}>
          <strong>Bright Ideas+</strong>
        </div>

        {/* Right Side */}
        <div>
          {user && typeof user === 'object' ? (
            <div className="d-flex align-items-center gap-4">
              {/* Profile Section */}
              <div
                className="d-flex align-items-center gap-2"
                style={{ cursor: 'pointer' }}
                onClick={goToProfile}
              >
                {/* Picture */}
                {user.profilePictureUrl ? (
                  <img
                  src={`http://localhost:3000/uploads/${user.image}`}
                  alt="profile"
                  className="rounded-circle"
                  style={{ width: '30px', height: '30px', borderRadius: '50%', marginRight: '10px' }}
                />
                ) : (
                  <div
                    className="rounded-circle bg-secondary text-white d-flex justify-content-center align-items-center"
                    style={{ width: '40px', height: '40px' }}
                  >
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                )}

                {/* Name */}
                <span className="text-primary fw-bold">
                  {user.alias || user.name}
                </span>
              </div>

              {/* Logout */}
              <span
                onClick={handleLogout}
                className="text-white fw-bold"
                style={{ cursor: 'pointer' }}
              >
                Logout
              </span>
            </div>
          ) : (
            <span>Please log in</span>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
