import React, { useState } from "react";
import axios from "axios";
import "./QuizForm.css"; // Import CSS file for styling

function QuizForm() {
  const [quizTitle, setQuizTitle] = useState("");
  const [questions, setQuestions] = useState([]);
  const [questionText, setQuestionText] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [correctAnswers, setCorrectAnswers] = useState([]);
  const [questionType, setQuestionType] = useState("");

  const addQuestion = () => {
    const newQuestion = {
      questionText,
      options,
      correctAnswers,
      questionType,
    };
    setQuestions([...questions, newQuestion]);
    // Clear input fields after adding question
    setQuestionText("");
    setOptions(["", "", "", ""]);
    setCorrectAnswers([]);
  };

  const handleSubmit = async () => {
    try {
      // Send quiz data to backend API including quizTitle
      await axios.post("http://localhost:3001/api/quizzes", {
        title: quizTitle, // Ensure title is included here
        questions,
      });
      alert("Quiz submitted successfully!");
    } catch (error) {
      console.error("Error submitting quiz:", error);
      alert("Failed to submit quiz. Please try again.");
    }
  };

  return (
    <div className="quiz-container bg-slate-500">
      <div className="quiz-form">
        <h2>Create Quiz</h2>
        {/* Quiz title input */}
        <div className="input-container">
          <label>Quiz Title:</label>
          <input
            type="text"
            value={quizTitle}
            onChange={(e) => setQuizTitle(e.target.value)}
            className="text-input"
          />
        </div>

        {/* Question input */}
        <div className="input-container">
          <label>Question Text:</label>
          <input
            type="text"
            value={questionText}
            onChange={(e) => setQuestionText(e.target.value)}
            className="text-input"
          />
        </div>

        {/* Options input for multiple-choice questions */}
        {questionType === "Multiple Choice" && (
          <div className="options-container">
            {options.map((option, index) => (
              <div className="option-item" key={index}>
                <label>{`Option ${index + 1}:`}</label>
                <input
                  type="text"
                  value={option}
                  onChange={(e) => {
                    const newOptions = [...options];
                    newOptions[index] = e.target.value;
                    setOptions(newOptions);
                  }}
                  className="text-input"
                />
                {/* Switch for correct answer */}
                <label>Correct:</label>
                <input
                  type="radio"
                  checked={correctAnswers.includes(index)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setCorrectAnswers([index]);
                    } else {
                      setCorrectAnswers([]);
                    }
                  }}
                />
              </div>
            ))}
          </div>
        )}

        {/* Options for True/False questions */}
        {questionType === "True/False" && (
          <div className="options-container">
            <label>Correct Answer:</label>
            <select
              value={correctAnswers[0]}
              onChange={(e) => setCorrectAnswers([e.target.value])}
              className="select-input"
            >
              <option value="">Select Correct Answer</option>
              <option value="true">True</option>
              <option value="false">False</option>
            </select>
          </div>
        )}

        {/* Options for Multiple Select questions */}
        {questionType === "Multiple Select" && (
          <div className="options-container">
            {options.map((option, index) => (
              <div className="option-item" key={index}>
                <label>{`Option ${index + 1}:`}</label>
                <input
                  type="text"
                  value={option}
                  onChange={(e) => {
                    const newOptions = [...options];
                    newOptions[index] = e.target.value;
                    setOptions(newOptions);
                  }}
                  className="text-input"
                />
                {/* Checkbox for correct answer */}
                <label>Correct:</label>
                <input
                  type="checkbox"
                  checked={correctAnswers.includes(index)}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    if (checked) {
                      setCorrectAnswers((prevState) => [...prevState, index]);
                    } else {
                      setCorrectAnswers((prevState) =>
                        prevState.filter((item) => item !== index)
                      );
                    }
                  }}
                />
              </div>
            ))}
          </div>
        )}

        {/* Select input for question type */}
        <div className="input-container">
          <label>Question Type:</label>
          <select
            value={questionType}
            onChange={(e) => setQuestionType(e.target.value)}
            className="select-input"
          >
            <option value="">Select a question type</option>
            <option value="Multiple Choice">Multiple Choice</option>
            <option value="True/False">True/False</option>
            <option value="Multiple Select">Multiple Select</option>
            {/* Add other question types here */}
          </select>
        </div>

        {/* Button to add question */}
        <button onClick={addQuestion} className="button">
          Add Question
        </button>

        {/* Render added questions */}
        <h3>Added Questions:</h3>
        <ul className="question-list">
          {questions.map((question, index) => (
            <li className="question-item" key={index}>
              <strong>Question {index + 1}: </strong>
              {question.questionText}
            </li>
          ))}
        </ul>

        {/* Button to submit all questions */}
        <button onClick={handleSubmit} className="button">
          Submit Quiz
        </button>
      </div>
    </div>
  );
}

export default QuizForm;
