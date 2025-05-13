import React, { useContext, useEffect, useRef, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import userService from '../services/userService';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const { user, setUser } = useContext(AuthContext);
  const { notifications, unreadCount, markAllAsRead } = useNotification();
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const bellRef = useRef(null);
  const [showDropdown, setShowDropdown] = useState(false);

  const goHome = () => navigate('/home');
  const goToProfile = () => navigate('/profile');

  const handleLogout = async () => {
    try {
      await userService.logout();
      setUser(false);
      console.log('✅ User logged out successfully');
    } catch (err) {
      console.error('❌ Logout failed:', err);
    }
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target) &&
        !bellRef.current?.contains(e.target)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleDropdown = () => {
    const newState = !showDropdown;
    setShowDropdown(newState);
    if (newState) {
      markAllAsRead();
      console.log('✅ All notifications marked as read');
    }
  };

  return (
    <nav style={{ padding: '1rem', backgroundColor: '#333', color: '#fff' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ cursor: 'pointer' }} onClick={goHome}>
          <strong>Bright Ideas+</strong>
        </div>

        <div>
          {user && typeof user === 'object' ? (
            <div className="d-flex align-items-center gap-4">

              {/* Notification Bell */}
              <div style={{ position: 'relative', marginRight: '0.6rem' }} ref={bellRef}>
                <span
                  style={{ cursor: 'pointer', fontSize: '1.3rem' }}
                  onClick={toggleDropdown}
                  title="Notifications"
                >
              
                </span>

                {unreadCount > 0 && (
                  <span style={{
                    position: 'absolute',
                    top: '-5px',
                    right: '-5px',
                    backgroundColor: 'red',
                    color: 'white',
                    fontSize: '10px',
                    borderRadius: '50%',
                    width: '16px',
                    height: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {unreadCount}
                  </span>
                )}

                {showDropdown && (
                  <div
                    ref={dropdownRef}
                    style={{
                      position: 'absolute',
                      top: '2rem',
                      right: 0,
                      backgroundColor: 'white',
                      color: 'black',
                      padding: '1rem',
                      width: '300px',
                      maxHeight: '300px',
                      overflowY: 'auto',
                      boxShadow: '0 0 10px rgba(0,0,0,0.3)',
                      zIndex: 100,
                      borderRadius: '8px'
                    }}
                  >
                    <strong>Notifications</strong>
                    <hr />
                    {notifications.length === 0 ? (
                      <p>No notifications</p>
                    ) : (
                      notifications.map(n => (
                        <div
                          key={n._id}
                          title={n.idea?.content || ''}
                          style={{
                            fontWeight: n.read ? 'normal' : 'bold',
                            marginBottom: '0.5rem',
                            fontSize: '0.9rem'
                          }}
                        >
                          {n.sender?.username || 'Someone'} {n.type === 'like' ? 'liked' : 'commented on'} your idea: "<em>{n.idea?.content?.slice(0, 30)}...</em>"
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>

              {/* Profile Section */}
              <div
                className="d-flex align-items-center gap-1"
                style={{ cursor: 'pointer' }}
                onClick={goToProfile}
              >
                {user.image ? (
                  <img
                    src={`http://localhost:3000/uploads/${user.image}`}
                    alt="profile"
                    className="rounded-circle"
                    style={{ width: '35px', height: '35px', borderRadius: '50%' }}
                  />
                ) : (
                  <div
                    className="rounded-circle bg-secondary text-white d-flex justify-content-center align-items-center"
                    style={{ width: '40px', height: '40px' }}
                  >
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                )}

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
