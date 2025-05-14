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
    const [userId, setUserId] = useState(null);

    const nav = useNavigate();

    useEffect(() => {
        fetchUserId();
        fetchIdeas();
    }, []);

    const fetchUserId = async () => {
        try {
            const user = await userService.getCurrentUser();
            setUserId(user.data._id);
        } catch (err) {
            console.error("Error fetching user:", err);
            nav('/');
        }
    };

    const fetchIdeas = async () => {
        try {
            const res = await ideaService.getAll();
            setIdeas(res.data);
        } catch (err) {
            if (err.response?.status === 401) nav('/');
            else console.error("Failed to fetch ideas:", err);
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

    const handleDelete = (id) => {
        ideaService.delete(id)
            .then(() => {
                setIdeas(prev => prev.filter(idea => idea._id !== id));
            })
            .catch(err => console.error('❌ Delete failed:', err.response?.data || err.message));
    };

    const handleUpdate = async (id, updatedData) => {
        try {
            const updated = await ideaService.update(id, updatedData);
            setIdeas(prev => prev.map(idea => idea._id === id ? updated : idea));
            return updated;
        } catch (err) {
            console.error('❌ Update failed:', err);
            throw err;
        }
    };

    const toggleReaction = async (id, type) => {
        const serviceFn = type === 'support' ? ideaService.toggleSupport : ideaService.toggleInspiration;
        const field = type === 'support' ? 'supports' : 'inspiring';

        try {
            await serviceFn(id);
            setIdeas(prevIdeas =>
                prevIdeas.map(idea => {
                    if (idea._id !== id) return idea;

                    const currentList = Array.isArray(idea[field]) ? idea[field] : [];
                    const alreadyReacted = currentList.includes(userId);
                    const updatedList = alreadyReacted
                        ? currentList.filter(uid => uid !== userId)
                        : [...currentList, userId];

                    return { ...idea, [field]: updatedList };
                })
            );
        } catch (err) {
            console.error(`Error toggling ${type}:`, err);
        }
    };

    const handleSupportToggle = (id) => toggleReaction(id, 'support');
    const handleInspireToggle = (id) => toggleReaction(id, 'inspire');

    if (!userId) return <div className="text-center mt-5">Loading...</div>;

    return (
        <div>
            <Navbar />
            <div className="container mt-6">

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
                    userId={userId}
                    onSupportToggle={handleSupportToggle}
                    onInspireToggle={handleInspireToggle}
                    onDelete={handleDelete}
                    onUpdate={handleUpdate}
                />
            </div>
        </div>
    );
};

export default Home;
