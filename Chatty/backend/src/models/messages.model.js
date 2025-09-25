import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    sender: { type: String, required: true },
    receiver: { type: String, required: true },
    message: { type: String, required: true },
    date: { type: Date, required: true },
    read: { type: Boolean, required: true, default: false },
    likes: { type: Number, required: true, default: 0 },
  },
  { timestamps: true },
);

const Message = mongoose.model("Message", messageSchema);

export default Message;
