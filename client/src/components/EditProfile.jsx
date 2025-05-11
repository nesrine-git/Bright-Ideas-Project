import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
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

  const handleChange = e => {
    const { name, value, files } = e.target;
    if (name === 'profilePicture') {
      const file = files[0];
      setFormData({ ...formData, profilePicture: file });
      setPreview(URL.createObjectURL(file));
    } else {
      setFormData({ ...formData, [name]: value });
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
      setPreview(updatedUser.profilePictureUrl);
      toast.success('✅ Profile updated successfully');
      navigate('/profile');
    } catch (err) {
      console.error(err);
      toast.error('❌ Failed to update profile');
    }
  };
  

  return (
    <>
    <Navbar />
        
    <form onSubmit={handleSubmit} className="container mt-4" encType="multipart/form-data">
      <div className="d-flex align-items-center gap-2">
        {/* Picture */}
        {user.profilePictureUrl ? (
                  <img
                  src={`http://localhost:3000/uploads/${user.image}`}
                  alt="profile"
                  className="rounded-circle"
                  style={{ width: '45px', height: '45px', borderRadius: '50%', marginRight: '10px' }}
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
      

      <div className="mb-3">
        <label>Name</label>
        <input type="text" name="name" value={formData.name} onChange={handleChange} className="form-control" />
      </div>

      <div className="mb-3">
        <label>Alias</label>
        <input type="text" name="alias" value={formData.alias} onChange={handleChange} className="form-control" />
      </div>

      <div className="mb-3">
        <label>Email</label>
        <input type="email" name="email" value={formData.email} onChange={handleChange} className="form-control" />
      </div>

      <div className="mb-3">
        <label>Profile Picture (optional)</label>
        <input type="file" name="profilePicture" onChange={handleChange} accept="image/*" className="form-control" />
        <img src={preview} alt="Preview" className="mt-2" style={{ maxHeight: 100 }} />
      </div>

      <button type="submit" className="btn btn-primary">Save</button>
    </form>
    </>
  );
};

export default EditProfile;
