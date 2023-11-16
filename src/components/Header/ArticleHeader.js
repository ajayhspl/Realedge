import React from "react";
import "./Header.css";
import { useParams } from "react-router-dom";
const ArticleHeader = ({ Articles, bg, Users }) => {
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
        <div className="Header Second NoOverlay">
          <div className="Content" style={{ height: "92%" }}>
            <div className="TopBar"></div>
            <div className="BTM" style={{ gap: "10px" }}>
              <h1>{TargetArticle.Title}</h1>
              <span style={{ paddingLeft: "20px" }}>
                by {TargetArticle.Author.Fname} {TargetArticle.Author.Lname}
                {Creator ? "" : " (Deleted User)"}
              </span>
            </div>
          </div>
          <div
            className="overlay Photo"
            style={{
              backgroundImage: `url(${TargetArticle.thumbnail})`,
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
