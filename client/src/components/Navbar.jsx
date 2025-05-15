import React, { useContext, useEffect, useRef, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import userService from '../services/userService';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

const Navbar = () => {
  const { user, setUser } = useContext(AuthContext);
  const { notifications, unreadCount, markAllAsRead } = useNotification();
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const bellRef = useRef(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const { theme, toggleTheme } = useTheme();

  const goHome = () => navigate('/home');
  const goToProfile = () => navigate('/profile');

  const handleLogout = async () => {
    try {
      await userService.logout();
      setUser(null);
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
    <nav className={`p-4 shadow-md ${theme.cardBg} ${theme.border}`}>
      <div className="flex flex-wrap justify-between items-center max-w-7xl mx-auto">
        {/* Logo */}
        <div
          onClick={goHome}
          className={`text-2xl font-bold cursor-pointer ${theme.linkText} hover:text-primary transition duration-300`}
        >
          Bright Ideas+
        </div>

        <div className="flex flex-wrap items-center gap-4 mt-2 sm:mt-0">
          {user && typeof user === 'object' ? (
            <div className="flex flex-wrap items-center gap-4 w-full sm:w-auto">
              {/* Notification Bell */}
              <div ref={bellRef} style={{ position: 'relative' }}>
                <span
                  onClick={toggleDropdown}
                  title="Notifications"
                  className={`text-xl cursor-pointer ${theme.linkText} hover:text-primary transition duration-300`}
                >
                  🔔
                </span>
                {unreadCount > 0 && (
                  <span
                    style={{
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
                      justifyContent: 'center',
                    }}
                  >
                    {unreadCount}
                  </span>
                )}

                {/* Dropdown */}
                {showDropdown && (
                  <div
                    ref={dropdownRef}
                    className={`absolute top-10 right-0 bg-white p-3 rounded-xl shadow-lg ${theme.cardBg} ${theme.border} z-50`}
                    style={{ width: '300px', maxHeight: '300px', overflowY: 'auto' }}
                  >
                    <strong>Notifications</strong>
                    <hr />
                    {notifications.length === 0 ? (
                      <p className="text-gray-500">No notifications</p>
                    ) : (
                      notifications.map((n) => (
                        <div
                          key={n._id}
                          title={n.idea?.content || ''}
                          className={`font-semibold ${n.read ? 'font-normal' : 'font-bold'} mb-2 text-sm`}
                        >
                          {n.sender?.username || 'Someone'} {n.type === 'like' ? 'liked' : 'commented on'} your idea:{' '}
                          <em>{n.idea?.content?.slice(0, 30)}...</em>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>

              {/* Profile Section */}
              <div
                className="flex items-center gap-2 cursor-pointer min-w-0"
                onClick={goToProfile}
              >
                {user.image ? (
                  <img
                    src={`http://localhost:3000/uploads/${user.image}`}
                    alt="profile"
                    className="rounded-full w-9 h-9 flex-shrink-0"
                  />
                ) : (
                  <div className="rounded-full bg-gray-400 text-white flex justify-center items-center w-9 h-9 flex-shrink-0">
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                )}

                <span
                  className={`text-lg font-semibold truncate max-w-xs ${theme.linkText} hover:text-primary transition duration-300`}
                  title={user.alias || user.name}
                >
                  {user.alias || user.name}
                </span>
              </div>

              {/* Logout Button */}
              <span
                onClick={handleLogout}
                className={`font-bold cursor-pointer ${theme.linkText} hover:text-primary transition duration-300`}
              >
                Logout
              </span>
            </div>
          ) : (
            <span className={`text-white ${theme.linkText}`}>Please log in</span>
          )}

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className={`ml-4 p-2 rounded-full ${theme.buttonBg} ${theme.textColor} hover:bg-primary hover:text-white transition duration-300`}
          >
            {theme.mode === 'dark' ? '🌙' : '☀️'}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
