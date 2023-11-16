import React, { useState } from "react";
import ArticlePreview from "../ArticlePreview/ArticlePreview";
import Pagination from "./Pagination";
const RenderAllArticles = ({ Articles, setActivePage, Users }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [ArticlesPerPage] = useState(8);

  const paginate = (number) => {
    setCurrentPage(number);
  };

  // Get current articles
  const indexOfLastPost = currentPage * ArticlesPerPage;
  const indexOfFirstPost = indexOfLastPost - ArticlesPerPage;
  const currentArticles = Articles.slice(indexOfFirstPost, indexOfLastPost);
  const renderArticles = currentArticles.map((Article, index) => {
    return (
      <ArticlePreview key={Article.id} Article={Article} delay={index * 0.2} />
    );
  });
  return (
    <div className="Recent-Blogs" id="Recent">
      <h2>All Articles</h2>
      {renderArticles.length === 0 && (
        <h2 style={{ textAlign: "center" }}>No Articles yet</h2>
      )}
      {renderArticles}

      <p
        className="ViewArticles"
        onClick={() => {
          setActivePage("main");
        }}
      >
        View Recent Articles
      </p>
      <Pagination
        ArticlesPerPage={ArticlesPerPage}
        TotalArticles={Articles.length}
        paginate={paginate}
      />
    </div>
  );
};

export default RenderAllArticles;
