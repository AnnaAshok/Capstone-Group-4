import React from "react";
import { styled } from '@mui/material/styles';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import { Table, TableBody, TableContainer, TableHead, TableRow, Paper, IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import axios from "axios";
import DeleteIcon from "@mui/icons-material/Delete";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#0F3460",
    color: "#ffffff",
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

const CustomTable = ({ courses, setCourses }) => {
  // Handle editing a course
  const handleEdit = (id) => {
    console.log("Edit course ID:", id);
    // Add navigation logic for editing the course here
  };

  // Handle deleting a course
  const handleDelete = async (courseId) => {
    try {
      const deletedCourse = await axios.post(`http://localhost:5000/deleteCourse/${courseId}`);
      console.log(deletedCourse);

      // Remove deleted course from the list in the parent component
      setCourses((prevCourses) =>
        prevCourses.filter((course) => course._id !== courseId)
      );
    } catch (error) {
      console.error("Error deleting course:", error);
    }
  };

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 700 }} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell>Title</StyledTableCell>
            <StyledTableCell>Description</StyledTableCell>
            <StyledTableCell>Duration</StyledTableCell>
            <StyledTableCell>Price</StyledTableCell>
            <StyledTableCell>Image</StyledTableCell>
            <StyledTableCell>Actions</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {courses.length > 0 ? (
            courses.map((course) => (
              <StyledTableRow key={course._id}>
                <StyledTableCell>{course.title}</StyledTableCell>
                <StyledTableCell>{course.description}</StyledTableCell>
                <StyledTableCell>{course.duration}</StyledTableCell>
                <StyledTableCell>{course.price}</StyledTableCell>
                <StyledTableCell>
                  <img
                    src={`http://localhost:5000/${course.courseImage}`}
                    alt={course.title}
                    style={{ width: "50px", height: "50px", borderRadius: "5px" }}
                  />
                </StyledTableCell>
                <StyledTableCell>
                  <IconButton color="primary" onClick={() => handleEdit(course._id)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton color="error" onClick={() => handleDelete(course._id)}>
                    <DeleteIcon />
                  </IconButton>
                </StyledTableCell>
              </StyledTableRow>
            ))
          ) : (
            <StyledTableRow>
              <StyledTableCell colSpan={6}>No courses available</StyledTableCell>
            </StyledTableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default CustomTable;
