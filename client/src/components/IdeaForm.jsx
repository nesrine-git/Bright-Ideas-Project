import React from 'react';

const IdeaForm = ({ formData, formErrors, errors, enteredForm, handleChange, handleSubmit }) => {
    return (
        <div className='container '>
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
        </div>
    );
};

export default IdeaForm;
