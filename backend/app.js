// app.js

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const Quiz = require("./models/Quiz");
const path = require("path");
const multer = require("multer");

const app = express();
const PORT = 3001;

// Multer Configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads"); // Specify the destination folder for uploads
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); // Use the original filename for the uploaded file
  },
});
const upload = multer({ storage: storage });

// Middleware
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Connect to MongoDB
mongoose
  .connect(
    "mongodb+srv://sarangyvt9:QHF8YF3h1FLLTbPS@cluster0.c1diock.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Error connecting to MongoDB:", err));

// Routes
app.get("/api/quizzes", async (req, res) => {
  try {
    const quizzes = await Quiz.find();
    res.json(quizzes);
  } catch (err) {
    console.error("Error fetching quizzes:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/api/quizzes/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const quiz = await Quiz.findById(id);
    if (!quiz) {
      return res.status(404).json({ error: "Quiz not found" });
    }
    res.json(quiz);
  } catch (err) {
    console.error("Error fetching quiz:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/api/quizzes", async (req, res) => {
  const { title, imagePath, questions } = req.body;
  try {
    const newQuiz = new Quiz({ title, imagePath, questions });
    await newQuiz.save();
    res.status(201).json(newQuiz);
  } catch (err) {
    console.error("Error creating quiz:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Upload Image Endpoint
app.post("/api/upload", upload.single("image"), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send("No file uploaded.");
    }
    const imagePath = `/uploads/${req.file.filename}`;
    res.json({ imagePath });
  } catch (err) {
    console.error("Error uploading image:", err);
    res.status(500).send("Internal server error");
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
