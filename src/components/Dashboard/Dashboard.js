import React, { useEffect, useState } from "react";
import { CreateToast } from "../../App";
import { GETCOLLECTION, GETDOC, SETDOC, decrypt } from "../../server";
import "./Dashboard.css";
import WebSettings from "./Customization/WebSettings";
import Articles from "./Articles/Articles";
import Categories from "./Categories/Categories";
import Users from "./Users/Users";
import NotFound from "../NotFound/NotFound";
import ArticleBuilder from "../Blog/ArticleBuilder/ArticleBuilder";
import Settings from "../Settings/Settings";
import DropDowns from "./DropDowns/DropDowns";
import DropDownsIcon from "../../assets/Dropdowns.png";
import logout from "../../assets/logout.png";
import customization from "../../assets/customization.png";
import userIcon from "../../assets/user.png";
import categoriesIcon from "../../assets/categories.png";
import ArticlesIcon from "../../assets/Articles.png";
import addArticle from "../../assets/addArticle.png";
import UsersIcon from "../../assets/Users.png";
import expand from "../../assets/Expand.png";
import Shrink from "../../assets/Shrink.png";
import forms from "../../assets/forms.png";
import FormSubmits from "./FormSubmits/FormSubmits";
const Dashboard = () => {
  const [greeting, setGreeting] = useState("");
  const [activePage, setActivePage] = useState("Users");
  const [expanded, setExpanded] = useState(false);
  const [categories, setCategories] = useState([]);
  const [customizationPage, setCustomizationPage] = useState("Nav1");
  const [ActiveUser, setActiveUser] = useState(
    sessionStorage.getItem("activeUser")
      ? decrypt(JSON.parse(sessionStorage.getItem("activeUser")).id)
      : ""
  );
  const [authorized, setAuthorized] = useState(null);

  const [width, setWidth] = useState(window.innerWidth);

  function handleWindowSizeChange() {
    setWidth(window.innerWidth);
  }
  useEffect(() => {
    window.addEventListener("resize", handleWindowSizeChange);
    return () => {
      window.removeEventListener("resize", handleWindowSizeChange);
    };
  }, []);
  const CheckInfo = (res) => {
    const vals = Object.keys(res).map(function (key) {
      return res[key];
    });
    for (let index = 0; index < vals.length; index++) {
      if (typeof vals[index] !== "boolean") {
        if (typeof vals[index] !== "object")
          if (vals[index] !== 0) {
            if (!vals[index]) {
              CreateToast(
                `your Profile is incomplete! go to ${
                  res.admin ? "Admin Profile" : "settings"
                } to complete it`,
                "warning"
              );
              return;
            }
          }
      }
    }
  };
  useEffect(() => {
    const checkData = async () => {
      setCategories(await GETCOLLECTION("categories"));
      const FetchUser = await GETDOC("users", ActiveUser);
      setAuthorized(
        FetchUser.Role === "Admin" || FetchUser.Role === "Owner" ? true : false
      );
      setActiveUser(FetchUser);
      CheckInfo(FetchUser);
    };
    ActiveUser && checkData();
    if (new Date().getHours() < 12) setGreeting("Good morning");
    else if (new Date().getHours() < 18) setGreeting("Good afternoon");
    else setGreeting("Good evening");
  }, []);
  const logOut = async () => {
    CreateToast("logging out..");
    let cleanData = [];
    await GETCOLLECTION("users").then((response) => {
      cleanData = response;
    });
    cleanData.forEach(async (User) => {
      if (User.id === ActiveUser.id) {
        User.Active = false;
      }
      await SETDOC("users", User.id, { ...User });
      sessionStorage.clear();
      window.location.href = "/";
    });
  };
  return (
    <div className="Dashboard">
      {width < 800 ? (
        <h1 className="Reject">
          Sorry you must be on a larger screen to view this page
        </h1>
      ) : authorized ? (
        <>
          <div className={`${expanded ? "Expanded" : ""} SideBar`}>
            <h3 className="Greet">
              {expanded && (
                <p
                  className=" animate__animated animate__fadeInDown"
                  style={{ position: "absolute", top: "-15px" }}
                >
                  {greeting}
                </p>
              )}
              <span
                className=" animate__animated animate__fadeInUp"
                style={{ animationDelay: ".3s" }}
              >
                {ActiveUser.Username}
              </span>
            </h3>
            <ul className="BTNList">
              <li
                onClick={() => {
                  setActivePage("Users");
                }}
                style={{ animationDelay: ".4s" }}
                className="animate__animated animate__fadeInLeft"
              >
                {expanded ? (
                  <span
                    className={`${activePage === "Users" ? "focus" : ""} Link`}
                  >
                    -Users
                  </span>
                ) : (
                  <img
                    src={UsersIcon}
                    className={`${activePage === "Users" ? "focus" : ""} Icon`}
                  />
                )}
              </li>
              <li
                onClick={() => {
                  setActivePage("Articles");
                }}
                style={{ animationDelay: ".5s" }}
                className="animate__animated animate__fadeInLeft"
              >
                {expanded ? (
                  <span
                    className={`${
                      activePage === "Articles" ? "focus" : ""
                    } Link`}
                  >
                    -Articles
                  </span>
                ) : (
                  <img
                    src={ArticlesIcon}
                    className={`${
                      activePage === "Articles" ? "focus" : ""
                    } Icon`}
                  />
                )}
              </li>

              <li
                onClick={() => {
                  setActivePage("Create");
                }}
                style={{ animationDelay: ".6s" }}
                className="animate__animated animate__fadeInLeft"
              >
                {expanded ? (
                  <span
                    className={`${activePage === "Create" ? "focus" : ""} Link`}
                  >
                    -Create An Article
                  </span>
                ) : (
                  <img
                    src={addArticle}
                    className={`${activePage === "Create" ? "focus" : ""} Icon`}
                  />
                )}
              </li>

              <li
                onClick={() => {
                  setActivePage("Categories");
                }}
                style={{ animationDelay: ".7s" }}
                className="animate__animated animate__fadeInLeft"
              >
                {expanded ? (
                  <span
                    className={`${
                      activePage === "Categories" ? "focus" : ""
                    } Link`}
                  >
                    -Categories
                  </span>
                ) : (
                  <img
                    src={categoriesIcon}
                    className={`${
                      activePage === "Categories" ? "focus" : ""
                    } Icon`}
                  />
                )}
              </li>

              <li
                onClick={() => {
                  setActivePage("Profile");
                }}
                style={{ animationDelay: ".8s" }}
                className="animate__animated animate__fadeInLeft"
              >
                {expanded ? (
                  <span
                    className={`${
                      activePage === "Profile" ? "focus" : ""
                    } Link`}
                  >
                    -Admin Profile
                  </span>
                ) : (
                  <img
                    src={userIcon}
                    className={`${
                      activePage === "Profile" ? "focus" : ""
                    } Icon`}
                  />
                )}
              </li>

              <li
                onClick={() => {
                  setActivePage("Dropdowns");
                }}
                style={{ animationDelay: ".9s" }}
                className="animate__animated animate__fadeInLeft"
              >
                {expanded ? (
                  <span
                    className={`Link ${
                      activePage === "Dropdowns" ? "focus" : ""
                    }`}
                  >
                    -Dropdowns
                  </span>
                ) : (
                  <img
                    src={DropDownsIcon}
                    className={`Icon ${
                      activePage === "Dropdowns" ? "focus" : ""
                    }`}
                  />
                )}
              </li>

              <li
                onClick={() => {
                  setActivePage("forms");
                }}
                style={{ animationDelay: ".9s" }}
                className="animate__animated animate__fadeInLeft"
              >
                {expanded ? (
                  <span
                    className={`Link ${activePage === "forms" ? "focus" : ""}`}
                  >
                    -Form submits
                  </span>
                ) : (
                  <img
                    src={forms}
                    className={`Icon ${activePage === "forms" ? "focus" : ""}`}
                  />
                )}
              </li>
              <li
                onClick={() => {
                  setActivePage("Customization");
                }}
                style={{ animationDelay: ".9s" }}
                className="animate__animated animate__fadeInLeft"
              >
                {expanded ? (
                  <span
                    className={`Link ${
                      activePage === "Customization" ? "focus" : ""
                    }`}
                  >
                    -Customization
                  </span>
                ) : (
                  <img
                    src={customization}
                    className={`Icon ${
                      activePage === "Customization" ? "focus" : ""
                    }`}
                  />
                )}
              </li>

              <li
                onClick={logOut}
                style={{ animationDelay: "1s", marginTop: "auto" }}
                className={`animate__animated animate__fadeInLeft`}
              >
                {expanded ? (
                  <span className="Link">-Logout</span>
                ) : (
                  <img src={logout} className="Icon" />
                )}
              </li>
            </ul>

            <img
              onClick={() => {
                setExpanded((prev) => !prev);
              }}
              className={`animate__animated animate__fadeInLeft`}
              style={{
                margin: "auto",
                width: "25px",
                cursor: "pointer",
                animationDelay: "1.1s",
              }}
              src={expanded ? Shrink : expand}
            />
          </div>
          <div className="Page">
            {activePage === "Users" && <Users />}
            {activePage === "Create" && (
              <ArticleBuilder Categories={categories} />
            )}
            {activePage === "forms" && <FormSubmits />}
            {activePage === "Customization" && (
              <WebSettings
                customizationPage={customizationPage}
                SetCustomizationPage={setCustomizationPage}
              />
            )}
            {activePage === "Categories" && <Categories />}
            {activePage === "Profile" && <Settings />}
            {activePage === "Dropdowns" && (
              <DropDowns
                setActivePageDash={setActivePage}
                SetCustomizationPage={setCustomizationPage}
              />
            )}
            {activePage === "Articles" && <Articles />}
          </div>
        </>
      ) : (
        <NotFound />
      )}
    </div>
  );
};

export default Dashboard;
