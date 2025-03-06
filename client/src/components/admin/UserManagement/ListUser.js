import React, { useState, useEffect } from 'react';
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import {
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
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
const ListUser = () => {
  const [openDialog, setOpenDialog] = useState(false); // State to control the dialog
  const [userToDelete, setUserToDelete] = useState(null); // Track the category to delete
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate()

  const limit = 10;

  useEffect(() => {
    fetchUsers();
  }, [currentPage]);

const fetchUsers = async () => {
  try {
    const response = await axios.post('http://localhost:5000/getUsers', {
      page: currentPage,
      limit: limit,
    });
    setUsers(response.data);
    // setTotalPages(response.data.totalPages);
  } catch (error) {
    console.error('Error fetching categories:', error);
  }
};

  // Handle editing a category
  const handleEdit = (id) => {
    navigate("/admin/UpdateUser", { state: { id } }); // Pass id via state
  };
  // Close the confirmation dialog
  const handleDialogClose = () => {
    setOpenDialog(false);
  };

  // Open the confirmation dialog
  const handleDialogOpen = (id) => {
    setUserToDelete(id)
    setOpenDialog(true); 
  };
   // Handle deleting a category
   const handleDelete = async () => {
    try {
      console.log(userToDelete)
      if (userToDelete) {
        const deletedUser = await axios.post(
          `http://localhost:5000/deleteUser/${userToDelete}`
        );
        fetchUsers(); // Refresh the user list
      }
    } catch (error) {
      console.error("Error deleting category:", error);
    } finally {
      setOpenDialog(false); // Close the dialog after the action is complete
    }
  };
  const handleAddUser=()=>{
    navigate("/admin/addUser");

  }
  return (
    <main className="main-container">
      <div className="list-courses">
        <h3>List of Users</h3>
        <button  onClick={handleAddUser}>Add new User</button>
      </div>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 700 }} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell>Id</StyledTableCell>
              <StyledTableCell>First Name</StyledTableCell>
              <StyledTableCell>Last Name</StyledTableCell>
              <StyledTableCell>Email</StyledTableCell>
              <StyledTableCell>Role</StyledTableCell>
              <StyledTableCell>Action</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.length > 0 ? (
              users.map((user, index) => (
                <StyledTableRow key={user._id}>
                  <StyledTableCell>{index + 1}</StyledTableCell>
                  <StyledTableCell>{user.firstName}</StyledTableCell>
                  <StyledTableCell>{user.lastName}</StyledTableCell>
                  <StyledTableCell>{user.email}</StyledTableCell>
                  <StyledTableCell>{user.role}</StyledTableCell>
                  <StyledTableCell>
                    <IconButton color="primary" onClick={() => handleEdit(user._id)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton color="error" onClick={() => handleDialogOpen(user._id)}>
                      <DeleteIcon />
                    </IconButton>
                  </StyledTableCell>
                </StyledTableRow>
              ))
            ) : (
              <StyledTableRow>
                <StyledTableCell colSpan={4}>No User available</StyledTableCell>
              </StyledTableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
       {/* Confirmation Dialog */}
        <Dialog
          open={openDialog}
          onClose={handleDialogClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{"Confirm Deletion"}</DialogTitle>
          <DialogContent>
            Are you sure you want to delete this category?
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDialogClose} color="primary">
              Cancel
            </Button>
            <Button onClick={handleDelete} color="warning" autoFocus>
              Confirm
            </Button>
          </DialogActions>
        </Dialog>
    </main>  )
}

export default ListUser