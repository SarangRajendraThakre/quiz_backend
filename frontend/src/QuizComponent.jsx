import React, { useState, useEffect } from "react";
import Lottie from "lottie-react";
import quizAnimation from "./assets/quiz.json"; // Import the Lottie animation file
import lotty2Animation from "./assets/lotty2.json";
import lottyanimationAnimation from "./assets/lottyanimation.json";

const QuizComponent = () => {
  const [quizData, setQuizData] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState(null);
  const [showCorrectAnswer, setShowCorrectAnswer] = useState(false);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [randomAnimation, setRandomAnimation] = useState(null);

  useEffect(() => {
    const fetchQuizData = async () => {
      try {
        const response = await fetch(
          "http://localhost:3001/api/quizzes/65f8f4188ba609f8dfa9e8c7"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch quiz data");
        }
        const data = await response.json();
        setQuizData(data);
      } catch (error) {
        console.error("Error fetching quiz data:", error);
      }
    };

    fetchQuizData();
  }, []);

  useEffect(() => {
    // Select a random animation when component mounts
    const animations = [quizAnimation, lotty2Animation, lottyanimationAnimation];
    const randomIndex = Math.floor(Math.random() * animations.length);
    setRandomAnimation(animations[randomIndex]);
  }, []);

  const handleOptionClick = (index) => {
    if (selectedOptionIndex === null) {
      setSelectedOptionIndex(index);
      setShowCorrectAnswer(index === getCorrectAnswerIndex());
      if (index === getCorrectAnswerIndex()) {
        setScore(score + 1);
      }
    }
  };

  const getCorrectAnswerIndex = () => {
    return parseInt(quizData.questions[currentQuestionIndex].correctAnswers[0]);
  };

  const moveToNextQuestion = () => {
    if (currentQuestionIndex < quizData.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedOptionIndex(null);
      setShowCorrectAnswer(false);
    } else {
      setQuizCompleted(true);
    }
  };

  if (!quizData) {
    return (
      <div className="h-screen flex justify-center items-center">
        <p className="text-lg">Loading...</p>
      </div>
    );
  }

  const currentQuestion = quizData.questions[currentQuestionIndex];
  const options = currentQuestion.options;

  return (
    <div className="h-screen flex justify-center items-center bg-gradient-to-b from-blue-200 to-blue-400">
      <div className="max-w-lg bg-white p-8 rounded-lg shadow-xl relative">
        <h1 className="text-3xl mb-6 font-bold text-center">
          {quizData.title}
        </h1>
        <div className="question-container bg-gray-100 p-6 rounded-lg shadow-md mb-6 relative">
          <h2 className="text-xl mb-4">{currentQuestion.questionText}</h2>
          <div className="options-list">
            {options.map((option, index) => (
              <button
                key={index}
                className={`option-button w-full px-4 py-2 mb-4 rounded-md transition duration-300 focus:outline-none ${
                  selectedOptionIndex !== null && selectedOptionIndex === index
                    ? showCorrectAnswer && index === getCorrectAnswerIndex()
                      ? "bg-green-500 hover:bg-green-600 text-white"
                      : "bg-red-500 hover:bg-red-600 text-white"
                    : "bg-blue-500 hover:bg-blue-600 text-white"
                }`}
                onClick={() => handleOptionClick(index)}
                disabled={selectedOptionIndex !== null}
              >
                {option}
              </button>
            ))}
          </div>
          {showCorrectAnswer && (
            <div className="lottie-container absolute top-0 left-0 w-full h-full z-10 flex justify-center items-center pointer-events-none">
              <Lottie
                className="w-full h-auto"
                animationData={randomAnimation} // Use randomly selected animation data
                loop={false}
                autoplay={true}
                style={{ background: "transparent" }} // Set transparent background
              />
            </div>
          )}
        </div>
        <button
          onClick={moveToNextQuestion}
          className={`next-button w-full px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition duration-300 focus:outline-none ${
            selectedOptionIndex === null ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={selectedOptionIndex === null}
        >
          Next
        </button>
        {quizCompleted && (
          <div className="result-container bg-gray-100 p-6 rounded-lg shadow-md text-center">
            <h2 className="text-xl mb-4">Quiz Completed!</h2>
            <p className="text-lg">
              Your Score: {score}/{quizData.questions.length}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizComponent;
