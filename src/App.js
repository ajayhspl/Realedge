/* eslint-disable no-debugger */
import React, { useState, useEffect } from "react";
import "./index.css";
import { Routes, Route } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Nav from "./components/Nav/Nav.js";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import Header2 from "./components/Header/Header2";

import Loading from "./assets/Loading.gif";
import { GETCOLLECTION } from "./server";
import NotFound from "./components/NotFound/NotFound.js";
import MainPage from "./components/MainPage";
import Aos from "aos";
import BlogHome from "./components/Blog/BlogHome/BlogHome";
import BlogCategory from "./components/Blog/SidePages/BlogCategory";
import ArticleHeader from "./components/Header/ArticleHeader";
import BlogAuthor from "./components/Blog/SidePages/BlogAuthor";
import ArticlePage from "./components/Blog/ArticlePage/ArticlePage";
import Portal from "./components/Portal/Portal";
import Settings from "./components/Settings/Settings";
import ArticleBuilder from "./components/Blog/ArticleBuilder/ArticleBuilder";
import Dashboard from "./components/Dashboard/Dashboard";
import UserDetails from "./components/Dashboard/UserDetails/UserDetails";
import Redirect from "./components/Redirect";
import CookiePopup from "./components/PopUps/CookiePopup";
import ViewMember from "./components/ViewMember/ViewMember";
import EditMember from "./components/Dashboard/Memebers/EditMember";
export const CreateToast = (text, type, duration = 4000) => {
  let value;
  switch (type) {
    case "success":
      value = toast.success;
      break;
    case "info":
      value = toast.info;
      break;
    case "warning":
      value = toast.warn;
      break;
    case "error":
      value = toast.error;
      break;
    default:
      value = toast;
      break;
  }
  return value(text, {
    position: "bottom-right",
    autoClose: duration,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
  });
};
function App() {
  const [agreeCookies] = useState(localStorage.getItem("Cookies"));
  const [users, setUsers] = useState(null);
  const [FetchedData, setFetchedData] = useState(null);
  const [BlogData, setBlogData] = useState(null);
  const [Articles, setArticles] = useState(null);
  const [Categories, setCategories] = useState(null);
  const [Teams, setTeams] = useState(null);
  const [webData, setWebData] = useState(null);
  const [Projects, setProjects] = useState(null);
  const [loading, setLoading] = useState(true);
  const [PageOrder, setPageOrder] = useState(null);
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
  // eslint-disable-next-line no-undef
  useEffect(() => {
    const fetchData = async () => {
      Promise.all([
        GETCOLLECTION("customization"),
        GETCOLLECTION("Projects"),
        GETCOLLECTION("Blog"),
        GETCOLLECTION("categories"),
        GETCOLLECTION("Articles"),
        GETCOLLECTION("users"),
        GETCOLLECTION("Team"),
      ])
        .then(
          ([
            customizationData,
            projectsData,
            blogData,
            categoriesData,
            Articles,
            users,
            Teams,
          ]) => {
            setWebData(customizationData[2]);
            setPageOrder(customizationData[0].PageOrder);
            setFetchedData(customizationData);
            setProjects(projectsData);
            setBlogData(blogData);
            setCategories(categoriesData);
            setArticles(Articles);
            setUsers(users);
            setTeams(Teams);
            setLoading(false);
          }
        )
        .catch((error) => {
          // Handle error
          console.log("Error fetching data", error);
        });
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (webData) {
      const metaDescriptionTag = document.querySelector(
        'meta[name="description"]'
      );
      metaDescriptionTag.content = webData.Description;

      const favicon = document.querySelector('link[rel="icon"]');
      favicon.href = webData.FavIcon;
      document.title = webData.WebsiteName;
      const root = document.documentElement;
      root.style.setProperty("--buttons", webData.Colors.ButtonColors);
      root.style.setProperty("--text", webData.Colors.Text);
      root.style.setProperty("--borders", webData.Colors.Borders);
      root.style.setProperty("--Lines", webData.Colors.Lines);
      root.style.setProperty("--HoverText", webData.Colors.HoverText);
      root.style.setProperty("--LinkLines", webData.Colors.LinkLines);
    }
  }, [webData]);
  useEffect(() => {
    Aos.init({ duration: 1000 });
  }, []);
  return (
    <div className="App">
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      <div className={`Loading-wrapper ${loading ? "" : "FADE"}`}>
        <img src={Loading} />
      </div>
      {loading ? (
        ""
      ) : (
        <>
          {!agreeCookies && <CookiePopup />}

          <Nav screenWidth={width} Tabs={FetchedData[1]} Logo={webData.Logo} />
          <Routes>
            <Route
              path="/"
              element={
                <>
                  <Header
                    screenWidth={width}
                    ServerData={FetchedData[0].Header}
                  />
                  <MainPage
                    width={width}
                    FetchedData={FetchedData}
                    Tabs={FetchedData[1]}
                    Projects={Projects}
                    PageOrder={PageOrder}
                  />
                </>
              }
            ></Route>
            <Route
              path="/blogMain"
              element={
                <>
                  <Header2 title={BlogData[0].Title} />
                  <BlogHome
                    users={users}
                    General={BlogData[0]}
                    Categories={Categories}
                  />
                </>
              }
            ></Route>
            <Route path="/Portal" element={<Portal />} />
            <Route path="/Settings" element={<Settings />} />
            <Route path="/Dashboard" element={<Dashboard />} />
            <Route
              path="/ArticleBuilder"
              element={
                <>
                  <Header2 title={"Share Your Story..."} bg={BlogData[0].BG} />
                  <ArticleBuilder Categories={Categories} />
                </>
              }
            />
            <Route path="*" element={<NotFound />}></Route>
            <Route
              path="/:NAME"
              element={
                <>
                  <Redirect
                    data={FetchedData[1]}
                    Projects={Projects}
                    Teams={Teams}
                  />
                </>
              }
            ></Route>
            <Route
              path="BlogMain/Article/:ID"
              element={
                <>
                  <ArticleHeader
                    Articles={Articles}
                    bg={BlogData[0].BG}
                    Users={users}
                  />
                  <ArticlePage
                    Categories={Categories}
                    Users={users}
                    width={width}
                  />
                </>
              }
            ></Route>
            <Route
              path="BlogMain/Author/:ID"
              element={
                <>
                  <Header2
                    title={BlogData[0].Title}
                    bg={BlogData[0].BG}
                    Users={users}
                  />
                  <BlogAuthor
                    width={width}
                    Users={users}
                    Articles={Articles}
                    Categories={Categories}
                  />
                </>
              }
            ></Route>
            <Route
              path="Dashboard/Member/:ID"
              element={<EditMember AllData={Teams} />}
            ></Route>
            <Route
              path="/Member/:ID"
              element={
                <>
                  <Header2
                    Teams={Teams}
                    title={FetchedData[1].Team.HeaderTitle}
                    bg={FetchedData[1].Team.BG}
                  />

                  <ViewMember AllData={Teams} Tabs={FetchedData[1]} />
                </>
              }
            ></Route>
            <Route path="/Dashboard/User/:ID" element={<UserDetails />}></Route>
            <Route
              path="BlogMain/Category/:ID"
              element={
                <>
                  <Header2
                    title={BlogData[0].Title}
                    bg={BlogData[0].BG}
                    BlogCategory={Categories}
                  />
                  <BlogCategory
                    width={width}
                    Categories={Categories}
                    Articles={Articles}
                    Users={users}
                  />
                </>
              }
            ></Route>
          </Routes>
          <Footer
            ServerData={FetchedData[0].FooterData}
            Tabs={FetchedData[1]}
          />
        </>
      )}
    </div>
  );
}

export default App;
