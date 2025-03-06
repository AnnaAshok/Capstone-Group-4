import React, { useState ,useEffect} from "react";
import { TextField, Button, Box, Typography, Paper, Select, MenuItem, InputLabel, FormControl } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const UpdateUser = () => {
    const navigate = useNavigate();
    const location = useLocation(); 
    const [roles, setRoles] = useState([]);

    const [userData, setUserData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        roleID: "", 
        });
        
 const [errors, setErrors] = useState({});
        

const userId = location.state?.id; // Access the id passed via state

  // Handle input change
  const handleChange = (event) => {
    const { name, value } = event.target;
    setUserData({ ...userData, [name]: value });
};
  const handleCancel = () => {
      navigate("/admin/Users");
  };

// Fetch roles from the API
useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await axios.get("http://localhost:5000/roles"); // Adjust the URL to match your backend
        setRoles(response.data); 
      } catch (error) {
        console.error("Error fetching roles:", error);
      }
    };

    const fetchUserData = async () => {
      try {
        const response = await axios.post(`http://localhost:5000/getUserById/${userId}`);
        setUserData(response.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    if (userId) {
      fetchUserData(); // Fetch the user data when the page loads
    }

    fetchRoles();
  }, [userId]);

  console.log(userData)
    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
          if (!userId) {
            console.error("User ID not found");
            return;
          }
          const response = await axios.post(`http://localhost:5000/updateUser/${userId}`, userData);
      
          // Redirect or show success message
          navigate("/admin/Users");
        } catch (error) {
          console.error("Failed to update user:", error.response?.data || error.message);
        }
      };
      console.log(userData.roleID.role)
  return (
    <main className="main-container">
    <Paper elevation={3} sx={{ padding: 3, margin: "auto" }}>
      <div className="list-category">
        <h3>Update Existing user</h3>
      </div>
      <form onSubmit={handleSubmit}>
        <Box marginBottom={2}>
          <Typography variant="body1" sx={{ color: "#0F3460", marginBottom: "8px", fontSize: "18px" }}>
            First Name:
          </Typography>
          <TextField
            name="firstName"
            sx={{ width: "50%" }}
            variant="outlined"
            size="medium"
            value={userData.firstName} 
            onChange={handleChange} 
          />
        </Box>
        <Box marginBottom={2}>
          <Typography variant="body1" sx={{ color: "#0F3460", marginBottom: "8px", fontSize: "18px" }}>
            Last Name:
          </Typography>
          <TextField
            name="lastName"
            sx={{ width: "50%" }}
            variant="outlined"
            size="medium"
            value={userData.lastName} 
            onChange={handleChange} 
          />
        </Box>
        <Box marginBottom={2}>
          <Typography variant="body1" sx={{ color: "#0F3460", marginBottom: "8px", fontSize: "18px" }}>
            Email:
          </Typography>
          <TextField
             name="email"
            sx={{ width: "50%" }}
            variant="outlined"
            size="medium"
            value={userData.email} 
            onChange={handleChange} 
          />
        </Box>
        <Box marginBottom={2}>
          <Typography variant="body1" sx={{ color: "#0F3460", marginBottom: "8px", fontSize: "18px" }}>
            Password:
          </Typography>
          <TextField
          name="password"
            sx={{ width: "50%" }}
            variant="outlined"
            size="medium"
            value={userData.password} 
            onChange={handleChange} 
          />
      </Box>
      <Box marginBottom={2}>
          <FormControl fullWidth variant="outlined" size="small">
          <Typography variant="body1" sx={{ color: "#0F3460", marginBottom: "8px", marginTop:"20px", fontSize: "18px" }}>
              Select Role:
          </Typography>
          <Select
            name="roleID"
            value={userData.roleID?._id || userData.roleID || ""}
            onChange={handleChange}
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            {roles.map((role) => (
              <MenuItem key={role._id} value={role._id}>
                {role.role}
              </MenuItem>
            ))}
          </Select>
          </FormControl>
      </Box>
      <Box display="flex" gap={2} marginTop={2}>
          <Button type="submit" variant="contained">Save</Button>
          <Button variant="outlined" sx={{ border: "1px solid #0F3460", color: "#0F3460" }} onClick={handleCancel}>
            Cancel
          </Button>
      </Box>
      </form>
    </Paper>
  </main>
  )
}

export default UpdateUser