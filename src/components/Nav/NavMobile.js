import React, { useState, useEffect } from "react";
import HamburgerButton from "../HamburgerButton/HamburgerButton";
import "./NavMobile.css";
import ContactPopUp from "../PopUps/ContactPopup/ContactPopup";
import sortBy from "sort-by";
import { GETCOLLECTION } from "../../server";
import { Link } from "react-router-dom";

const NavMobile = ({ Tabs }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showModal, setShowModal] = React.useState(false);
  const [nonList, setNonList] = useState([]);
  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);
  const [dropDowns, setDropDowns] = useState([]);
  const [TabsAR, setTabsAR] = useState([]);

  const urlFormatted = window.location.href
    .split("/")
    .pop()
    .replace(/%20/g, " ");

  useEffect(() => {
    if (Tabs) {
      let ArPages = [];
      let TempNon = [];

      for (const key in Tabs) {
        if (Object.hasOwnProperty.call(Tabs, key)) {
          const element = Tabs[key];
          ArPages.push({
            Name: key,
            PageName: element.PageName,
            PageURL: element.PageURL,
            DropDownFamily: element.DropDownFamily,
            id: element.id,
          });
        }
      }
      setTabsAR(ArPages);
      TempNon = ArPages.filter((Page) => {
        return Page.DropDownFamily === "0";
      });
      setNonList(TempNon.sort(sortBy("id")));
    }
  }, [Tabs]);
  const toggleMenu = (isOpen) => {
    setIsMenuOpen(isOpen);
  };
  const RenderNonList = nonList?.map((link) => {
    if (link.id === "16" || link.id === "17") {
      return;
    }
    if (link.PageURL) {
      return (
        <li key={link.id}>
          <Link
            className={urlFormatted === link ? "ActiveLink" : ""}
            onClick={() => {
              setIsMenuOpen(false);
            }}
            to={`/${link.PageURL}`}
          >
            {link.PageName}
          </Link>
        </li>
      );
    }
  });
  useEffect(() => {
    const fetchData = async () => {
      setDropDowns(await GETCOLLECTION("DropDown"));
    };
    fetchData();
  }, []);
  const Render = dropDowns.map((DropDown) => {
    if (DropDown.id == "0") {
      return;
    }
    const TabsToRender = DropDown.Pages.reduce((acc, pageId) => {
      const page = TabsAR.find((item) => item.id === pageId);
      if (page && page.PageURL) {
        acc.push(page);
      }
      return acc;
    }, []);
    return (
      <li key={DropDown.id} className="dropdown">
        <a style={{ cursor: "pointer" }}>
          <span>{DropDown.Name}</span>
        </a>
        <ul>
          {TabsToRender.map((link) => (
            <li key={link.id}>
              <Link
                className={urlFormatted === link ? "ActiveLink" : ""}
                onClick={() => {
                  setIsMenuOpen(false);
                }}
                to={`/${link.PageURL}`}
              >
                {link.PageName}
              </Link>
            </li>
          ))}
        </ul>
      </li>
    );
  });

  return (
    <>
      <HamburgerButton onToggleMenu={toggleMenu} isMenuOpen={isMenuOpen} />
      {isMenuOpen && (
        <div className="SideMenu animate__animated animate__fadeInRight">
          <nav id="navbar" className="navbar">
            <ul>
              <li className={urlFormatted === "" ? "ActiveLink" : ""}>
                <a href="/">Home</a>
              </li>

              {Render}
              {RenderNonList}
              <li className={urlFormatted === "Blog" ? "ActiveLink" : ""}>
                <a href="/BlogMain">Blog</a>
              </li>

              <li>
                <button className="Pricing" onClick={handleShowModal}>
                  Contact Us
                </button>
              </li>
            </ul>
          </nav>
        </div>
      )}
      <ContactPopUp
        show={showModal}
        handleClose={handleCloseModal}
        type="Contact"
      />
    </>
  );
};

export default NavMobile;
