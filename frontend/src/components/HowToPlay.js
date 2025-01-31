import React from "react";
import { useNavigate } from "react-router-dom";

const HowToPlay = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate("/"); // Go back to the landing page
  };

  return (
    <div className="how-to-play-container">
      <h1>How to Play</h1>
      <p>
        The quiz game consists of multiple-choice questions. You will need to
        answer the questions correctly to score points. The options will fall
        down from the top, and you need to catch the correct option using the
        basket controlled by the arrow keys. The game will end if you either
        make too many mistakes or answer all questions.
      </p>
      <ul>
        <li>Use the left and right arrow keys to move the basket.</li>
        <li>Catch the correct option to earn points.</li>
        <li>Make too many mistakes, and the game ends.</li>
        <li>Reach the end of the quiz to see your score!</li>
      </ul>
      <button onClick={handleGoBack} className="back-button">
        Back to Landing Page
      </button>
    </div>
  );
};

export default HowToPlay;
