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
    const [filter, setFilter] = useState('all');
    const [showCreateForm, setShowCreateForm] = useState(false);

    const nav = useNavigate();

    useEffect(() => {
        fetchUserId();
        fetchIdeas(filter);
    }, [filter]);

    const fetchUserId = async () => {
        try {
            const user = await userService.getCurrentUser();
            setUserId(user.data._id);
        } catch (err) {
            console.error("Error fetching user:", err);
            nav('/');
        }
    };

    const fetchIdeas = async (filter) => {
        try {
            let res;
            if (filter === 'mostSupported') {
                res = await ideaService.getMostSupported();
            } else if (filter === 'mostInspiring') {
                res = await ideaService.getMostInspiring();
            } else {
                res = await ideaService.getAll();
            }
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
            fetchIdeas(filter);
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

    const handleSupportToggle = (id) => toggleReaction(id, 'support');
    const handleInspireToggle = (id) => toggleReaction(id, 'inspire');

    const toggleReaction = async (id, type) => {
        const serviceFn = type === 'support' ? ideaService.toggleSupport : ideaService.toggleInspiration;
        const field = type === 'support' ? 'supports' : 'inspirations';

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

    const handleFilterChange = (newFilter) => {
        setFilter(newFilter);
    };

    const toggleCreateForm = () => {
        setShowCreateForm(!showCreateForm);
    };

    if (!userId) return <div className="text-center mt-5">Loading...</div>;

    return (
        <div>
            <Navbar />
            <div className="flex">
                {/* Sidebar */}
                <div className="w-64 bg-gray-800 text-white p-4">
                    <div className="space-y-2">
                        <button
                            onClick={() => handleFilterChange('all')}
                            className={`w-full px-4 py-2 rounded-md ${filter === 'all' ? 'bg-red-400 text-white shadow-md' : 'bg-gray-600'}`}
                        >
                            Recent Ideas
                        </button>
                        <button
                            onClick={() => handleFilterChange('mostSupported')}
                            className={`w-full px-4 py-2 rounded-md ${filter === 'mostSupported' ? 'bg-green-400 text-white' : 'bg-gray-600'}`}
                        >
                            Most Supported
                        </button>
                        <button
                            onClick={() => handleFilterChange('mostInspiring')}
                            className={`w-full px-4 py-2 rounded-md ${filter === 'mostInspiring' ? 'bg-purple-300 text-white' : 'bg-gray-600'}`}
                        >
                            Most Inspiring
                        </button>
                    </div>
                </div>

                {/* Main Content */}
                <div className=" w-full p-5">
                    {/* Link to show IdeaForm */}
                    <div className="mb-5 text-center">
                        <p className="text-lg font-semibold text-gray-700">
                            "The best ideas come from action. Create yours now!"
                        </p>
                        <button
                            onClick={toggleCreateForm}
                            className="text-blue-500 hover:text-blue-700"
                        >
                            Create Idea
                        </button>
                    </div>

                    {showCreateForm && (
                        <IdeaForm
                            formData={formData}
                            formErrors={formErrors}
                            errors={errors}
                            enteredForm={enteredForm}
                            handleChange={handleChange}
                            handleSubmit={handleSubmit}
                        />
                    )}

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
        </div>
    );
};

export default Home;
