import mongoose from 'mongoose';

const locationSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    unique: true, // ensures only one location per user
    trim: true,
  },
  latitude: {
    type: Number,
    required: true,
  },
  longitude: {
    type: Number,
    required: true,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const Location = mongoose.model('Location', locationSchema);
export default Location;
