import mongoose, { Schema, model } from 'mongoose';

const commentSchema = new Schema(
  {
    content: {
      type: String,
      required: false // Optional comment
    },
    idea: {
      type: Schema.Types.ObjectId,
      ref: 'Idea',
      required: true
    },
    creator: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User'
      }
    ]
  },
  { timestamps: true }
);

const Comment = model('Comment', commentSchema);
export default Comment;
