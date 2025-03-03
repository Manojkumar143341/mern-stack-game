import { useEffect, useState } from "react";
import axios from "axios";

// Easy, Normal, Hard difficulty levels
const paragraphs = {
  easy: "Typing fast and accurately is a useful skill.",
  normal: "The quick brown fox jumps over the lazy dog. Speed and accuracy improve with practice.",
  hard: "In the world of software engineering, complex algorithms and optimized code structures play a crucial role in enhancing the overall performance of applications, ensuring efficiency, and providing seamless user experiences."
};

function Game() {
  const [text, setText] = useState(paragraphs.normal); // Default to normal difficulty
  const [input, setInput] = useState(""); // User input
  const [timeLeft, setTimeLeft] = useState(30); // Default timer
  const [isPlaying, setIsPlaying] = useState(false); // Game status
  const [accuracy, setAccuracy] = useState(100); // Typing accuracy
  const [score, setScore] = useState(0); // Score
  const [difficulty, setDifficulty] = useState("normal"); // Default difficulty
  const [customTime, setCustomTime] = useState(30); // Custom timer value
  const [scrollSpeed, setScrollSpeed] = useState(20); // Initial scroll speed (adjustable)

  useEffect(() => {
    let timer;
    if (isPlaying && timeLeft > 0) {
      timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    } else if (timeLeft === 0) {
      calculateScore();
      setIsPlaying(false);
    }
    return () => clearTimeout(timer);
  }, [isPlaying, timeLeft]);

  const handleChange = (e) => {
    if (!isPlaying) setIsPlaying(true);
    setInput(e.target.value);
    calculateAccuracy(e.target.value);

    // Move to the next paragraph if the user types correctly
    if (e.target.value === text) {
      nextParagraph();
    }
  };

  const calculateAccuracy = (typedText) => {
    let correctChars = 0;
    for (let i = 0; i < typedText.length; i++) {
      if (typedText[i] === text[i]) correctChars++;
    }
    setAccuracy(((correctChars / text.length) * 100).toFixed(2));
  };

  const nextParagraph = () => {
    // Change paragraph after completing one
    setText(paragraphs[difficulty]);
    setInput("");
  };

  const calculateScore = async () => {
    const finalScore = (input.length * (accuracy / 100)).toFixed(0);
    setScore(finalScore);

    // Save score to the backend
    await axios.post("http://localhost:5000/api/scores/save", {
      username: "Player1",
      score: finalScore,
      accuracy,
    });
  };

  const restartGame = () => {
    // Reset game and apply difficulty
    setTimeLeft(customTime);
    setInput("");
    setAccuracy(100);
    setScore(0);
    setIsPlaying(false);
    setText(paragraphs[difficulty]);
  };

  return (
    <div className="game-container">
      <h1>Typing Speed Game</h1>

      {/* Difficulty Level Selection */}
      <div className="difficulty-selector">
        <button className="difficulty-btn" onClick={() => { setDifficulty("easy"); restartGame(); }}>
          Easy
        </button>
        <button className="difficulty-btn" onClick={() => { setDifficulty("normal"); restartGame(); }}>
          Normal
        </button>
        <button className="difficulty-btn" onClick={() => { setDifficulty("hard"); restartGame(); }}>
          Hard
        </button>
      </div>

      {/* Timer input with effect */}
      <div className="timer-box">
        <label>Set Timer (seconds): </label>
        <input
          type="number"
          value={customTime}
          onChange={(e) => setCustomTime(Number(e.target.value))}
          min="10"
          className="timer-input"
        />
      </div>

      {/* Scroll Speed input */}
      <div className="scroll-speed">
        <label>Scroll Speed: </label>
        <input
          type="range"
          min="10"
          max="50"
          value={scrollSpeed}
          onChange={(e) => setScrollSpeed(e.target.value)}
          className="scroll-range"
        />
      </div>

      {/* Scrolling text */}
      <div className="text-scroll-wrapper">
        <p className="text-scroll" style={{ animationDuration: `${scrollSpeed}s` }}>
          {text}
        </p>
      </div>

      {/* Textarea to type */}
      <textarea
        value={input}
        onChange={handleChange}
        disabled={timeLeft === 0}
        className="input-box"
      />

      {/* Stats */}
      <div className="stats">
        <p>Time Left: {timeLeft}s</p>
        <p>Accuracy: {accuracy}%</p>
        <p>Score: {score}</p>
      </div>

      {/* Restart Button */}
      <button onClick={restartGame}>Restart</button>
    </div>
  );
}

export default Game;
