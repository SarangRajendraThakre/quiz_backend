import React, { useState, useEffect } from "react";
import Lottie from "lottie-react";
import quizAnimation from "./assets/quiz.json";
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
          "http://localhost:3001/api/quizzes/660d402fe9bb5fe83d85846e"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch quiz data");
        }
        const data = await response.json();
        shuffleQuestions(data.questions);
        setQuizData(data);
      } catch (error) {
        console.error("Error fetching quiz data:", error);
      }
    };

    fetchQuizData();
  }, []);

  useEffect(() => {
    const animations = [
      quizAnimation,
      lotty2Animation,
      lottyanimationAnimation,
    ];
    const randomIndex = Math.floor(Math.random() * animations.length);
    setRandomAnimation(animations[randomIndex]);
  }, []);

  const shuffleQuestions = (questions) => {
    for (let i = questions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [questions[i], questions[j]] = [questions[j], questions[i]];
    }
  };

  const handleOptionClick = (index) => {
    if (!quizCompleted) {
      setSelectedOptionIndex(index);
      setShowCorrectAnswer(true);
      const currentQuestionType = getCurrentQuestionType();
      if (currentQuestionType !== "True/False") {
        if (index === getCorrectAnswerIndex()) {
          setScore(score + 1);
        }
      } else {
        if (
          index ===
          (currentQuestion.correctAnswers === "true" ? 0 : 1)
        ) {
          setScore(score + 1);
        }
      }
    }
  };

  const getCurrentQuestionOptions = () => {
    return quizData?.questions[currentQuestionIndex]?.options || [];
  };

  const getCorrectAnswerIndex = () => {
    const correctAnswers =
      quizData.questions[currentQuestionIndex].correctAnswers;
    if (Array.isArray(correctAnswers)) {
      return correctAnswers.map((ans) => parseInt(ans));
    } else if (getCurrentQuestionType() === "True/False") {
      return correctAnswers === "true" ? 0 : 1;
    } else {
      return getCurrentQuestionOptions().indexOf(correctAnswers);
    }
  };

  const getCurrentQuestionType = () => {
    return quizData?.questions[currentQuestionIndex]?.questionType || "";
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
  const options = getCurrentQuestionOptions();
  const questionType = getCurrentQuestionType();

  return (
    <div
      className="h-screen flex justify-center items-center"
      style={{
        backgroundImage: `url(${quizData.imagePath})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="max-w-lg bg-white p-8 rounded-lg shadow-xl relative">
        <h1 className="text-3xl mb-6 font-bold text-center">
          {quizData.title}
        </h1>
        <div className="question-container bg-gray-100 p-6 rounded-lg shadow-md mb-6 relative">
          <h2 className="text-xl mb-4">{currentQuestion.questionText}</h2>
          <div className="options-list">
            {questionType === "True/False"
              ? ["True", "False"].map((option, index) => (
                  <button
                    key={index}
                    className={`option-button w-full px-4 py-2 mb-4 rounded-md transition duration-300 focus:outline-none ${
                      selectedOptionIndex !== null &&
                      selectedOptionIndex === index
                        ? showCorrectAnswer &&
                          index ===
                            (currentQuestion.correctAnswers === "true" ? 0 : 1)
                          ? "bg-green-500 hover:bg-green-600 text-white"
                          : "bg-red-500 hover:bg-red-600 text-white"
                        : "bg-blue-500 hover:bg-blue-600 text-white"
                    }`}
                    onClick={() => handleOptionClick(index)}
                    disabled={quizCompleted}
                  >
                    {option}
                  </button>
                ))
              : options.map((option, index) => (
                  <button
                    key={index}
                    className={`option-button w-full px-4 py-2 mb-4 rounded-md transition duration-300 focus:outline-none ${
                      selectedOptionIndex !== null &&
                      selectedOptionIndex === index
                        ? showCorrectAnswer &&
                          getCorrectAnswerIndex().includes(index)
                          ? "bg-green-500 hover:bg-green-600 text-white"
                          : "bg-red-500 hover:bg-red-600 text-white"
                        : "bg-blue-500 hover:bg-blue-600 text-white"
                    }`}
                    onClick={() => handleOptionClick(index)}
                    disabled={quizCompleted}
                  >
                    {option}
                  </button>
                ))}
          </div>
          {showCorrectAnswer && (
            <div className="lottie-container absolute top-0 left-0 w-full h-full z-10 flex justify-center items-center pointer-events-none">
              <Lottie
                className="w-full h-auto"
                animationData={randomAnimation}
                loop={false}
                autoplay={true}
                style={{ background: "transparent" }}
              />
            </div>
          )}
        </div>
        <button
          onClick={moveToNextQuestion}
          className={`next-button w-full px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition duration-300 focus:outline-none ${
            selectedOptionIndex === null || quizCompleted
              ? "opacity-50 cursor-not-allowed"
              : ""
          }`}
          disabled={selectedOptionIndex === null || quizCompleted}
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
