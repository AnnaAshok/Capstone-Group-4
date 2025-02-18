import { useState } from "react";
import "../../admin.css";
import Header from "./Header";
import Sidebar from "./Sidebar";
import Home from "./Home";
import Courses from "./Courses";
import { Routes, Route } from "react-router-dom";

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
        <Route path="/admin/home" element={<Home />} /> 
        <Route path="/admin/Courses" element={<Courses />} />
      </Routes>
    </div>
  );
}

export default AdminRoutes;
