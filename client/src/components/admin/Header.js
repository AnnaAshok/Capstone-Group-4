import React from "react";
import {
  BsFillBellFill,
  BsFillEnvelopeFill,
  BsPersonCircle,
  BsSearch,
  BsJustify,
} from "react-icons/bs";

function Header({ toggleSidebar }) {
  return (
    <header className="header">
      {/* Sidebar Toggle Button */}
      <div className="menu-icon">
        <BsJustify className="icon" onClick={toggleSidebar} />
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
