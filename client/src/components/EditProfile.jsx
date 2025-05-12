import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import userService from '../services/userService';
import { useAuth } from '../context/AuthContext';
import Navbar from './Navbar';

const EditProfile = () => {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    alias: '',
    email: '',
    profilePicture: null,
  });

  const [preview, setPreview] = useState(null); // To show image preview

  // Clean up object URLs when component unmounts or new file selected
  useEffect(() => {
    return () => {
      if (preview && preview.startsWith('blob:')) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        alias: user.alias || '',
        email: user.email || '',
        profilePicture: null,
      });

      // Set the preview image to the current user's image URL or null
      setPreview(user.profilePictureUrl || null);
    }
  }, [user]);

  const handleChange = e => {
    const { name, value, files } = e.target;

    if (name === 'profilePicture') {
      const file = files[0];

      if (file) {
        if (preview && preview.startsWith('blob:')) {
          URL.revokeObjectURL(preview);
        }

        setFormData(prev => ({ ...prev, profilePicture: file }));
        setPreview(URL.createObjectURL(file));
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async e => {
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
  
  // handle cancel
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
    <>
      <Navbar />
      <form onSubmit={handleSubmit} className="container mt-4" encType="multipart/form-data">
        <div className="d-flex align-items-center gap-3">
          {/* Picture */}
          {preview ? (
            <img
              src={preview}
              alt="profile"
              className="rounded-circle"
              style={{ width: '70px', height: '70px', borderRadius: '50%' }}
            />
          ) : (
            <div
              className="rounded-circle bg-secondary text-white d-flex justify-content-center align-items-center"
              style={{ width: '40px', height: '40px' }}
            >
              {user.name?.charAt(0).toUpperCase()}
            </div>
          )}
          <h2>{user.alias}'s Profile</h2>
        </div>

        <div className="m-3">
          <label>Name</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} className="form-control" />
        </div>

        <div className="m-3">
          <label>Alias</label>
          <input type="text" name="alias" value={formData.alias} onChange={handleChange} className="form-control" />
        </div>

        <div className="m-3">
          <label>Email</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} className="form-control" />
        </div>

        <div className="m-3">
          <label>Profile Picture (optional)</label>
          <input type="file" name="profilePicture" onChange={handleChange} accept="image/*" className="form-control" />
          
        </div>
        <div className="d-flex gap-2 m-3">
          <button type="submit" className="btn btn-success">Save</button>
          <button type="button" className="btn btn-secondary" onClick={handleCancel}>Cancel</button>
        </div>

      </form>
    </>
  );
};

export default EditProfile;
