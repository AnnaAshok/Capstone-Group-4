const router = express.Router();

const QuizSchema = new mongoose.Schema({
  courseID: { type: mongoose.Schema.Types.ObjectId, ref: 'courses', required: true },
  question: { type: String, required: true },
  options: { type: [String], required: true },
  answer: { type: String, required: true },
  mark: { type: Number, required: true },
});

const QuizModel = mongoose.model("quizzes", QuizSchema);

// Get all quizzes
router.get("/api/quizzes", async (req, res) => {
  try {
    const quizzes = await QuizModel.find();
    res.json(quizzes);
  } catch (error) {
    res.status(500).json({ error: "Error fetching quizzes" });
  }
});

// Submit quiz answers
router.post("/api/submit-quiz", async (req, res) => {
  try {
    const { answers } = req.body;
    res.json({ message: "Quiz submitted successfully", answers });
  } catch (error) {
    res.status(500).json({ error: "Error submitting quiz" });
  }
});

export default router;
