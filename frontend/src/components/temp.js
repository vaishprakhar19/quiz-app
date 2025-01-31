// import React, { useState, useEffect, useRef } from "react";
// import { useNavigate } from "react-router-dom";
// import "./Quiz.css"; // Import the Quiz CSS file

// const Quiz = () => {
//   const [currentQuestion, setCurrentQuestion] = useState(0);
//   const [score, setScore] = useState(0);
//   const [showScore, setShowScore] = useState(false);
//   const [selectedAnswers, setSelectedAnswers] = useState([]);
//   const [mistakes, setMistakes] = useState(0);
//   const [maxMistakes, setMaxMistakes] = useState(3);
//   const [shuffledQuestions, setShuffledQuestions] = useState([]);
//   const [correctMarks, setCorrectMarks] = useState(4);
//   const [negativeMarks, setNegativeMarks] = useState(1);
//   const questionsFetched = useRef(false); // Prevent multiple re-fetches
//   const navigate = useNavigate();

//   // Fetch the quiz data from the API
//   useEffect(() => {
//     if (questionsFetched.current) return; // Prevent re-fetching
//     questionsFetched.current = true;

//     fetch("http://localhost:5000/api/proxy")
//       .then((response) => response.json())
//       .then((data) => {
//         console.log("Fetched Data:", data);

//         // Extract correct & negative marks
//         setCorrectMarks(parseFloat(data.correct_answer_marks) || 4);
//         setNegativeMarks(parseFloat(data.negative_marks) || 1);
//         setMaxMistakes(parseFloat(data.max_mistake_count) || 9);

//         // Extract and format questions
//         const formattedQuestions = data.questions.map((q) => ({
//           id: q.id,
//           question: q.description,
//           topic: q.topic || "General",
//           difficulty: q.difficulty_level || "Unknown",
//           detailedSolution: q.detailed_solution || "No solution available",
//           content: q.reading_material?.content_sections?.join(" ") || "<p>No content available</p>",
//           practiceMaterial: q.reading_material?.practice_material?.content?.join(" ") || "<p>No practice material available</p>",
//           type: q.type || "General",
//           options: q.options.map((opt) => ({
//             id: opt.id,
//             text: opt.description,
//             isCorrect: opt.is_correct,
//           })),
//         }));

//         // Shuffle once and set state
//         const shuffledData = shuffleArray(formattedQuestions);
//         setShuffledQuestions(shuffledData);
//       })
//       .catch((error) => console.error("Error fetching quiz data:", error));
//   }, []);

//   // Function to shuffle an array (shuffles only ONCE)
//   const shuffleArray = (array) => {
//     return [...array].sort(() => Math.random() - 0.5);
//   };

//   // Handle answer selection
//   const handleAnswerClick = (selectedOption) => {
//     const currentQuestionData = shuffledQuestions[currentQuestion];

//     if (selectedOption.isCorrect) {
//       setScore((prevScore) => prevScore + correctMarks);
//     } else {
//       setScore((prevScore) => prevScore - negativeMarks);
//       setMistakes((prevMistakes) => prevMistakes + 1);
//     }

//     setSelectedAnswers([...selectedAnswers, {
//       question: currentQuestionData.question,
//       selected: selectedOption.text,
//       correct: currentQuestionData.options.find(opt => opt.isCorrect).text,
//       detailedSolution: currentQuestionData.detailedSolution,
//       content: currentQuestionData.content,
//       practiceMaterial: currentQuestionData.practiceMaterial
//     }]);

//     if (mistakes + 1 >= maxMistakes) {
//       setShowScore(true);
//       return;
//     }

//     const nextQuestion = currentQuestion + 1;
//     if (nextQuestion < shuffledQuestions.length) {
//       setCurrentQuestion(nextQuestion);
//     } else {
//       setShowScore(true);
//     }
//   };

//   // Navigate to results page with full review
//   const handleShowResults = () => {
//     navigate("/results", {
//       state: { score, totalQuestions: shuffledQuestions.length, selectedAnswers },
//     });
//   };

