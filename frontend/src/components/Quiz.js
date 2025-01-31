import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import "./Quiz.css"; // Import CSS for game styles

const Quiz = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [maxMistakes, setMaxMistakes] = useState(3);
  const [shuffledQuestions, setShuffledQuestions] = useState([]); // Store shuffled questions
  const [fallingOptions, setFallingOptions] = useState([]);
  const [basketPosition, setBasketPosition] = useState(50);
  const [correctMarks, setCorrectMarks] = useState(4);
  const [negativeMarks, setNegativeMarks] = useState(1);
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const gameContainerRef = useRef(null);

  const navigate = useNavigate();
  const questionsFetched = useRef(false);

  // Fetch quiz data
  useEffect(() => {
    if (questionsFetched.current) return;
    questionsFetched.current = true;

    fetch("http://localhost:5000/api/proxy")
      .then((response) => response.json())
      .then((data) => {
        console.log("Fetched Data:", data);

        setMaxMistakes(parseFloat(data.max_mistake_count) || 3);
        setCorrectMarks(parseFloat(data.correct_answer_marks) || 4);
        setNegativeMarks(parseFloat(data.negative_marks) || 1);

        const formattedQuestions = data.questions.map((q) => ({
          id: q.id,
          question: q.description || "Unknown Question",
          correctAnswer: q.options?.find((opt) => opt.isCorrect)?.description || "Unknown",
          detailedSolution: q.detailed_solution || "Unknown",
          content: q.reading_material?.content_sections?.join(" ") || "<p>No content available</p>",
          practiceMaterial: q.reading_material?.practice_material?.content?.join(" ") || "<p>No practice material available</p>",
          options: shuffleArray(
            q.options?.map((opt, index) => ({
              id: opt.id,
              text: opt.description || "Unknown Option",
              isCorrect: opt.is_correct || false,
              positionX: Math.random() * 80 + 10,
              positionY: -10 - index * 15, // Start above the screen, making space between options
            })) || []
          ),
        }));

        // Shuffle the questions only once
        const shuffledData = shuffleArray(formattedQuestions);
        setShuffledQuestions(shuffledData);
        setFallingOptions(shuffledData[0].options); // Set options for the first question
      })
      .catch((error) => console.error("Error fetching quiz data:", error));
  }, []);

  // Shuffle function (shuffles once)
  const shuffleArray = (array) => {
    return [...array].sort(() => Math.random() - 0.5);
  };

  useEffect(() => {
    if (shuffledQuestions.length > 0 && currentQuestion < shuffledQuestions.length) {
      setFallingOptions(shuffledQuestions[currentQuestion].options); // Update falling options based on the current question
    }
  }, [currentQuestion, shuffledQuestions]);

  // Handle movement of basket
  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key === "ArrowLeft") {
        setBasketPosition((prev) => Math.max(0, prev - 5));
      } else if (event.key === "ArrowRight") {
        setBasketPosition((prev) => Math.min(95, prev + 5));
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, []);

  // Move falling options downward
  const fallingOptionsRef = useRef(fallingOptions); // Reference to store falling options
  fallingOptionsRef.current = fallingOptions; // Update the reference on each render

  useEffect(() => {
    if (!fallingOptions.length) return;

    const interval = setInterval(() => {
      const updatedOptions = fallingOptionsRef.current.map((option) => ({
        ...option,
        positionY: option.positionY + 1.2, // Move down by 2 units each interval
      }));

      fallingOptionsRef.current = updatedOptions; // Persist the updated positions in the ref
      setFallingOptions([...updatedOptions]); // Use state to trigger rendering
    }, 100);

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, [fallingOptions]);

  // Handle answer selection via collision
  const handleAnswerClick = useCallback((selectedOption) => {
    let updatedScore = score;

    if (selectedOption.isCorrect) {
      updatedScore += correctMarks;
    } else {
      updatedScore -= negativeMarks;
      setMistakes((prevMistakes) => prevMistakes + 1);
    }

    setScore(updatedScore);

    setSelectedAnswers([...selectedAnswers, {
      question: shuffledQuestions[currentQuestion]?.question || "Unknown",
      selected: selectedOption.text,
      correct: shuffledQuestions[currentQuestion]?.correctAnswer || "Unknown",
      detailedSolution: shuffledQuestions[currentQuestion]?.detailedSolution || "Unknown",
      content: shuffledQuestions[currentQuestion]?.content || "Unknown",
      practiceMaterial: shuffledQuestions[currentQuestion]?.practiceMaterial || "Unknown"
    }]);

    if (mistakes + 1 >= maxMistakes) {
      handleShowResults();
      return;
    }

    const nextQuestion = currentQuestion + 1;
    if (nextQuestion < shuffledQuestions.length) {
      setCurrentQuestion(nextQuestion);
    } else {
      handleShowResults();
    }
    // eslint-disable-next-line 
  }, [score, mistakes, maxMistakes, currentQuestion, shuffledQuestions, selectedAnswers]); // Add dependencies for memoization


  // Navigate to results page with full review
  const handleShowResults = () => {
    // Ensure the last question's answer is added before navigating
    if (currentQuestion < shuffledQuestions.length) {
      setSelectedAnswers((prevAnswers) => [
        ...prevAnswers,
        {
          question: shuffledQuestions[currentQuestion]?.question || "Unknown",
          selected: "No Answer", // Provide a default value if necessary
          correct: shuffledQuestions[currentQuestion]?.correctAnswer || "Unknown",
          detailedSolution: shuffledQuestions[currentQuestion]?.detailedSolution || "Unknown",
          content: shuffledQuestions[currentQuestion]?.content || "Unknown",
          practiceMaterial: shuffledQuestions[currentQuestion]?.practiceMaterial || "Unknown"
        }
      ]);
    }

    navigate("/results", {
      state: { score, totalQuestions: shuffledQuestions.length, selectedAnswers },
    });
  };


  // Collision detection: Check if an option is caught by the basket
  useEffect(() => {
    const checkCollision = () => {
      setFallingOptions((prevOptions) => {
        return prevOptions.filter((option) => {
          if (option.positionY > 85 && option.positionY < 100 && Math.abs(option.positionX - basketPosition) < 10) {
            handleAnswerClick(option);
            return false;
          }
          return true;
        });
      });
    };

    const interval = setInterval(checkCollision, 100);
    return () => clearInterval(interval);
  }, [basketPosition, fallingOptions, handleAnswerClick]);

  return (
    <div className="game-container" ref={gameContainerRef}>
      <h2 className="question-text">
        {shuffledQuestions.length > 0 && currentQuestion < shuffledQuestions.length ? `Question: ${shuffledQuestions[currentQuestion].question}` : "Loading..."}
      </h2>
      <div className="scoreboard">
        <p>Score: {score}</p>
        <p>Mistakes: {mistakes} / {maxMistakes}</p>
      </div>

      {fallingOptions.map((option, index) => (
        <div
          key={index}
          className="falling-option"
          style={{
            left: `${option.positionX}%`,
            top: `${option.positionY}%`,
          }}
        >
          {option.text}
        </div>
      ))}

      {/* Basket controlled by arrow keys */}
      <div
        className="basket"
        style={{
          left: `${basketPosition}%`,
        }}
      >
        🏀
      </div>
    </div>
  );
};

export default Quiz;
