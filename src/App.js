import React, { useState } from "react";
import "./App.css";
import confetti from "canvas-confetti";

const choices = ["rock", "paper", "scissors"];
const emojiMap = {
  rock: "🪨",
  paper: "📄",
  scissors: "✂️",
};

export default function App() {
  const [userChoice, setUserChoice] = useState("");
  const [computerChoice, setComputerChoice] = useState("");
  const [result, setResult] = useState("");
  const [animateResult, setAnimateResult] = useState(false);
  const [currentStreak, setCurrentStreak] = useState(0);

  const [maxStreak, setMaxStreak] = useState(() => {
    const saved = localStorage.getItem("maxStreak");
    return saved ? parseInt(saved, 10) : 0;
  });

  const [rankings, setRankings] = useState(() => {
    const saved = localStorage.getItem("topRankings");
    return saved ? JSON.parse(saved) : [];
  });

  const handleClick = (choice) => {
    const compChoice = choices[Math.floor(Math.random() * choices.length)];
    setUserChoice(choice);
    setComputerChoice(compChoice);
    checkWinner(choice, compChoice);
  };

  const checkWinner = (user, computer) => {
    let res = "";

    if (user === computer) {
      res = "It's a draw!";
      //setCurrentStreak(0); // Optional: reset streak on draw
    } else if (
      (user === "rock" && computer === "scissors") ||
      (user === "scissors" && computer === "paper") ||
      (user === "paper" && computer === "rock")
    ) {
      res = "You win!";
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 },
      });

      const newStreak = currentStreak + 1;
      setCurrentStreak(newStreak);

      if (newStreak > maxStreak) {
        setMaxStreak(newStreak);
        localStorage.setItem("maxStreak", newStreak);
      }
    } else {
      res = "You lose!";

      // Check if current streak qualifies for top 3
      if (
        currentStreak > 0 &&
        (rankings.length < 3 ||
          currentStreak > rankings[rankings.length - 1].score)
      ) {
        const name = prompt(
          `🏅 Your streak of ${currentStreak} made it to the leaderboard! Enter your name:`
        );
        if (name) {
          const updated = [...rankings, { name, score: currentStreak }]
            .sort((a, b) => b.score - a.score)
            .slice(0, 3);
          setRankings(updated);
          localStorage.setItem("topRankings", JSON.stringify(updated));
        }
      }

      setCurrentStreak(0);
    }

    setResult(res);
    setAnimateResult(false);
    setTimeout(() => setAnimateResult(true), 50);
  };

  const resetGame = () => {
    setUserChoice("");
    setComputerChoice("");
    setResult("");
    setAnimateResult(false);
    setCurrentStreak(0);
    setMaxStreak(0);
    setRankings([]);
    localStorage.removeItem("maxStreak");
    localStorage.removeItem("topRankings");
  };

  return (
    <div className="app">
      <h1>Rock Paper Scissors</h1>

      <div className="scoreboard">
        <h3>🔥 Current Win Streak: {currentStreak}</h3>
        <h3>🏆 Best Win Streak: {maxStreak}</h3>
      </div>

      <div className="leaderboard">
        <h3>🏅 Top 3 Players</h3>
        <ol>
          {[0, 1, 2].map((i) => {
            const entry = rankings[i];
            return (
              <li key={i} className={`rank rank-${i + 1}`}>
                {entry ? `${entry.name}: ${entry.score}` : "—"}
              </li>
            );
          })}
        </ol>
      </div>



      <div className="button-group">
        {choices.map((choice) => (
          <button
            key={choice}
            onClick={() => handleClick(choice)}
            className={`choice-button ${choice}`}
          >
            <span className="emoji">{emojiMap[choice]}</span>
            <br />
            {choice.charAt(0).toUpperCase() + choice.slice(1)}
          </button>
        ))}
      </div>

      <div className="results">
        <h2>Your Choice: {emojiMap[userChoice]}</h2>
        <h2>Computer's Choice: {emojiMap[computerChoice]}</h2>
        <h2
          className={`result-text ${animateResult ? "animate-result" : ""} ${
            result.includes("win")
              ? "win"
              : result.includes("lose")
              ? "lose"
              : result.includes("draw")
              ? "draw"
              : ""
          }`}
        >
          {result}
        </h2>

        <button onClick={resetGame} className="reset-button">
          Reset Game
        </button>
      </div>
    </div>
  );
}
