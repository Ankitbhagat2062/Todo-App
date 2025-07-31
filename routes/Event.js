import express from 'express';
const router = express.Router();

import User from '../models/User.js';
import EventModel from '../models/Event.js';

router.post('/addEvent', async (req, res) => {
  try {
    const { title, body,date, user: userId, start, end, category, color } = req.body;
    const user = await User.findById(userId);
    if (user) {
      const event = new EventModel({ title, body,date, start, end, category, color, user: user._id });
      await event.save().then(() => {
        res.status(200).json({ event });
      });
      user.list.push(event)
      user.save()
    }
    if (!user) {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.log(error)
  }
});

router.put('/updateEvent/:id', async (req, res) => {
  try {
    const { title, body,date, user: userId, start, end, category, color } = req.body;
    const user = await User.findById(userId);
    if (user) {
      const event = await EventModel.findByIdAndUpdate(
        req.params.id,
        { title, body, date, start, end, category, color, user: user._id },
        { new: true }
      );
      await event.save();
      res.status(200).json({ message: "Event is updated", event });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
});

router.delete('/deleteEvent/:id', async (req, res) => {
  try {
    const { user: userId } = req.body;
    const user = await User.findByIdAndUpdate(
      userId,
      { $pull: { list: req.params.id } },
    );
    if (user) {
      await EventModel.findByIdAndDelete(req.params.id).then(() => {
        res.status(200).json({ message: "Event is Deleted" });
      });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get all TodoEvent
router.get('/getEvent/:id', async (req, res) => {
  try {
    // const user = await User.findOne({ email: req.query.email });
    const Event = await EventModel.find({ user : req.params.id }).sort({createdAt:-1});
    if (Event.length!== 0) {
      res.status(200).json({ Event : Event });
    }
    else{
      res.status(200).json({ message: "No Event found" });
    }
  } catch {
    res.status(200).json({message:'The Express server is not available.'})
  }
});
export default router;

