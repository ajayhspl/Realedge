import React, { useEffect, useState } from "react";
import "./Nav.css";
import NavDesktop from "./NavDesktop";
import NavMobile from "./NavMobile";
const Nav = ({ screenWidth, Tabs, Logo }) => {
  const [Color, setColor] = useState(false);

  const ChangeColor = () => {
    if (screenWidth < 500) {
      if (window.scrollY >= 20) {
        setColor(true);
      } else {
        setColor(false);
      }
    } else {
      if (window.scrollY >= 60) {
        setColor(true);
      } else {
        setColor(false);
      }
    }
  };
  useEffect(() => {
    window.addEventListener("scroll", () => {
      ChangeColor();
    });
  }, []);

  return (
    <div
      className={`NavContainer animate__animated animate__fadeInDown ${
        Color ? "NavContainer-bg" : ""
      }`}
    >
      <img
        onClick={() => {
          window.location.href = "/";
        }}
        className="Logo"
        src={Logo}
      />
      {screenWidth > 1000 ? (
        <NavDesktop screenWidth={screenWidth} Tabs={Tabs} />
      ) : (
        <NavMobile screenWidth={screenWidth} Tabs={Tabs} />
      )}
    </div>
  );
};

export default Nav;
