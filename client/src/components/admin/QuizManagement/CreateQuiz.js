import React,{useState} from 'react'

const CreateQuiz = () => {
    const [course, setCourse] = useState('');
    const [question, setQuestion] = useState('');
    const [options, setOptions] = useState(['', '', '', '']); // Assuming 4 options
    const [answer, setAnswer] = useState('');
    const [mark, setMark] = useState('');
  
    const handleOptionChange = (index, value) => {
      const updatedOptions = [...options];
      updatedOptions[index] = value;
      setOptions(updatedOptions);
    };
  
    const handleSubmit = (e) => {
      e.preventDefault();
      const newQuestion = {
        course,
        question,
        options,
        answer,
        mark,
      };
      console.log(newQuestion);
      // You can send this data to an API or store it in the state
    };
  
    return (
      <div>
        <h1>Create a New Question</h1>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Course</label>
            <select value={course} onChange={(e) => setCourse(e.target.value)}>
              <option value="">Select a course</option>
              <option value="course1">Course 1</option>
              <option value="course2">Course 2</option>
              <option value="course3">Course 3</option>
            </select>
          </div>
  
          <div>
            <label>Question</label>
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Enter the question"
              required
            />
          </div>
  
          <div>
            <label>Options</label>
            {options.map((option, index) => (
              <div key={index}>
                <input
                  type="text"
                  value={option}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                  placeholder={`Option ${index + 1}`}
                  required
                />
              </div>
            ))}
          </div>
  
          <div>
            <label>Answer</label>
            <input
              type="text"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Enter the correct answer"
              required
            />
          </div>
  
          <div>
            <label>Marks</label>
            <input
              type="number"
              value={mark}
              onChange={(e) => setMark(e.target.value)}
              placeholder="Enter marks"
              required
            />
          </div>
  
          <button type="submit">Create Question</button>
        </form>
      </div>
    );
  }

export default CreateQuiz