import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ideaService from '../services/ideaService';
import { toast } from 'react-toastify';


const EditIdea = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [idea, setIdea] = useState(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [emotionalContext, setEmotionalContext] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const loadIdea = async () => {
      try {
        const data = await ideaService.getOne(id);
        setIdea(data);
        setTitle(data.title || '');
        setContent(data.content || '');
        setEmotionalContext(data.emotionalContext || '');
      } catch (err) {
        console.error(err);
        setError('Could not load idea');
      }
    };
    loadIdea();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (content.length < 20) {
      setError('Content must be at least 20 characters.');
      return;
    }
    try {
      await ideaService.update(id, { title, content, emotionalContext });
      toast.success('Idea updated!');
      navigate('/home');
    } catch (err) {
      console.error(err);
      setError('Update failed');
      toast.error('Update failed');
    }
  };

  if (!idea) return <p>Loading...</p>;

  return (
    <div className="container mt-4">
      <h3>Edit Idea</h3>
      {error && <p className="text-danger">{error}</p>}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Title:</label>
          <input
            type="text"
            className="form-control"
            value={title}
            onChange={e => setTitle(e.target.value)}
            maxLength={100}
            required
          />
          <small className="text-muted">{title.length}/100</small>
        </div>

        <div className="mb-3">
          <label className="form-label">Content:</label>
          <textarea
            className="form-control"
            value={content}
            onChange={e => setContent(e.target.value)}
            minLength={20}
            maxLength={500}
            rows={4}
            required
          />
          <small className="text-muted">{content.length}/500</small>
        </div>

        <div className="mb-3">
          <label className="form-label">Emotional Context (Optional):</label>
          <input
            type="text"
            className="form-control"
            value={emotionalContext}
            onChange={e => setEmotionalContext(e.target.value)}
            maxLength={100}
          />
          <small className="text-muted">{emotionalContext.length}/100</small>
        </div>

        <button type="submit" className="btn btn-primary">💾 Save Changes</button>
        <button type="button" className="btn btn-secondary ms-2" onClick={() => navigate('/home')}>
          ❌ Cancel
        </button>
      </form>
    </div>
  );
};

export default EditIdea;
