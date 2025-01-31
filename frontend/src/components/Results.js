import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import "./Results.css";

const Results = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { score, totalQuestions, selectedAnswers } = location.state;
  const [expandedIndex, setExpandedIndex] = useState(null);
  console.log(selectedAnswers);
  const handlePlayGame = () => {
    navigate("/quiz");
  };

  const handleMain = () => {
    navigate("/landing");
  };
  return (
    <div className="results-container">
      <h2 className="results-heading">Your Results</h2>
      <p className="results-score">
        You scored {score} out of {totalQuestions * 4}!
      </p>
      <h3 className="results-heading">Review Your Answers:</h3>

      <div className="review-list">
        {selectedAnswers.map((answer, index) => (
          <div key={index} className="review-item">
            <p><strong>Q{index + 1}:</strong> {answer.question}</p>
            <p><strong>Your Answer:</strong> {answer.selected}</p>
            <p><strong>Correct Answer:</strong> {answer.correctAnswer}</p>

            <button onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}>
              {expandedIndex === index ? "Hide Solution" : "View Solution"}
            </button>

            <button onClick={() => setExpandedIndex(expandedIndex === `content-${index}` ? null : `content-${index}`)}>
              {expandedIndex === `content-${index}` ? "Hide Content" : "View Content"}
            </button>

            <button onClick={() => setExpandedIndex(expandedIndex === `practice-${index}` ? null : `practice-${index}`)}>
              {expandedIndex === `practice-${index}` ? "Hide Practice Material" : "View Practice Material"}
            </button>

            {expandedIndex === index && <ReactMarkdown>{answer.detailedSolution}</ReactMarkdown>}
            {expandedIndex === `content-${index}` && <div dangerouslySetInnerHTML={{ __html: answer.content }} />}
            {expandedIndex === `practice-${index}` && <div dangerouslySetInnerHTML={{ __html: answer.practiceMaterial }} />}
          </div>
        ))}
      </div>
      <div className="button-container">
        <button onClick={handlePlayGame} className="play-button">
          Restart
        </button>
        <button onClick={handleMain} className="how-to-play-button">
          Main Menu
        </button>
      </div>
    </div>
  );
};

export default Results;
