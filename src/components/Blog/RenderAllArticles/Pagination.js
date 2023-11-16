import React from "react";

const Pagination = ({ ArticlesPerPage, TotalArticles, paginate }) => {
  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(TotalArticles / ArticlesPerPage); i++) {
    pageNumbers.push(i);
  }
  return (
    <nav>
      <ul
        className="pagination"
        style={{ width: "fit-content", margin: "auto" }}
      >
        {pageNumbers.map((number) => (
          <li key={number} className="page-item">
            <a
              href="#Recent"
              onClick={() => paginate(number)}
              className="page-link"
            >
              {number}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Pagination;