//   return (
//     <div className="quiz-container">
//       {showScore ? (
//         <div>
//           <h2 className="quiz-completed">Quiz Completed!</h2>
//           <p>Your Score: {score}</p>
//           <p>Mistakes: {mistakes} / {maxMistakes}</p>
//           <button className="show-results-button" onClick={handleShowResults}>
//             Show Results
//           </button>
//         </div>
//       ) : (
//         <div>
//           {shuffledQuestions.length > 0 ? (
//             <div>
//               <h2 className="quiz-question">
//                 Question {currentQuestion + 1} / {shuffledQuestions.length}
//               </h2>
//               <p className="quiz-question">{shuffledQuestions[currentQuestion]?.question || "Loading..."}</p>

//               <p><strong>Topic:</strong> {shuffledQuestions[currentQuestion]?.topic}</p>
//               <p><strong>Difficulty:</strong> {shuffledQuestions[currentQuestion]?.difficulty}</p>
//               <p><strong>Type:</strong> {shuffledQuestions[currentQuestion]?.type}</p>

//               <div className="quiz-options">
//                 {shuffledQuestions[currentQuestion]?.options.map((option, index) => (
//                   <button key={option.id} className="quiz-button" onClick={() => handleAnswerClick(option)}>
//                     {option.text}
//                   </button>
//                 ))}
//               </div>

//               <p><strong>Mistakes:</strong> {mistakes} / {maxMistakes}</p>
//             </div>
//           ) : (
//             <p>Loading quiz...</p>
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// export default Quiz;


// import React, { useState, useEffect, useRef } from "react";
// import { useNavigate } from "react-router-dom";
// import "./Quiz.css"; // Import CSS for game styles

// const Quiz = () => {
//   const [currentQuestion, setCurrentQuestion] = useState(0);
//   const [score, setScore] = useState(0);
//   const [mistakes, setMistakes] = useState(0);
//   const [maxMistakes, setMaxMistakes] = useState(3);
//   const [questions, setQuestions] = useState([]); // Store all questions
//   const [fallingOptions, setFallingOptions] = useState([]);
//   const [basketPosition, setBasketPosition] = useState(50);
//   const [correctMarks, setCorrectMarks] = useState(4);
//   const [negativeMarks, setNegativeMarks] = useState(1);
//   const [selectedAnswers, setSelectedAnswers] = useState([]);
//   const navigate = useNavigate();
//   const gameContainerRef = useRef(null);

//   // Fetch quiz data
//   useEffect(() => {
//     fetch("http://localhost:5000/api/proxy")
//       .then((response) => response.json())
//       .then((data) => {
//         console.log("Fetched Data:", data);

//         setMaxMistakes(data.max_mistake_count || 3);
//         setCorrectMarks(data.correct_answer_marks || 4);
//         setNegativeMarks(data.negative_marks || 1);

//         const formattedQuestions = data.questions.map((q) => ({
//           id: q.id,
//           question: q.description || "Unknown Question",
//           correctAnswer: q.options?.find((opt) => opt.isCorrect)?.description || "Unknown",
//           detailedSolution: q.detailed_solution || "Unknown",
//           content: q.reading_material?.content_sections?.join(" ") || "<p>No content available</p>",
//           practiceMaterial: q.reading_material?.practice_material?.content?.join(" ") || "<p>No practice material available</p>",
//           options: shuffleArray(
//             q.options?.map((opt) => ({
//               id: opt.id,
//               text: opt.description || "Unknown Option",
//               isCorrect: opt.is_correct || false,
//               positionX: Math.random() * 80 + 10,
//               positionY: 0,
//             })) || []
//           ),
//         }));

//         if (formattedQuestions.length > 0) {
//           setQuestions(formattedQuestions); // Store all questions
//           setFallingOptions(formattedQuestions[0].options); // Set first question
//         }
//       })
//       .catch((error) => console.error("Error fetching quiz data:", error));
//   }, []);

//   // Function to shuffle options
//   const shuffleArray = (array) => {
//     return [...array].sort(() => Math.random() - 0.5);
//   };

//   // Update falling options when currentQuestion changes
//   useEffect(() => {
//     if (questions.length > 0 && currentQuestion < questions.length) {
//       setFallingOptions(questions[currentQuestion].options);
//     }
//   }, [currentQuestion, questions]);

//   // Handle movement of basket
//   useEffect(() => {
//     const handleKeyPress = (event) => {
//       if (event.key === "ArrowLeft") {
//         setBasketPosition((prev) => Math.max(0, prev - 10));
//       } else if (event.key === "ArrowRight") {
//         setBasketPosition((prev) => Math.min(90, prev + 10));
//       }
//     };

