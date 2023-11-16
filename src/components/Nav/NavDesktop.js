import React, { useEffect, useState } from "react";
import ContactPopUp from "../PopUps/ContactPopup/ContactPopup";
import { Link } from "react-router-dom";
import sortBy from "sort-by";
import { GETCOLLECTION } from "../../server";

const NavDesktop = ({ Tabs }) => {
  const urlFormatted = window.location.href
    .split("/")
    .pop()
    .replace(/%20/g, " ");
  const [ActivePage, setActivePage] = React.useState(urlFormatted);
  const [showModal, setShowModal] = React.useState(false);
  const [TabsAR, setTabsAR] = useState([]);
  const handleShowModal = () => setShowModal(true);
  const [dropDowns, setDropDowns] = useState([]);
  const [nonList, setNonList] = useState([]);
  const handleCloseModal = () => setShowModal(false);

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
  const RenderNonList = nonList?.map((link) => {
    if (link.id === "16" || link.id === "17") {
      return;
    }
    if (link.PageURL) {
      return (
        <li key={link.PageURL}>
          <Link
            className={ActivePage === link.PageURL ? "ActiveLink" : ""}
            onClick={() => {
              setActivePage(link.PageURL);
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
                className={ActivePage === link.PageURL ? "ActiveLink" : ""}
                onClick={() => {
                  setActivePage(link.PageURL);
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
      <nav id="navbar" className="navbar">
        <ul>
          <li
            className={ActivePage === "" ? "ActiveLink" : ""}
            onClick={() => {
              setActivePage("");
            }}
          >
            <Link to="/">Home</Link>
          </li>

          {Render}
          {RenderNonList}
          <li
            className={ActivePage === "Blog" ? "ActiveLink" : ""}
            onClick={() => {
              setActivePage("Blog");
            }}
          >
            <Link to="BlogMain">Blog</Link>
          </li>

          <li>
            <button className="Pricing" onClick={handleShowModal}>
              Contact Us
            </button>
          </li>
        </ul>
      </nav>
      <ContactPopUp
        show={showModal}
        handleClose={handleCloseModal}
        type="Contact"
      />
    </>
  );
};

export default NavDesktop;
