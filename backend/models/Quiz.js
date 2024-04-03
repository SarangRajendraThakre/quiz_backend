const mongoose = require("mongoose");

const quizSchema = new mongoose.Schema({
  title: String,
  visibility: { type: String, enum: ["public", "private"], default: "public" }, // Add visibility field
  imagePath: String, // Add imagePath field for storing image path
  questions: [
    {
      questionText: String,
      options: [String],
      correctAnswers: [String],
      questionType: String,
    },
  ],
});

const Quiz = mongoose.model("Quiz", quizSchema);

module.exports = Quiz;
