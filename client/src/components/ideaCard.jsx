import React from 'react';

const IdeaCard = ({ idea, userId, onLikeToggle, onDelete }) => {
  // Make sure `idea.likes` is always an array
  const likes = Array.isArray(idea.likes) ? idea.likes : [];
  const isLiked = likes.includes(userId);
  

  return (
    <div className="card p-3 mb-3 shadow-sm" key={idea._id}>
      <h5 className="fw-bold">{idea.title}</h5>
      <p>{idea.content}</p>

      {idea.emotionalContext && (
        <small className="text-muted">😊 {idea.emotionalContext}</small>
      )}
      <br />
      {idea.creator?.alias && (
        <small className="text-secondary">🧑‍💻 by {idea.creator.alias}</small>
      )}
      <div className="mt-2">
        <button onClick={() => onLikeToggle(idea._id)}>
          👍 {likes.length} {isLiked ? 'Unlike' : 'Like'}
        </button>
        {idea.creator._id === userId && (
        <button onClick={() => onDelete(idea._id)}>Delete</button>
)}
      </div>
    </div>
  );
};

export default IdeaCard;
