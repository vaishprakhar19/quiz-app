import React from "react";
import { useNavigate } from "react-router-dom";
import "./Quiz.css";
import logo from "../resources/quizzer.png"

const Landing = () => {
  const navigate = useNavigate();

  const handlePlayGame = () => {
    navigate("/quiz"); // Navigate to the quiz page when the "Play Game" button is clicked
  };

  const handleHowToPlay = () => {
    navigate("/how-to-play"); // Navigate to the "How to Play" page
  };

  return (
    <div className="landing-container">
      <div className="logo-container">
        <img
          src={logo} // Put your logo file here
          alt="Logo"
          className="logo"
        />
      </div>
      <h1>Quizzer</h1>
      <div className="button-container">
        <button onClick={handlePlayGame} className="play-button">
          Play Game
        </button>
        <button onClick={handleHowToPlay} className="how-to-play-button">
          How to Play
        </button>
      </div>
    </div>
  );
};

export default Landing;
