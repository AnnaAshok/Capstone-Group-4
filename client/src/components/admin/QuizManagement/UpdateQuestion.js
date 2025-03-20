import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { TextField, Button, Box, Typography, Paper, Select, MenuItem, FormControl, IconButton } from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";

const UpdateQuestion = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState([]);
  const [answer, setAnswer] = useState("");
  const [mark, setMark] = useState("");
  const navigate = useNavigate();
  const location = useLocation(); 


  useEffect(() => {
    axios.get("http://localhost:5000/getCourses")
      .then(response => setCourses(response.data))
      .catch(error => console.error("Error fetching courses:", error));
  }, []);

  useEffect(() => {
    const questionId = location.state?.id; 
    axios.get(`http://localhost:5000/questions/${questionId}`)
      .then(response => {
        const { courseID, question, options, answer, mark } = response.data;
        setSelectedCourse(courseID._id);
        setQuestion(question);
        setOptions(options);
        setAnswer(answer);
        setMark(mark);
      })
      .catch(error => console.error("Error fetching question details:", error));
  }, [location.state]);

  const handleOptionChange = (index, field, value) => {
    const updatedOptions = [...options];
    updatedOptions[index][field] = value;
    setOptions(updatedOptions);
  };

  const addOption = () => {
    if (options.length < 4) {
      setOptions([...options, { label: "", value: String.fromCharCode(65 + options.length) }]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedQuestion = {
      courseID: selectedCourse,
      question,
      options,
      answer,
      mark: Number(mark),
    };

    try {
      await axios.put(`http://localhost:5000/questions/${location.state?.id}`, updatedQuestion);
      navigate("/admin/Questions");
    } catch (error) {
      console.error("Error updating question:", error);
    }
  };

  return (
    <main className="main-container">
      <Paper elevation={3} sx={{ padding: 3, margin: "auto" }}>
        <div className="list-quiz">
          <h3>Update Quiz Question</h3>
        </div>
        <form onSubmit={handleSubmit}>
          <Box marginBottom={2}>
            <FormControl fullWidth sx={{ width: "50%" }} variant="outlined" size="small" required>
              <Typography variant="body1" sx={{ color: "#0F3460", marginBottom: "8px", fontSize: "18px" }}>Select Course:</Typography>
              <Select value={selectedCourse} onChange={(e) => setSelectedCourse(e.target.value)} required>
                {courses.map(course => (
                  <MenuItem key={course._id} value={course._id}>{course.title}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          <Box marginBottom={2}>
            <Typography variant="body1" sx={{ color: "#0F3460", marginBottom: "8px", fontSize: "18px" }}>Question:</Typography>
            <TextField sx={{ width: "50%" }} variant="outlined" size="small" value={question} onChange={(e) => setQuestion(e.target.value)} required />
          </Box>

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

          <Box marginBottom={2}>
            <Typography variant="body1" sx={{ color: "#0F3460", marginBottom: "8px", fontSize: "18px" }}>Answer:</Typography>
            <FormControl sx={{ width: "50%" }} variant="outlined" size="small">
              <Select value={answer} onChange={(e) => setAnswer(e.target.value)} required>
                {options.map((option, index) => (
                  <MenuItem key={index} value={option.value}>{option.label || `Option ${index + 1}`}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          <Box marginBottom={2}>
            <Typography variant="body1" sx={{ color: "#0F3460", marginBottom: "8px", fontSize: "18px" }}>Marks:</Typography>
            <TextField sx={{ width: "50%" }} variant="outlined" size="small" value={mark} onChange={(e) => setMark(e.target.value)} required type="number" />
          </Box>

          <Box display="flex" gap={2} marginTop={2}>
            <Button type="submit" variant="contained">Update Quiz</Button>
            <Button variant="outlined" sx={{ border: "1px solid #0F3460", color: "#0F3460" }} onClick={() => navigate("/admin/Questions")}>Cancel</Button>
          </Box>
        </form>
      </Paper>
    </main>
  );
};

export default UpdateQuestion;
