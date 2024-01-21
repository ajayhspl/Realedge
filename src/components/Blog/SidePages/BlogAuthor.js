import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import ArticlePreview from "../ArticlePreview/ArticlePreview";
import { encrypt, decrypt } from "../../../server";
const BlogAuthor = ({ Users, Articles, Categories, width }) => {
  const AuthorID = encrypt(useParams().ID);
  const [author, setAuthor] = useState(null);
  const RenderAuthors = Users.map((author) => {
    if (author.Role !== "Author") {
      return;
    }
    if (author.deleteUser) {
      return;
    }
    const AuthorArticles = Articles.filter((Article) => {
      return Article.Author.id == author.id;
    });

    const NameToRender = author.Fname + " " + author.Lname;
    const decryptedID = decrypt(author.id);
    return (
      <li key={decryptedID}>
        <Link to={`/BlogMain/Author/${decryptedID}`}>
          {NameToRender} ({AuthorArticles.length})
        </Link>
      </li>
    );
  });
  useEffect(() => {
    setAuthor(
      Users.find((author) => {
        return author.id === AuthorID;
      })
    );
  }, []);

  const RenderBlogs = Articles.map((Article, index) => {
    if (Article.Author.id == AuthorID) {
      return (
        <ArticlePreview key={Article.id} Article={Article} delay={index} />
      );
    }
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
    <div style={{ paddingBottom: "10px" }}>
      <h1 style={{ width: "95%", margin: "auto" }}>
        {author?.Fname} {author?.Lname}'s posts
      </h1>
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
            {RenderBlogs}
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

export default BlogAuthor;
