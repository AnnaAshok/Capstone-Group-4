import { useState } from 'react';
import '../../admin.css';
import Header from './Header';
import Sidebar from './Sidebar';
import Home from './Home';
import Courses from './Courses';
import { Routes, Route } from 'react-router-dom';

function AdminRoutes() {
  const [openSidebarToggle, setOpenSidebarToggle] = useState(false);

  const OpenSidebar = () => {
    setOpenSidebarToggle(!openSidebarToggle);
  };

  return (
    <div className="grid-container">
      {/* Pass OpenSidebar function to Header */}
      <Header OpenSidebar={OpenSidebar} />
      
      {/* Pass sidebar toggle state and OpenSidebar function to Sidebar */}
      <Sidebar openSidebarToggle={openSidebarToggle} OpenSidebar={OpenSidebar} />
      
      {/* Admin Routes */}
      <Routes>
        <Route path="/" element={<Home />} /> {/* Home page route */}
        <Route path="/admin/home" element={<Home />} /> 
        <Route path="/admin/Courses" element={<Courses />} /> {/* Courses page route */}
        {/* Add more routes as necessary */}
      </Routes>
    </div>
  );
}

export default AdminRoutes;
