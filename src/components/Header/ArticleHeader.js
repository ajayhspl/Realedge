/* NOT USED RIGHT NOW*/
import React from "react";
import "./Header.css";
import { useParams } from "react-router-dom";
const ArticleHeader = ({ Articles, Users, screenWidth }) => {
  const Article = useParams().ID;
  let TargetArticle = Articles.find((blog) => {
    return blog.id == Article;
  });
  let Creator = TargetArticle
    ? Users.find((Author) => {
        return Author.id == TargetArticle.Author.id;
      })
    : null;
  return (
    <>
      {TargetArticle ? (
        <div
          className="Header Second Article"
          style={{ height: screenWidth > 1000 ? "calc(100vh - 90px)" : "60vh" }}
        >
          <div className="Content">
            <div
              className="TopBar"
              style={{ height: screenWidth > 1000 ? "50vh" : "" }}
            ></div>
            <div className="BTM" style={{ gap: "10px", maxHeight: "unset" }}>
              <h1
                style={{
                  fontSize: TargetArticle.Title.length > 40 ? "3rem" : "3.5rem",
                }}
              >
                {TargetArticle.Title}
              </h1>
              <span style={{ marginBottom: "10px" }}>
                by {TargetArticle.Author.Fname} {TargetArticle.Author.Lname}
                {Creator ? "" : " (Deleted User)"}
              </span>
            </div>
          </div>
          <div
            className="overlay Photo"
            style={{
              backgroundImage: `url(${TargetArticle.thumbnail})`,
              width: "100%",
            }}
          ></div>
        </div>
      ) : (
        ""
      )}
    </>
  );
};

export default ArticleHeader;
