import express from 'express';
const router = express.Router();

import User from '../models/User.js';
import List from '../models/List.js';


// Create TodoList
router.post('/addTask', async (req, res) => {
  try {
    const { title, body, email, } = req.body;
    const user = await User.findOne({ email });
    if (user) {
      const list = new List({ title, body, user: user });
      await list.save().then(() => {
        res.status(200).json({ list });
      });
      user.list.push(list)
      user.save()
    }
    if (!user) {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.log(error)
  }
});
// Update TodoList
router.put('/updateTask/:id', async (req, res) => {
  try {
    const { title, body, email, } = req.body;
    const user = await User.findOne({ email });
    if (user) {
      const list = await List.findByIdAndUpdate(req.params.id, { title, body, user: user }, { new: true });
      list.save().then(() => {
        res.status(200).json({ message: "Task is updated", list });
      })
    }
    if (!user) {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.log(error)
  }
});
// Update TodoList
router.delete('/deleteTask/:id', async (req, res) => {
  try {
    const { email, } = req.body;
    const user = await User.findOneAndUpdate(
      { email },
      { $pull: { list: req.params.id } },
    );
    if (user) {
      await List.findByIdAndDelete(req.params.id).then(() => {
        res.status(200).json({ message: "Task is Deleted", });
      })
    }
  } catch (error) {
    console.log(error)
  }
});

// Get all TodoList
router.get('/getTask/:id', async (req, res) => {
  try {
    // const user = await User.findOne({ email: req.query.email });
    const list = await List.find({ user : req.params.id }).sort({createdAt:-1});
    if (list.length!== 0) {
      res.status(200).json({ list : list });
    }
    else{
      res.status(200).json({ message: "No task found" });
    }
  } catch {
    res.status(200).json({message:'The Express server is not available.'})
  }
});
export default router;