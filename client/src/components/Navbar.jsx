import React, { useContext, useEffect, useRef, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import userService from '../services/userService';
import notificationService from '../services/notificationService';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

const Navbar = () => {
  const { user, setUser } = useContext(AuthContext);
  const {
    notifications = [],
    unreadCount,
    markAllAsRead,
    markAsRead,
    deleteNotification
  } = useNotifications();
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
    setShowDropdown((prev) => !prev);
    // We don't mark all as read here anymore.
  };

  const handleBellKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleDropdown();
    }
  };

  const handleNotificationClick = async (id, read) => {
  if (!read) {
    try {
      await markAsRead(id);
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  }
};

  const handleDelete = (id) => {
      deleteNotification(id);
  };

  return (
    <nav
      className="p-4 shadow-md"
      style={{
        backgroundColor: theme.colors?.cardBg,
        borderBottom: `1px solid ${theme.colors?.border}`,
      }}
    >
      <div className="flex flex-wrap justify-between items-center max-w-7xl mx-auto">
        {/* Logo */}
        <div
          onClick={goHome}
          className="text-2xl font-bold cursor-pointer transition duration-300"
          style={{ color: theme.colors?.linkText }}
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter') goHome();
          }}
          aria-label="Go to home"
        >
          Bright Ideas+
        </div>

        <div className="flex flex-wrap items-center gap-4 mt-2 sm:mt-0">
          {user && typeof user === 'object' ? (
            <div className="flex flex-wrap items-center gap-4 w-full sm:w-auto">
              {/* Notification Bell */}
              <div
                ref={bellRef}
                style={{ position: 'relative' }}
                tabIndex={0}
                role="button"
                aria-haspopup="true"
                aria-expanded={showDropdown}
                onClick={toggleDropdown}
                onKeyDown={handleBellKeyDown}
                title="Notifications"
              >
                <span
                  className="text-xl cursor-pointer transition duration-300"
                  style={{ color: theme.colors?.linkText }}
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
                    className="absolute top-10 right-0 p-3 rounded-xl shadow-lg z-50"
                    style={{
                      width: '300px',
                      maxHeight: '300px',
                      overflowY: 'auto',
                      backgroundColor: theme.colors?.cardBg,
                      border: `1px solid ${theme.colors?.border}`,
                      color: theme.colors?.text,
                    }}
                  >
                    <strong>Notifications</strong>
                    <hr
                      className="my-1"
                      style={{ borderColor: theme.colors?.border }}
                    />
                    {Array.isArray(notifications) && notifications.length === 0 ? (
                      <p style={{ color: theme.colors?.text }} className="text-sm">
                        No notifications
                      </p>
                    ) : (
                      Array.isArray(notifications) &&
                      notifications.map((n) => (
                        <div
                          key={n._id}
                          title={n.idea?.content || ''}
                          className={`mb-2 text-sm flex justify-between items-start gap-2 cursor-pointer ${
                            n.read ? 'font-normal' : 'font-bold'
                          }`}
                          style={{ color: theme.colors?.text }}
                          onClick={() => handleNotificationClick(n._id, n.read)}
                          role="button"
                          tabIndex={0}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault();
                              handleNotificationClick(n._id, n.read);
                            }
                          }}
                        >
                          <div className="flex-1">
                            {n.sender?.alias || 'Someone'}{' '}
                            {n.type === 'supports' ? 'supports' : 'commented on'} your idea:{' '}
                            <em>{n.idea?.content?.slice(0, 30)}...</em>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(n._id);
                            }}
                            title="Delete notification"
                            className="ml-2 text-xs text-red-500 hover:text-red-700 transition"
                            aria-label="Delete notification"
                          >
                            ✕
                          </button>
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
                tabIndex={0}
                role="button"
                aria-label="Go to profile"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') goToProfile();
                }}
              >
                {user.image ? (
                  <img
                    src={`http://localhost:3000/uploads/${user.image}`}
                    alt="profile"
                    className="rounded-full w-9 h-9 flex-shrink-0"
                  />
                ) : (
                  <div
                    className="rounded-full bg-gray-400 text-white flex justify-center items-center w-9 h-9 flex-shrink-0"
                    style={{ color: 'white' }}
                  >
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                )}

                <span
                  className="text-lg font-semibold truncate max-w-xs transition duration-300"
                  title={user.alias || user.name}
                  style={{ color: theme.colors?.linkText }}
                >
                  {user.alias || user.name}
                </span>
              </div>

              {/* Logout */}
              <span
                onClick={handleLogout}
                className="font-bold cursor-pointer transition duration-300"
                style={{ color: theme.colors?.linkText }}
                onMouseEnter={(e) => (e.target.style.color = '#B45309')}
                onMouseLeave={(e) =>
                  (e.target.style.color = theme.colors?.linkText)
                }
                tabIndex={0}
                role="button"
                aria-label="Logout"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') handleLogout();
                }}
              >
                Logout
              </span>
            </div>
          ) : (
            <span style={{ color: theme.colors?.text }}>Please log in</span>
          )}

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="ml-4 p-2 rounded-full transition duration-300"
            style={{
              backgroundColor: theme.colors?.buttonBg,
              color: theme.colors?.buttonText || theme.colors?.text,
              border: 'none',
            }}
            onMouseEnter={(e) => {
              if (theme.mode === 'light') {
                e.target.style.backgroundColor = '#B45309';
                e.target.style.color = '#FFF';
              } else {
                e.target.style.backgroundColor = 'rgba(255,255,255,0.1)';
                e.target.style.color = '#FFF';
              }
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = theme.colors?.buttonBg;
              e.target.style.color =
                theme.colors?.buttonText || theme.colors?.text;
            }}
            aria-label="Toggle Theme"
          >
            {theme.mode === 'dark' ? '🌙' : '☀️'}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
