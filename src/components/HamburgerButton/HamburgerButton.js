import React, { useState } from "react";
import "./HamburgerButton.css";
const HamburgerButton = ({ onToggleMenu }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
    onToggleMenu(!isOpen); // Notify parent component about menu state change
  };

  return (
    <button
      className={`hamburger ${isOpen ? "open" : ""}`}
      onClick={toggleMenu}
    >
      <span></span>
      <span></span>
      <span></span>
    </button>
  );
};

export default HamburgerButton;
