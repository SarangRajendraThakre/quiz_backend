// App.jsx
import React from "react";
import QuizForm from "./QuizForm";
import "./App.css";
import QuizComponent from "./QuizComponent";

const App = () => {
  return (
    <div>
      <QuizForm />
      <QuizComponent/>
    </div>
  );
};

export default App;
