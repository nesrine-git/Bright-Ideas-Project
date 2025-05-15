import React, { useContext } from 'react';
import { useTheme } from '../context/ThemeContext';


const IdeaForm = ({ formData, formErrors, errors, enteredForm, handleChange, handleSubmit }) => {
    const { theme } = useTheme();
    const colors = theme.colors;

    return (
        <div className="max-w-xl mx-auto mb-10 px-4">
            <form
                onSubmit={handleSubmit}
                style={{
                    backgroundColor: colors.cardBg,
                    color: colors.text,
                    border: `1px solid ${colors.border}`,
                }}
                className="shadow rounded-2xl p-6 space-y-5 transition-all duration-300"
            >
                {/* Title */}
                <div>
                    <input
                        type="text"
                        name="title"
                        placeholder="Title"
                        value={formData.title}
                        onChange={handleChange}
                        style={{
                            backgroundColor: colors.background,
                            color: colors.inputText,
                            borderColor: colors.border,
                        }}
                        className="w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 placeholder-gray-400"
                    />
                    {enteredForm && formErrors.title && <p className="text-red-500 text-sm mt-1">{formErrors.title}</p>}
                    {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
                </div>

                {/* Content */}
                <div>
                    <textarea
                        name="content"
                        rows="4"
                        placeholder="Describe your idea..."
                        value={formData.content}
                        onChange={handleChange}
                        style={{
                            backgroundColor: colors.background,
                            color: colors.inputText,
                            borderColor: colors.border,
                        }}
                        className="w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 placeholder-gray-400"
                    />
                    {enteredForm && formErrors.content && <p className="text-red-500 text-sm mt-1">{formErrors.content}</p>}
                    {errors.content && <p className="text-red-500 text-sm mt-1">{errors.content}</p>}
                </div>

                {/* Emotion */}
                <div>
                    <input
                        type="text"
                        name="emotionalContext"
                        placeholder="How do you feel about it? (optional)"
                        value={formData.emotionalContext}
                        onChange={handleChange}
                        style={{
                            backgroundColor: colors.background,
                            color: colors.inputText,
                            borderColor: colors.border,
                        }}
                        className="w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 placeholder-gray-400"
                    />
                    {errors.emotionalContext && <p className="text-red-500 text-sm mt-1">{errors.emotionalContext}</p>}
                </div>

                {/* Global Error */}
                {errors.message && <p className="text-red-600 text-sm font-medium">{errors.message}</p>}

                {/* Submit Button */}
                <button
                    type="submit"
                    style={{
                        backgroundColor: colors.buttonBg,
                        color: '#fff',
                    }}
                    className="w-full font-semibold py-2 px-4 rounded-lg hover:brightness-110 transition-colors duration-300"
                    onMouseOver={e => (e.target.style.backgroundColor = colors.buttonHoverBg)}
                    onMouseOut={e => (e.target.style.backgroundColor = colors.buttonBg)}
                >
                    Submit Idea
                </button>
            </form>
        </div>
    );
};

export default IdeaForm;
