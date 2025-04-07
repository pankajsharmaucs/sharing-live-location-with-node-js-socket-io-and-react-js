import mongoose from 'mongoose';

const locationSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    unique: true, // Ensures one userId only
  },
  latitude: Number,
  longitude: Number,
  updatedAt: Date
});


export default mongoose.model('Location', locationSchema);
