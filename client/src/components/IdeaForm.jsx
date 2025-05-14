import React from 'react';

const IdeaForm = ({ formData, formErrors, errors, enteredForm, handleChange, handleSubmit }) => {
    return (
        <div className="max-w-xl mx-auto mb-5">
            <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 shadow rounded-2xl p-6 space-y-5">
                {/* Title */}
                <div>
                    <input
                        type="text"
                        name="title"
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-400"
                        placeholder="Title"
                        value={formData.title}
                        onChange={handleChange}
                    />
                    {enteredForm && formErrors.title && <p className="text-red-500 text-sm mt-1">{formErrors.title}</p>}
                    {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
                </div>

                {/* Content */}
                <div>
                    <textarea
                        name="content"
                        rows="4"
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-400"
                        placeholder="Describe your idea..."
                        value={formData.content}
                        onChange={handleChange}
                    />
                    {enteredForm && formErrors.content && <p className="text-red-500 text-sm mt-1">{formErrors.content}</p>}
                    {errors.content && <p className="text-red-500 text-sm mt-1">{errors.content}</p>}
                </div>

                {/* Emotion (optional) */}
                <div>
                    <input
                        type="text"
                        name="emotionalContext"
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-400"
                        placeholder="How do you feel about it? (optional)"
                        value={formData.emotionalContext}
                        onChange={handleChange}
                    />
                    {errors.emotionalContext && <p className="text-red-500 text-sm mt-1">{errors.emotionalContext}</p>}
                </div>

                {/* Global error */}
                {errors.message && <p className="text-red-600 text-sm font-medium">{errors.message}</p>}

                {/* Submit */}
                <button
                    type="submit"
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-300"
                >
                    Submit Idea
                </button>
            </form>
        </div>
    );
};

export default IdeaForm;
