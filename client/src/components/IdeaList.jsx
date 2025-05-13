import React from 'react';
import IdeaCard from './IdeaCard';

const IdeaList = ({ ideas, userId, onInspireToggle, onSupportToggle, onDelete, onUpdate }) => {
  if (!Array.isArray(ideas) || ideas.length === 0) {
    return <p>No ideas to display yet.</p>;
  }

  return (
    <div className="row">
      {ideas.map((idea, index) => (
        <div key={index} > {/* Ensure unique key */}
          <IdeaCard idea={idea} userId={userId} onSupportToggle={onSupportToggle}
          onInspireToggle={onInspireToggle} onDelete={onDelete} onUpdate={onUpdate}/>
        </div>
      ))}
    </div>
  );
};

export default IdeaList;
