import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ideaService from '../services/ideaService';
import userService from '../services/userService';
import Navbar from './Navbar';
import IdeaForm from './IdeaForm';
import IdeaList from './IdeaList';
import { useTheme } from '../context/ThemeContext';
import { toast } from 'react-toastify';


const Home = () => {
    const [formData, setFormData] = useState({ title: '', content: '', emotionalContext: '' });
    const [formErrors, setFormErrors] = useState({ title: 'Title is required', content: 'Content is required', emotionalContext: '' });
    const [errors, setErrors] = useState({});
    const [enteredForm, setEnteredForm] = useState(false);
    const [ideas, setIdeas] = useState([]);
    const [userId, setUserId] = useState(null);
    const [filter, setFilter] = useState('all');
    const [showCreateForm, setShowCreateForm] = useState(false);
    const emptyForm = {
    title: '',
    content: '',
    emotionalContext: ''
  };



    const nav = useNavigate();

    const fetchIdeas = async () => {
        if (!userId) return;
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
            if (err.response?.status === 401) {
                nav('/');
            } else {
                console.error("Failed to fetch ideas:", err);
            }
        }
    };

    useEffect(() => {
        const fetchUserId = async () => {
            try {
                const user = await userService.getCurrentUser();
                setUserId(user.data._id);
            } catch (err) {
                console.error("Error fetching user:", err);
                nav('/');
            }
        };
        fetchUserId();
    }, [nav]);

    useEffect(() => {
        fetchIdeas();
    }, [filter, userId]);

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
            setShowCreateForm(false);
            fetchIdeas();
            toast.success('Idea created successfully!');
        } catch (err) {
            setErrors(err.response?.data || { message: 'Something went wrong' });
        }
    };

    const handleDelete = async (id) => {
        try {
            await ideaService.delete(id);
            fetchIdeas();
        } catch (err) {
            console.error('❌ Delete failed:', err.response?.data || err.message);
        }
    };

    const handleUpdate = async (id, updatedData) => {
        try {
            const updated = await ideaService.update(id, updatedData);
            fetchIdeas();
            return updated;
        } catch (err) {
            console.error('❌ Update failed:', err);
            throw err;
        }
    };

    const toggleReaction = async (id, type) => {
        if (!userId) return;

        const serviceFn = type === 'support' ? ideaService.toggleSupport : ideaService.toggleInspiration;

        try {
            await serviceFn(id);
            fetchIdeas(); // Always fetch after reaction to ensure updated list
        } catch (err) {
            console.error(`Error toggling ${type}:`, err);
        }
    };

    const handleSupportToggle = (id) => toggleReaction(id, 'support');
    const handleInspireToggle = (id) => toggleReaction(id, 'inspiration');

    const handleFilterChange = (newFilter) => {
        setFilter(newFilter);
    };

    const toggleCreateForm = () => {
      if (!showCreateForm) {
      setFormData(emptyForm); // Reset when showing
      setFormErrors({});
      setErrors({});
      setEnteredForm(false);
    }
    setShowCreateForm(prev => !prev);
  };
  
    if (!userId) return <div className="text-center mt-5">Loading...</div>;


  const { theme } = useTheme(); // <-- get theme from context
  const isDark = theme.mode === 'dark';

  // Map filter keys to readable labels and colors? from theme
  const filterLabels = {
    all: 'Recent Ideas',
    mostSupported: 'Most Supported',
    mostInspiring: 'Most Inspiring',
  };

  // Example: map keys to colors? from your theme
  const filterColors = {
    all: theme.colors?.supportBg,       
    mostSupported: theme.colors?.inspireBg, // e.g. yellow or green-ish background
    mostInspiring: theme.colors?.buttonBg, // e.g. amber/orange
  };

  return (
    <div style={{backgroundColor: theme.colors?.cardBg,
            color: theme.colors?.text,}}>
      <Navbar />
      <div className="flex">
        {/* Sidebar */}
        <div
          className="w-64 m-1 shadow p-4 space-y-3 rounded"
          style={{
            backgroundColor: theme.colors?.background,
            color: theme.colors?.text,
          }}
        >
          {['all', 'mostSupported', 'mostInspiring'].map((key) => {
            const selected = filter === key;
            return (
              <button
                key={key}
                onClick={() => handleFilterChange(key)}
                className="w-full px-4 py-2 rounded-md transition duration-200"
                style={{
                  backgroundColor: selected
                    ? filterColors[key]
                    : theme.colors?.cardBg,
                  color: selected ? theme.colors?.linkText : theme.colors?.text,
                  boxShadow: selected ? '0 0 8px rgba(0,0,0,0.2)' : 'none',
                }}
              >
                {filterLabels[key]}
              </button>
            );
          })}
        </div>

        {/* Main Content */}
        <div className="w-full p-5" style={{ backgroundColor: theme.colors?.background, color: theme.colors?.text }}>
          <div className="mb-5 text-center">
            <p className="text-xl font-semibold mb-3" style={{ color: theme.colors?.text }}>
              "The best ideas come from action. Create yours now!"
            </p>
            <button
              onClick={toggleCreateForm}
              style={{ color: theme.colors?.buttonLink }}
              className="hover:underline"
            >
              {showCreateForm ? 'Hide Form' : 'Create Idea'}
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
