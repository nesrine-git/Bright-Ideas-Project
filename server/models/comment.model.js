import mongoose, { Schema, model } from 'mongoose';

const commentSchema = new Schema(
  {
    content: {
      type: String,
      required: false
    },
    idea: {
      type: Schema.Types.ObjectId,
      ref: 'Idea',
      required: true,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  },
  { timestamps: true }
);

const Comment = model('Comment', commentSchema);
export default Comment;
