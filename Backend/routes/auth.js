import express from 'express';
const router = express.Router();
import User from '../models/User.js';
import bcrypt from 'bcryptjs';

//Sign Up
router.post('/register', async (req, res) => {
  try {
    const { email, username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ email, username, password: hashedPassword });
    await user.save().then(() => {
      res.status(200).json({ user: user });
    });
  } catch (err) {
    res.status(500).send(err.message + "User Already Exist");
  }
});

// Sign In 
router.post('/signin', async (req, res) => {
  try {
    const { email, password: inputPassword } = req.body;
    if (!inputPassword) {
      return res.status(400).json({ message: "Password is required" });
    }
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(404).json({ message: "User Not Found" });
    }
    const isMatch = await bcrypt.compare(inputPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid Password" });
    }
    const { password: _pwd, ...others } = user._doc;
    res.status(200).json({ user: others });
  } catch (err) {
    res.status(500).send(err.message + "Invalid Password or User Not Found");
  }
});

export default router;
