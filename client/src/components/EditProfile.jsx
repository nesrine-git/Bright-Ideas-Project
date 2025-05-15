import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import userService from '../services/userService';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import Navbar from './Navbar';

const EditProfile = () => {
  const { user, setUser } = useAuth();
  const { theme } = useTheme();
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
        profilePicture: null,
      });
      setPreview(user.profilePictureUrl || null);
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
      URL.revokeObjectURL(preview);
    }

    setFormData({
      name: user.name || '',
      alias: user.alias || '',
      email: user.email || '',
      profilePicture: null,
    });

    setPreview(user.profilePictureUrl || null);
  };

  return (
    <div className="min-h-screen transition-all" style={{ backgroundColor: theme.colors.cardBg }}>
      <Navbar />
      <div className="flex justify-center items-center min-h-screen p-6">
        <div
          className="p-8 rounded-lg shadow-xl w-full max-w-md"
          style={{
            backgroundColor: theme.colors.cardBg,
            border: `1px solid ${theme.colors.border}`,
          }}
        >
          <form onSubmit={handleSubmit} encType="multipart/form-data">
            <div className="flex items-center justify-center gap-4 mb-6">
              {user.image ? (
                <img
                  src={`http://localhost:3000/uploads/${user.image}`}
                  alt="profile"
                  className="w-16 h-16 rounded-full border-2"
                  style={{ borderColor: theme.colors.border }}
                />
              ) : (
                <div
                  className="rounded-full flex justify-center items-center w-16 h-16 text-white"
                  style={{
                    backgroundColor: theme.colors.border,
                  }}
                >
                  {user.name?.charAt(0).toUpperCase()}
                </div>
              )}
              <h2
                className="text-2xl font-semibold"
                style={{ color: theme.colors.text }}
              >
                {user.alias}'s Profile
              </h2>
            </div>

            {['name', 'alias', 'email'].map((field) => (
              <div className="mb-4" key={field}>
                <label
                  className="block text-lg"
                  style={{ color: theme.colors.text }}
                >
                  {field.charAt(0).toUpperCase() + field.slice(1)}
                </label>
                <input
                  type={field === 'email' ? 'email' : 'text'}
                  name={field}
                  value={formData[field]}
                  onChange={handleChange}
                  className="w-full px-4 py-2 mt-2 rounded-md focus:ring-2 focus:outline-none"
                  style={{
                    backgroundColor: theme.mode === 'dark' ? '#374151' : '#FFFFFF',
                    color: theme.colors.text,
                    border: `1px solid ${theme.colors.border}`,
                    outlineColor: theme.colors.linkText,
                  }}
                />
              </div>
            ))}

            <div className="mb-4">
              <label
                className="block text-lg"
                style={{ color: theme.colors.text }}
              >
                Profile Picture (optional)
              </label>
              <input
                type="file"
                name="profilePicture"
                onChange={handleChange}
                accept="image/*"
                className="w-full mt-2 text-sm file:px-4 file:py-2  file:border-0"
                style={{
                  color: theme.colors.text,
                  backgroundColor: theme.mode === 'dark' ? '#374151' : '#F9FAFB',
                }}
              />
            </div>

            <div className="flex gap-4 mt-6">
              <button
                type="submit"
                className="px-6 py-2 border-1 rounded-md text-white"
                style={{
                  backgroundColor: theme.colors.buttonBg,
                }}
              >
                Save
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="px-6 py-2 border-1 rounded-md text-white"
                style={{ backgroundColor: '#6B7280' }}
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
