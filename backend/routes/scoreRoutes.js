const express = require("express");
const Score = require("../models/Score");
const router = express.Router();

// Save score
router.post("/save", async (req, res) => {
  try {
    const { username, score, accuracy } = req.body;
    const newScore = new Score({ username, score, accuracy });
    await newScore.save();
    res.status(201).json({ message: "Score saved!", newScore });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get top scores
router.get("/top", async (req, res) => {
  try {
    const scores = await Score.find().sort({ score: -1 }).limit(10);
    res.json(scores);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
