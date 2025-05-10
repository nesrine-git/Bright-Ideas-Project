import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ideaService from '../services/ideaService';
import userService from '../services/userService';
import Navbar from './Navbar';
import IdeaForm from './IdeaForm';
import IdeaList from './IdeaList';

const Home = () => {
    const [formData, setFormData] = useState({ title: '', content: '', emotionalContext: '' });
    const [formErrors, setFormErrors] = useState({ title: 'Title is required', content: 'Content is required', emotionalContext: '' });
    const [errors, setErrors] = useState({});
    const [enteredForm, setEnteredForm] = useState(false);
    const [ideas, setIdeas] = useState([]);
    const [userId, setUserId] = useState(null); // State to store the userId

    const nav = useNavigate();

    useEffect(() => {
        fetchIdeas();
        fetchUserId(); // Fetch the user ID when the component mounts
    }, []);

    // Fetch user ID
    const fetchUserId = async () => {
        try {
            const user = await userService.getCurrentUser();
            console.log('Fetched user:', user); // Log the user object
            setUserId(user.data._id); // Set the userId to state
            console.log('Fetched user:',user._id);
        } catch (err) {
            console.error("Error fetching user:", err);
            nav('/');
        }
    };

    // Fetch all ideas
    const fetchIdeas = async () => {
        try {
            const res = await ideaService.getAll();
            setIdeas(res.data);
        } catch (err) {
            if (err.response?.status === 401) nav('/');
        }
    };

    const validateForm = () => Object.values(formErrors).every(error => error === '');

    const handleChange = (e) => {
        const { name, value } = e.target;
        const trimmed = value.trim();

        setFormData(prev => ({ ...prev, [name]: value }));

        let error = '';
        if (name === 'title') {
            if (!trimmed) error = 'Title is required';
            else if (trimmed.length < 5) error = 'Title must be at least 5 characters';
        }
        if (name === 'content') {
            if (!trimmed) error = 'Content is required';
            else if (trimmed.length < 25) error = 'Content must be at least 25 characters';
        }

        setFormErrors(prev => ({ ...prev, [name]: error }));
        setErrors(prev => ({ ...prev, [name]: null }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setEnteredForm(true);
        if (!validateForm()) return;

        try {
            await ideaService.create(formData);
            setFormData({ title: '', content: '', emotionalContext: '' });
            setFormErrors({ title: 'Title is required', content: 'Content is required', emotionalContext: '' });
            setEnteredForm(false);
            fetchIdeas();
        } catch (err) {
            setErrors(err.response?.data || { message: 'Something went wrong' });
        }
    };

    const handleLike = async (ideaId) => {
        try {
          const updatedIdea = await ideaService.toggleLike(ideaId);
          console.log('updatedIdea:', updatedIdea); // Check what it returns
          setIdeas(prev =>
            prev.map(idea =>
              idea._id === ideaId ? updatedIdea : idea
            )
          );
        } catch (err) {
          console.error('Like failed', err);
        }
      };
      const handleDelete = (id) => {
        ideaService.delete(id)
          .then(() => {
            setIdeas((prev) => prev.filter((idea) => idea._id !== id));
          })
          .catch((err) => console.error('❌ Delete failed:', err.response?.data || err.message));
      };
      

    if (!userId) return <div>Loading...</div>; // Return loading state if userId is not yet fetched

    return (
        <div className="container">
            <Navbar />
            <h1 className="text-center mb-4">💡 Welcome to the Idea Board</h1>
            
            <IdeaForm 
                formData={formData}
                formErrors={formErrors}
                errors={errors}
                enteredForm={enteredForm}
                handleChange={handleChange}
                handleSubmit={handleSubmit}
            />

            <IdeaList 
                ideas={ideas}
                userId={userId} // Pass userId once it's fetched
                onLikeToggle={handleLike}
                onDelete={handleDelete}
            />
        </div>
    );
};

export default Home;
