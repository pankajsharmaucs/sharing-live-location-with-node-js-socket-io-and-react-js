import express from 'express';
import Location from '../models/Location.js';

const router = express.Router();

router.post('/', async (req, res) => {
  const location = new Location(req.body);
  await location.save();
  res.status(201).json({ success: true });
});

router.get('/:userId', async (req, res) => {
  const { userId } = req.params;
  const locations = await Location.find({ userId }).sort({ timestamp: -1 });
  res.json(locations);
});

export default router;
