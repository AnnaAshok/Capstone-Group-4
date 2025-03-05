import { useState } from 'react';
import '../../admin.css';
import Header from './Header';
import Sidebar from './Sidebar';
import Home from './Home';
import Courses from './Courses';
import { Routes, Route } from 'react-router-dom';
import ListCategory from './CategoryManagement/ListCategory';
import AddCategory from './CategoryManagement/AddCategory';
import UpdateCategory from './CategoryManagement/UpdateCategory';
import ListCourses from './CourseManagement/ListCourses';
import AddCourse from './CourseManagement/AddCourse';
import UpdateCourse from './CourseManagement/UpdateCourse';

function AdminRoutes() {
  const [openSidebarToggle, setOpenSidebarToggle] = useState(false);

  const toggleSidebar = () => {
    setOpenSidebarToggle(!openSidebarToggle);
  };

  return (
    <div className="grid-container">
      <Header toggleSidebar={toggleSidebar} />
      <Sidebar openSidebarToggle={openSidebarToggle} OpenSidebar={toggleSidebar} />
      
      <Routes>
        <Route path="/" element={<Home />} /> 
        {/* <Route path="home" element={<Home />} />  */}
        <Route path="Courses" element={<ListCourses />} /> {/* Courses page route */}
        <Route path="addCourse" element={<AddCourse />} />
        <Route path="updateCourse/:id" element={<UpdateCourse />} />
        <Route path="Category" element={<ListCategory />} /> 
        <Route path="addCategory" element={<AddCategory />} />
        <Route path="updateCategory" element={<UpdateCategory />} />

        {/* Add more routes as necessary */}
      </Routes>
    </div>
  );
}

export default AdminRoutes;
