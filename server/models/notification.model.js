import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, enum: ['like', 'comment'], required: true },
    idea: { type: mongoose.Schema.Types.ObjectId, ref: 'Idea', required: true },
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // who liked or commented
    read: { type: Boolean, default: false }
  },
  { timestamps: true }
);

const Notification = mongoose.model('Notification', notificationSchema);
export default Notification;
