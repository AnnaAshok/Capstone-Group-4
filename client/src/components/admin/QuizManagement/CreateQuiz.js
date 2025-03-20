import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { TextField, Button, Box, Typography, Paper, Select, MenuItem, FormControl, IconButton } from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";

const CreateQuiz = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState([
    { label: "", value: "A" },
  ]);
  const [answer, setAnswer] = useState("");
  const [mark, setMark] = useState();
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("http://localhost:5000/getCourses")
      .then(response => setCourses(response.data))
      .catch(error => console.error("Error fetching courses:", error));
  }, []);

  const handleOptionChange = (index, field, value) => {
    const updatedOptions = [...options];
    updatedOptions[index][field] = value;
    setOptions(updatedOptions);

    // If the edited option was the selected answer, reset the answer
    if (field === "label" && answer === options[index].value) {
      setAnswer("");
    }
  };

  const addOption = () => {
    if (options.length < 4) {
      setOptions([
        ...options,
        { label: "", value: String.fromCharCode(65 + options.length) }, // Assign "C", "D"
      ]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newQuestion = {
      courseID: selectedCourse,
      question,
      options,
      answer,
      mark: Number(mark),
    };

    try {
      await axios.post("http://localhost:5000/questions", newQuestion);
      navigate("/admin/Questions");
    } catch (error) {
      console.error("Error creating quiz:", error);
    }
  };

  return (
    <main className="main-container">
      <Paper elevation={3} sx={{ padding: 3, margin: "auto" }}>
        <div className="list-quiz">
          <h3>Add Quiz</h3>
        </div>
        <form onSubmit={handleSubmit}>
          {/* Select Course */}
          <Box marginBottom={2}>
            <FormControl fullWidth sx={{ width: "50%" }} variant="outlined" size="small" required>
              <Typography variant="body1" sx={{ color: "#0F3460", marginBottom: "8px", marginTop: "20px", fontSize: "18px" }}>Select Course:</Typography>
              <Select value={selectedCourse} onChange={(e) => setSelectedCourse(e.target.value)} required>
                <MenuItem value=""><em>None</em></MenuItem>
                {courses.map((course) => (
                  <MenuItem key={course._id} value={course._id}>{course.title}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          {/* Question Input */}
          <Box marginBottom={2}>
            <Typography variant="body1" sx={{ color: "#0F3460", marginBottom: "8px", fontSize: "18px" }}>Question:</Typography>
            <TextField sx={{ width: "50%" }} variant="outlined" size="small" value={question} onChange={(e) => setQuestion(e.target.value)} required />
          </Box>

          {/* Options Input */}
          <div>
            <Typography variant="body1" sx={{ color: "#0F3460", marginBottom: "8px", fontSize: "18px" }}>Options:</Typography>
            {options.map((option, index) => (
              <Box key={index} marginBottom={1} display="flex" alignItems="center">
                <TextField
                  sx={{ width: "50%" }}
                  variant="outlined"
                  size="small"
                  value={option.label}
                  onChange={(e) => handleOptionChange(index, "label", e.target.value)}
                  placeholder={`Option ${index + 1}`}
                  required
                />
              </Box>
            ))}
            {options.length < 4 && (
              <IconButton onClick={addOption} color="primary">
                <AddCircleIcon />
              </IconButton>
            )}
          </div>

          {/* Answer Selection */}
          <Box marginBottom={2}>
            <Typography variant="body1" sx={{ color: "#0F3460", marginBottom: "8px", fontSize: "18px" }}>Answer:</Typography>
            <FormControl sx={{ width: "50%" }} variant="outlined" size="small">
              <Select value={answer} onChange={(e) => setAnswer(e.target.value)} required disabled={options.length < 2}>
                <MenuItem value=""><em>Select Correct Answer</em></MenuItem>
                {options.map((option, index) => (
                  <MenuItem key={index} value={option.value}>{option.label || `Option ${index + 1}`}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          {/* Marks Input */}
          <Box marginBottom={2}>
            <Typography variant="body1" sx={{ color: "#0F3460", marginBottom: "8px", fontSize: "18px" }}>Marks:</Typography>
            <TextField sx={{ width: "50%" }} variant="outlined" size="small" value={mark} onChange={(e) => setMark(e.target.value)} required type="number" />
          </Box>

          {/* Buttons */}
          <Box display="flex" gap={2} marginTop={2}>
            <Button type="submit" variant="contained">Save Quiz</Button>
            <Button variant="outlined" sx={{ border: "1px solid #0F3460", color: "#0F3460" }} onClick={() => navigate("/admin/Questions")}>Cancel</Button>
          </Box>
        </form>
      </Paper>
    </main>
  );
};

export default CreateQuiz;