//     window.addEventListener("keydown", handleKeyPress);
//     return () => window.removeEventListener("keydown", handleKeyPress);
//   }, []);

//   // Move falling options downward
//   const fallingOptionsRef = useRef(fallingOptions); // Reference to store falling options
//   fallingOptionsRef.current = fallingOptions; // Update the reference on each render

//   useEffect(() => {
//     if (!fallingOptions.length) return;

//     const interval = setInterval(() => {
//       const updatedOptions = fallingOptionsRef.current.map((option) => ({
//         ...option,
//         positionY: option.positionY + 5, // Move down by 5 units each interval
//       }));
//       fallingOptionsRef.current = updatedOptions; // Persist the updated positions in the ref

//       // Trigger a re-render to show updated positions
//       setFallingOptions([...updatedOptions]); // Use state to trigger rendering
//     }, 100); // Update every 200ms

//     return () => clearInterval(interval); // Cleanup interval on component unmount
//   }, [fallingOptions]); // Dependency on fallingOptions to initialize on first load





//   // Collision detection: Check if an option is caught by the basket
//   useEffect(() => {
//     const checkCollision = () => {
//       setFallingOptions((prevOptions) => {
//         return prevOptions.filter((option) => {
//           if (option.positionY > 85 && Math.abs(option.positionX - basketPosition) < 10) {
//             handleAnswerClick(option);
//             return false;
//           }
//           return true;
//         });
//       });
//     };

//     const interval = setInterval(checkCollision, 100);
//     return () => clearInterval(interval);
//   }, [basketPosition, fallingOptions]);

//   // Handle answer selection via collision
//   // Handle answer selection via collision
//   const handleAnswerClick = (selectedOption) => {
//     console.log("Answer Caught:", selectedOption.text);

//     if (selectedOption.isCorrect) {
//       setScore((prevScore) => prevScore + correctMarks);
//     } else {
//       setScore((prevScore) => prevScore - negativeMarks);
//       setMistakes((prevMistakes) => prevMistakes + 1);
//     }

//     setSelectedAnswers([...selectedAnswers, {
//       question: questions[currentQuestion]?.question || "Unknown",
//       selected: selectedOption.text,
//       correct: questions[currentQuestion]?.correctAnswer || "Unknown",
//       detailedSolution: questions[currentQuestion]?.detailedSolution || "Unknown",
//       content: questions[currentQuestion]?.content || "Unknown",
//       practiceMaterial: questions[currentQuestion]?.practiceMaterial || "Unknown"
//     }]);

//     // If mistakes exceed maxMistakes, navigate to results page with score
//     if (mistakes + 1 >= maxMistakes) {
//       handleShowResults(); // Use this function to navigate when game ends by mistakes
//       return;
//     }

//     const nextQuestion = currentQuestion + 1;
//     if (nextQuestion < questions.length) {
//       setCurrentQuestion(nextQuestion);
//     } else {
//       // If all questions are completed, navigate to results page with score
//       handleShowResults(); // Navigate when all questions are answered
//     }
//   };

//   // Navigate to results page with full review
//   const handleShowResults = () => {
//     navigate("/results", {
//       state: { score, totalQuestions: questions.length, selectedAnswers },
//     });
//   };

//   return (
//     <div className="game-container" ref={gameContainerRef}>
//       <h2 className="question-text">
//         {questions.length > 0 && currentQuestion < questions.length ? `Question: ${questions[currentQuestion].question}` : "Loading..."}
//       </h2>
//       <div className="scoreboard">
//         <p>Score: {score}</p>
//         <p>Mistakes: {mistakes} / {maxMistakes}</p>
//       </div>

//       {fallingOptions.map((option, index) => (
//         <div
//           key={index}
//           className="falling-option"
//           style={{
//             left: `${option.positionX}%`,
//             top: `${option.positionY}%`,
//           }}
//         >
//           {option.text}
//         </div>
//       ))}

//       {/* Basket controlled by arrow keys */}
//       <div
//         className="basket"
//         style={{
//           left: `${basketPosition}%`,
//         }}
//       >
//         🏀
//       </div>
//     </div>
//   );
// };

// export default Quiz;
