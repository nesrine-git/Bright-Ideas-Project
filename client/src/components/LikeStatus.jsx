import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import ideaService from '../services/ideaService';
import Navbar from './Navbar';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

const LikeStatus = () => {
  const { id } = useParams();
  const [idea, setIdea] = useState(null);
  const [error, setError] = useState(null);
  const [view, setView] = useState('supports');
  const { theme } = useTheme();

  useEffect(() => {
    const fetchReactions = async () => {
      try {
        const res = await ideaService.getReactions(id);
        setIdea(res);
      } catch (err) {
        console.error(err);
        setError('Failed to load like status');
      }
    };
    fetchReactions();
  }, [id]);

  if (error) return <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>;
  if (!idea) return <p style={{ color: theme.colors.text, textAlign: 'center' }}>Loading...</p>;

  const currentList = view === 'supports' ? idea.supports : idea.inspirations;
  const label = view === 'supports' ? '💪 Supporters' : '🌟 Inspired Users';

  // Helper to style buttons dynamically
  const buttonStyle = (active) => ({
    padding: '0.5rem 1rem',
    borderRadius: '1rem',
    fontWeight: '500',
    fontSize: '0.875rem',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
    backgroundColor: active ? theme.colors.buttonBg : 'transparent',
    color: active ? '#fff' : theme.colors.text,
    border: `1.5px solid ${active ? theme.colors.buttonBg : theme.colors.text}`,
  });

  return (
    <div style={{backgroundColor:theme.colors.cardBg}}>
      <Navbar />
      <div
        style={{
          maxWidth: '48rem',
          margin: '2rem auto',
          padding: '1rem',
          color: theme.colors.text,
          backgroundColor: theme.colors.cardBg,
          minHeight: '70vh',
        }}
      >
        {/* Idea Card */}
        <div
          style={{
            backgroundColor: theme.colors.cardBg,
            border: `1px solid ${theme.colors.border}`,
            borderRadius: '1.25rem',
            padding: '1.5rem',
            marginBottom: '2rem',
            boxShadow: '0 5px 10px rgba(0,0,0,0.05)',
            transition: 'background-color 0.3s ease, border-color 0.3s ease',
          }}
        >
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
            {idea.title}
          </h2>
          <p style={{ marginBottom: '0.7rem' }}>{idea.content}</p>
          {idea.emotionalContext && (
            <p style={{ fontSize: '0.875rem', color: '#1F2937' /* Tailwind gray-500 */ }}>
              😊 {idea.emotionalContext}
            </p>
          )}
          {idea.creator?.alias && (
            <p style={{ marginTop: '0.5rem',marginLeft: '0.3rem', fontSize: '0.875rem', color: 'dark' /* Tailwind gray-400 */ }}>
             By {idea.creator?.alias || idea.creator.name}
            </p>
          )}
        </div>

        {/* Toggle Buttons */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
          <button
            onClick={() => setView('supports')}
            style={buttonStyle(view === 'supports')}
            aria-pressed={view === 'supports'}
          >
            Supporters
          </button>
          <button
            onClick={() => setView('inspirations')}
            style={buttonStyle(view === 'inspirations')}
            aria-pressed={view === 'inspirations'}
          >
            Inspired
          </button>
        </div>

        {/* Animated Table */}
        <AnimatePresence mode="wait">
          <motion.div
            key={view}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <h3 style={{ fontWeight: 'bold', fontSize: '1.125rem', textAlign: 'center', marginBottom: '1rem' }}>
              {label}
            </h3>
            {Array.isArray(currentList) && currentList.length > 0 ? (
              <div style={{ overflowX: 'auto' }}>
                <table
                  style={{
                    width: '100%',
                    borderCollapse: 'collapse',
                    backgroundColor: theme.colors.cardBg,
                    border: `1px solid ${theme.colors.border}`,
                    borderRadius: '1rem',
                    overflow: 'hidden',
                  }}
                >
                  <thead style={{ textTransform: 'uppercase', fontSize: '0.75rem', color: '#1F2937' }}>
                    <tr>
                      <th style={{ textAlign: 'left', padding: '0.75rem 1.5rem' }}>Alias</th>
                      <th style={{ textAlign: 'left', padding: '0.75rem 1.5rem' }}>Name</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentList.map(user => (
                      <tr
                        key={user._id}
                        style={{
                          borderTop: `1px solid ${theme.colors.border}`,
                          transition: 'background-color 0.3s ease',
                        }}
                        onMouseEnter={e => (e.currentTarget.style.backgroundColor = theme.mode === 'dark' ? '#374151' : '#F3F4F6')}
                        onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
                      >
                        <td style={{ padding: '0.75rem 1.5rem' }}>
                          <Link
                            to={`/users/${user._id}`}
                            style={{
                              color: theme.colors.linkText,
                              textDecoration: 'underline',
                              cursor: 'pointer',
                            }}
                          >
                            {user.alias || 'user.name'}
                          </Link>
                        </td>
                        <td style={{ padding: '0.75rem 1.5rem', color: theme.colors.text }}>
                          {user.name || 'No name'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p style={{ textAlign: 'center', color: '#9CA3AF' }}>No one in this category yet.</p>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default LikeStatus;
