import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ideaService from '../services/ideaService';
import userService from '../services/userService';
import Navbar from './Navbar';

const Home = () => {
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        emotionalContext: ''
    });
    const [formErrors, setFormErrors] = useState({
        title: 'Title is required',
        content: 'Content is required',
        emotionalContext: ''
    });
    const [errors, setErrors] = useState({});
    const [enteredForm, setEnteredForm] = useState(false);
    const [ideas, setIdeas] = useState([]);

    const nav = useNavigate();

    useEffect(() => {
        fetchIdeas();
    }, []);

    const fetchIdeas = async () => {
        try {
            const res = await ideaService.getAll();
            setIdeas(res.data);
        } catch (err) {
            if (err.response?.status === 401) nav('/');
        }
    };

    const validateForm = () => {
        return Object.values(formErrors).every(error => error === '');
    };

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
        // No validation on emotionalContext
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

    return (
        <div className="container">
            <Navbar/>
            <h1 className="text-center m-4 ">💡 Welcome to the Idea Board</h1>

            <form onSubmit={handleSubmit} className="card p-4 shadow-sm mb-5">
                <h4 className="mb-3">Share a New Idea</h4>

                {/* Title */}
                <div className="mb-3">
                    <input
                        type="text"
                        name="title"
                        className="form-control"
                        placeholder="Title"
                        value={formData.title}
                        onChange={handleChange}
                    />
                    {enteredForm && formErrors.title && <div className="text-danger">{formErrors.title}</div>}
                    {errors.title && <div className="text-danger">{errors.title}</div>}
                </div>

                {/* Content */}
                <div className="mb-3">
                    <textarea
                        name="content"
                        className="form-control"
                        placeholder="Describe your idea..."
                        rows="4"
                        value={formData.content}
                        onChange={handleChange}
                    />
                    {enteredForm && formErrors.content && <div className="text-danger">{formErrors.content}</div>}
                    {errors.content && <div className="text-danger">{errors.content}</div>}
                </div>

                {/* Emotion (optional) */}
                <div className="mb-3">
                    <input
                        type="text"
                        name="emotionalContext"
                        className="form-control"
                        placeholder="How do you feel about it? (optional)"
                        value={formData.emotionalContext}
                        onChange={handleChange}
                    />
                    {errors.emotionalContext && <div className="text-danger">{errors.emotionalContext}</div>}
                </div>

                {/* Global error */}
                {errors.message && <div className="text-danger mb-3">{errors.message}</div>}

                <button className="btn btn-success">Submit Idea</button>
            </form>
        

            {/* Ideas List */}
            <div className="row">
                {ideas.length > 0 ? (ideas.map((idea) => (
                    <div key={idea._id} className="col-md-6 mb-4">
                        <div className="card p-3 h-100 shadow-sm">
                            <h5 className="fw-bold">{idea.title}</h5>
                            <p>{idea.content}</p>
                            {idea.emotionalContext && (
                            <small className="text-muted">😊 {idea.emotionalContext}</small>
                            )}
                            {idea.creator?.alias && (
                            <small className="text-secondary">🧑‍💻 by {idea.creator.alias}</small>
                            )}
                        </div>
                    </div>
                ))): (
                    <p>No ideas to display yet.</p>)}
            </div>
        </div>
    );
};

export default Home;
