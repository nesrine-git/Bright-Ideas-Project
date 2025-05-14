import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import userService from '../services/userService';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import Navbar from './Navbar';

const EditProfile = () => {
  const { user, setUser } = useAuth();
  const { theme, toggleTheme } = useTheme(); // Access theme and toggleTheme
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    alias: '',
    email: '',
    profilePicture: null,
  });

  const [preview, setPreview] = useState(null);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        alias: user.alias || '',
        email: user.email || '',
        profilePicture: null, // Initially no profile picture selected
      });
      setPreview(user.profilePictureUrl || null); // Set the preview to the current picture
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === 'profilePicture') {
      const file = files[0];

      if (file) {
        if (preview && preview.startsWith('blob:')) {
          URL.revokeObjectURL(preview);
        }

        setFormData((prev) => ({ ...prev, profilePicture: file }));
        setPreview(URL.createObjectURL(file));
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('name', formData.name);
    data.append('alias', formData.alias);
    data.append('email', formData.email);
    if (formData.profilePicture) {
      data.append('profilePicture', formData.profilePicture);
    }

    try {
      const updatedUser = await userService.updateProfile(data);
      setUser(updatedUser);
      setPreview(updatedUser.profilePictureUrl || preview);
      toast.success('✅ Profile updated successfully');
      navigate('/profile');
    } catch (err) {
      console.error(err);
      toast.error('❌ Failed to update profile');
    }
  };

  const handleCancel = () => {
    if (preview && preview.startsWith('blob:')) {
      URL.revokeObjectURL(preview); // Clean up new preview blob
    }

    setFormData({
      name: user.name || '',
      alias: user.alias || '',
      email: user.email || '',
      profilePicture: null,
    });

    setPreview(user.profilePictureUrl || null); // Reset preview to original
  };

  return (
    <div className={theme.mode === 'dark' ? 'dark' : ''}> {/* Conditionally apply dark mode */}
      <Navbar />
      <div className={`min-h-screen ${theme.background} transition-all`}>
        <div className={`container mx-auto p-6 ${theme.text}`}>

          <form onSubmit={handleSubmit} encType="multipart/form-data">
            <div className="flex items-center gap-4 mb-6">
              {/* Profile Picture */}
              {user.image ? (
                  <img
                    src={`http://localhost:3000/uploads/${user.image}`}
                    alt="profile"
                    className="w-16 h-16 rounded-full border-2 border-gray-300"
                  />
                ) : (
                  <div className="rounded-full bg-gray-400 text-white flex justify-center items-center w-9 h-9">
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                )}
              
              <h2 className={`text-2xl font-semibold ${theme.text}`}>
                {user.alias}'s Profile
              </h2>
            </div>

            <div className="mb-4">
              <label className={`block text-lg ${theme.text}`}>Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full px-4 py-2 mt-2 border ${theme.border} rounded-md focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white`}
              />
            </div>

            <div className="mb-4">
              <label className={`block text-lg ${theme.text}`}>Alias</label>
              <input
                type="text"
                name="alias"
                value={formData.alias}
                onChange={handleChange}
                className={`w-full px-4 py-2 mt-2 border ${theme.border} rounded-md focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white`}
              />
            </div>

            <div className="mb-4">
              <label className={`block text-lg ${theme.text}`}>Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-4 py-2 mt-2 border ${theme.border} rounded-md focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white`}
              />
            </div>

            <div className="mb-4">
              <label className={`block text-lg ${theme.text}`}>Profile Picture (optional)</label>
              <input
                type="file"
                name="profilePicture"
                onChange={handleChange}
                accept="image/*"
                className="w-full mt-2 text-sm file:border file:rounded-md file:bg-blue-500 file:text-white file:px-4 file:py-2 dark:bg-gray-800 dark:text-white"
              />
            </div>

            <div className="flex gap-4 mt-6">
              <button
                type="submit"
                className={`px-6 py-2 ${theme.buttonBg} text-white rounded-md hover:bg-blue-600`}
              >
                Save
              </button>
              <button
                type="button"
                className="px-6 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
                onClick={handleCancel}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
