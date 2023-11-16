import React, { useState, useRef, useEffect } from "react";
import "./BlogHome.css";
import FeaturedCard from "../FeaturedCard/FeaturedCard";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import ArticlePreview from "../ArticlePreview/ArticlePreview";
import { Autoplay } from "swiper";
import { GETCOLLECTION, decrypt } from "../../../server";
import { Link } from "react-router-dom";
import RenderAllArticles from "../RenderAllArticles/RenderAllArticles";

const BlogHome = ({ users, General, Categories }) => {
  const [activePage, setActivePage] = useState("main");
  const [articles, setArticles] = useState([]);
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
  useEffect(() => {
    const FetchArticles = async () => {
      const tempArticles = await GETCOLLECTION("Articles");
      setArticles(tempArticles.reverse());
    };
    FetchArticles();
  }, []);
  const filteredBlogs = articles?.filter((blog) => {
    return General.Featured.some((Featured) => Featured.Blogid == blog.id);
  });

  const RenderFeatured = filteredBlogs?.map((Article) => {
    return (
      <SwiperSlide key={Article.id}>
        <FeaturedCard Article={Article} />
      </SwiperSlide>
    );
  });
  const RenderRecent = articles?.map((Article, index) => {
    if (index < 5) {
      return (
        <ArticlePreview
          key={Article.id}
          Article={Article}
          delay={index * 0.2}
        />
      );
    } else {
      return;
    }
  });
  const RenderCategories = Categories.map((Category) => {
    return (
      <li key={Category.id}>
        <Link to={`/BlogMain/Category/${Category.id}`}>
          {Category.Name} ({Category.Articles.length})
        </Link>
      </li>
    );
  });

  const RenderAuthors = users.map((user) => {
    if (user.Role === "User") {
      return;
    }
    if (user.deleteUser) {
      return;
    }
    const AuthorArticles = articles.filter((Article) => {
      return Article.Author.id == user.id;
    });
    const NameToRender = user.Fname + " " + user.Lname;
    const decryptedID = decrypt(user.id);
    return (
      <li key={decryptedID}>
        <Link to={`/BlogMain/Author/${decryptedID}`}>
          {NameToRender} ({AuthorArticles.length})
        </Link>
      </li>
    );
  });

  return (
    <div className="BlogPage">
      {filteredBlogs && (
        <div className="FeaturedArticles">
          <h1>Featured Articles</h1>
          {filteredBlogs.length === 0 && (
            <h4 style={{ textAlign: "center" }}>No Featured Articles yet</h4>
          )}
          <Swiper
            freeMode={true}
            loop={true}
            slidesPerView={1}
            spaceBetween={10}
            modules={[Autoplay]}
            autoplay={{
              delay: 2000,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            breakpoints={{
              900: {
                slidesPerView: 1,
                spaceBetween: 20,
              },
              250: {
                slidesPerView: 1,
                spaceBetween: 0,
              },
            }}
            className="mySwiper"
          >
            {RenderFeatured}
          </Swiper>
        </div>
      )}
      {width < 600 && (
        <div className="DropdownsWrapper">
          <div className="dropdown">
            <button className="dropdown-button">Categories</button>
            <div className="dropdown-content">{RenderCategories}</div>
          </div>
          <div className="dropdown">
            <button className="dropdown-button">Authors</button>
            <div className="dropdown-content">{RenderAuthors}</div>
          </div>
        </div>
      )}
      <div className="BlogMain">
        {activePage === "main" && (
          <div className="Recent-Blogs">
            <h1>Latest Articles</h1>
            {RenderRecent.length === 0 && (
              <h4 style={{ textAlign: "center" }}>No Articles yet</h4>
            )}
            {RenderRecent}
            <p
              className="ViewArticles"
              onClick={() => {
                setActivePage("AllArticles");
              }}
            >
              View All Articles
            </p>
          </div>
        )}
        {activePage === "AllArticles" && (
          <RenderAllArticles
            setActivePage={setActivePage}
            Articles={articles}
            Users={users}
          />
        )}
        {width > 600 && (
          <div className="SideBar">
            <div className="Categories">
              <h6>CATEGORY LIST</h6>
              <ul>{RenderCategories}</ul>
            </div>
            <div className="Categories">
              <h6>AUTHOR LIST</h6>
              <ul>{RenderAuthors}</ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogHome;
