import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import ideaService from '../services/ideaService';
import Navbar from './Navbar';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

const LikeStatus = () => {
  const { id } = useParams(); // ideaId
  const [idea, setIdea] = useState(null);
  const [error, setError] = useState(null);
  const [view, setView] = useState('supports'); // or 'inspirations'
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

  if (error) return <p className="text-red-600 text-center">{error}</p>;
  if (!idea) return <p className="text-center text-gray-500">Loading...</p>;

  const currentList = view === 'supports' ? idea.supports : idea.inspirations;
  const label = view === 'supports' ? '💪 Supporters' : '🌟 Inspired Users';

  return (
    <>
      <Navbar />
      <div className={`max-w-4xl mx-auto px-4 py-8 ${theme.text}`}>
        {/* Idea Card */}
        <div className={`shadow rounded-2xl p-6 mb-8 border transition-colors ${theme.cardBg} ${theme.border}`}>
          <h2 className="text-2xl font-bold mb-2">{idea.title}</h2>
          <p className="mb-3">{idea.content}</p>
          {idea.emotionalContext && (
            <p className="text-sm text-gray-500">😊 {idea.emotionalContext}</p>
          )}
          {idea.creator?.alias && (
            <p className="text-sm text-gray-400">🧑‍💻 by {idea.creator.alias}</p>
          )}
        </div>

        {/* Toggle Buttons */}
        <div className="flex justify-center gap-4 mb-6">
          <button
            onClick={() => setView('supports')}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition 
              ${view === 'supports' ? 'bg-blue-600 text-white' : theme.buttonBg}`}
          >
            Supporters
          </button>
          <button
            onClick={() => setView('inspirations')}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition 
              ${view === 'inspirations' ? 'bg-blue-600 text-white' : theme.buttonBg}`}
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
            <h3 className="text-lg font-bold mb-3 text-center">{label}</h3>
            {Array.isArray(currentList) && currentList.length > 0 ? (
              <div className="overflow-x-auto">
                <table className={`min-w-full shadow rounded-xl ${theme.cardBg} ${theme.border}`}>
                  <thead>
                    <tr className="text-left text-sm uppercase">
                      <th className="px-6 py-3">Alias</th>
                      <th className="px-6 py-3">Name</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentList.map(user => (
                      <tr key={user._id} className={`border-t transition hover:bg-gray-100 dark:hover:bg-gray-700 ${theme.border}`}>
                        <td className={`px-6 py-3 underline ${theme.linkText}`}>
                          <Link to={`/users/${user._id}`}>
                            {user.alias || 'user.name'}
                          </Link>
                        </td>
                        <td className="px-6 py-3">{user.name || 'No name'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-center text-gray-500">No one in this category yet.</p>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </>
  );
};

export default LikeStatus;
