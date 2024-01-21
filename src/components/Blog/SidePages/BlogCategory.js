import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import ArticlePreview from "../ArticlePreview/ArticlePreview";
import { decrypt } from "../../../server";

const BlogCategory = ({ Categories, Articles, Users, width }) => {
  const [TargetCategory, setTargetCategory] = useState(null);
  const CategoryID = useParams().ID;
  useEffect(() => {
    let TempBlog;
    TempBlog = Categories.find((Category) => {
      return Category.id == CategoryID;
    });
    setTargetCategory(TempBlog);
  }, []);
  const RenderAuthors = Users.map((author) => {
    if (author.Role !== "Author") {
      return;
    }
    if (author.deleteUser) {
      return;
    }
    const decryptedID = decrypt(author.id);

    const AuthorArticles = Articles.filter((Article) => {
      return Article.Author.id == author.id;
    });
    const NameToRender = author.Fname + " " + author.Lname;
    return (
      <li key={decryptedID}>
        <Link to={`/BlogMain/Author/${decryptedID}`}>
          {NameToRender} ({AuthorArticles.length})
        </Link>
      </li>
    );
  });
  const RenderBlogs = TargetCategory?.Articles.map((Article, index) => {
    return <ArticlePreview key={Article.id} Article={Article} delay={index} />;
  });
  const RenderCategories = Categories.map((Category) => {
    return (
      <li key={Category.id}>
        <a href={`/BlogMain/Category/${Category.id}`}>
          {Category.Name} ({Category.Articles.length})
        </a>
      </li>
    );
  });
  return (
    <div>
      {TargetCategory?.Name && (
        <h1 style={{ margin: "auto", width: "95%" }}>{TargetCategory?.Name}</h1>
      )}
      <div className="BlogPage">
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
          <div className="Recent-Blogs">
            {TargetCategory?.Articles.length === 0 && (
              <h2 style={{ textAlign: "center" }}>No Articles yet</h2>
            )}
            {RenderBlogs}{" "}
            <Link to="/blogMain" className="Link Reverse">
              Go Back To Blogs
            </Link>
          </div>
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
    </div>
  );
};

export default BlogCategory;
