import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import "./Quiz.css";
import basket from "../resources/basket.png";

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
          detailedSolution: q.detailed_solution || "Unknown",
          content: q.reading_material?.content_sections?.join(" ") || "<p>No content available</p>",
          practiceMaterial: q.reading_material?.practice_material?.content?.join(" ") || "<p>No practice material available</p>",
          options: shuffleArray(
            q.options?.map((opt, index) => ({
              id: opt.id,
              text: opt.description || "Unknown Option",
              isCorrect: opt.is_correct || false,
              positionX: Math.random() * 70 + 15,
              positionY: -10 - index * 25, // Start above the screen, making space between options
            })) || []
          ),
        }));
        console.log(formattedQuestions);
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
      correctAnswer: shuffledQuestions[currentQuestion]?.options.find(opt => opt.isCorrect).text,
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
  }, [score, mistakes, maxMistakes, currentQuestion, shuffledQuestions, selectedAnswers]);

  const handleShowResults = useCallback(() => {
    // Ensure the last question's answer is added before navigating
    if (currentQuestion < shuffledQuestions.length) {
      setSelectedAnswers((prevAnswers) => {
        const updatedAnswers = [
          ...prevAnswers,
          {
            question: shuffledQuestions[currentQuestion]?.question || "Unknown",
            selected: "No Answer",
            correct: shuffledQuestions[currentQuestion]?.correctAnswer || "Unknown",
            detailedSolution: shuffledQuestions[currentQuestion]?.detailedSolution || "Unknown",
            content: shuffledQuestions[currentQuestion]?.content || "Unknown",
            practiceMaterial: shuffledQuestions[currentQuestion]?.practiceMaterial || "Unknown",
          },
        ];

        // Remove duplicates based on question text
        const uniqueAnswers = updatedAnswers.filter(
          (value, index, self) =>
            index === self.findIndex((t) => t.question === value.question)
        );

        // Navigate after the state update
        navigate("/results", {
          state: { score, totalQuestions: shuffledQuestions.length, selectedAnswers: uniqueAnswers },
        });

        return uniqueAnswers; // Update state with unique answers
      });
    } else {
      // If all questions are completed, navigate without adding missed answers again
      const uniqueAnswers = selectedAnswers.filter(
        (value, index, self) =>
          index === self.findIndex((t) => t.question === value.question)
      );
      navigate("/results", {
        state: { score, totalQuestions: shuffledQuestions.length, selectedAnswers: uniqueAnswers },
      });
    }
  }, [currentQuestion, shuffledQuestions, score, navigate, selectedAnswers]);



  const handleMissedAnswer = useCallback(() => {
    setScore((prevScore) => prevScore - negativeMarks);
    setMistakes((prevMistakes) => prevMistakes + 1);

    // Track missed answers separately to prevent duplicates
    setSelectedAnswers([...selectedAnswers, {
      question: shuffledQuestions[currentQuestion]?.question || "Unknown",
      selected: "No Answer",
      correctAnswer: shuffledQuestions[currentQuestion]?.options.find(opt => opt.isCorrect).text,
      detailedSolution: shuffledQuestions[currentQuestion]?.detailedSolution || "Unknown",
      content: shuffledQuestions[currentQuestion]?.content || "Unknown",
      practiceMaterial: shuffledQuestions[currentQuestion]?.practiceMaterial || "Unknown"
    }]);

    // Move to the next question
    if (currentQuestion + 1 < shuffledQuestions.length) {
      setCurrentQuestion((prev) => prev + 1);
    } else {
      handleShowResults();
    }
  }, [currentQuestion, shuffledQuestions, handleShowResults, negativeMarks, selectedAnswers]);



  useEffect(() => {
    const checkCollisionAndMoveDown = () => {
      setFallingOptions((prevOptions) => {
        const updatedOptions = prevOptions.map((option) => {
          // Move options down
          const updatedOption = { ...option, positionY: option.positionY + 0.3 };
  
          // If the option has reached the basket, handle the answer click
          if (updatedOption.positionY > 80 && updatedOption.positionY < 100 && Math.abs(updatedOption.positionX - basketPosition) < 10) {
            handleAnswerClick(updatedOption);
            return null; // Remove caught option from the falling list
          }
  
          return updatedOption.positionY <= 100 ? updatedOption : null; // Keep options that haven't fallen off the screen
        }).filter(Boolean); // Remove null values
  
        // If ALL options have fallen off the screen (missed answer)
        if (prevOptions.length > 0 && updatedOptions.length === 0) {
          handleMissedAnswer();
        }
  
        return updatedOptions;
      });
    };
  
    const interval = setInterval(checkCollisionAndMoveDown, 50);
    return () => clearInterval(interval); 
  }, [basketPosition, handleAnswerClick, handleMissedAnswer]);
  



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
      <img
        src={basket}
        className="basket"
        alt="basket"
        style={{
          left: `${basketPosition}%`,
        }}
      />
    </div>
  );
};

export default Quiz;
