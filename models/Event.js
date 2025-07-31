import mongoose from 'mongoose';

const EventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    body: { type: String, required: false }, // optional description
    date: { type: Date, required: true }, // Date
    start: { type: Date, required: true }, // start datetime
    end: { type: Date, required: true },   // end datetime
    category: { type: String, required: true },
    color: { type: String, required: false }, // color for event display
    user: [{ type: mongoose.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

export default mongoose.model('Event', EventSchema);
