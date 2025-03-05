import React from "react";
import { BsJustify, BsFillBellFill, BsFillEnvelopeFill, BsPersonCircle, BsSearch } from "react-icons/bs";

function Header({ toggleSidebar }) {
  return (
    <header className="header">
      {/* Sidebar Toggle Button */}
      <div className="menu-icon" onClick={toggleSidebar}>
        <BsJustify className="icon" />
      </div>

      {/* Search Icon */}
      <div className="header-left">
        <BsSearch className="icon" />
      </div>

      {/* Notifications, Messages, and Profile Icons */}
      <div className="header-right">
        <BsFillBellFill className="icon" />
        <BsFillEnvelopeFill className="icon" />
        <BsPersonCircle className="icon" />
      </div>
    </header>
  );
}

export default Header;
