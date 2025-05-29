const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("User service connected to MongoDB"));

const User = require('./models/User');

// GET all users
app.get('/users', async (req, res) => {
  const users = await User.find();
  res.json(users);
});

// POST create a new user
app.post('/users', async (req, res) => {
  const newUser = new User(req.body);
  await newUser.save();
  res.json(newUser);
});

// DELETE user by ID
app.delete('/users/:id', async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ message: "User deleted" });
});

app.listen(process.env.PORT, () => {
  console.log(`User service running on port ${process.env.PORT}`);
});
