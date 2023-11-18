import React from "react";
import { useState } from "react";
import {
  Distributor,
  GETCOLLECTION,
  GETDOC,
  SETDOC,
  UPLOADPHOTO,
  decrypt,
} from "../../../server";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import NotFound from "../../NotFound/NotFound";
import "../../Blog/ArticleBuilder/ArticleBuilder.css";
import { CreateToast } from "../../../App";
import date from "date-and-time";
import Upload from "../../../assets/upload.png";
import MyEditor from "../../Blog/ArticleBuilder/Editor";
const pattern = date.compile("HH A ,MMM DD YYYY");

const EditBlog = () => {
  const [ActiveUser, setActiveUser] = useState(
    sessionStorage.getItem("activeUser")
      ? decrypt(JSON.parse(sessionStorage.getItem("activeUser")).id)
      : ""
  );
  const id = useParams().ID;
  const [authorized, setAuthorized] = useState(null);
  const [article, setArticle] = useState(null);
  const [authorList, setAuthorList] = useState([]);
  const [chosenAuthor, setChosenAuthor] = useState(null);
  const [Categories, setCategories] = useState(null);
  const [Updated, SetUpdated] = useState(false);
  const handlePostBodyChange = (value) => {
    function calculateReadTime(html) {
      const wordsPerMinute = 200;

      // Parse the HTML into a document object
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, "text/html");

      // Extract the text content from the document
      const text = doc.body.textContent || "";

      // Count the number of words in the extracted text
      const wordCount = text.trim().split(/\s+/).length;

      // Calculate the read time in minutes
      const readTimeInMinutes = Math.ceil(wordCount / wordsPerMinute);

      return readTimeInMinutes;
    }
    setArticle((prevArticle) => ({
      ...prevArticle,
      PostBody: value,
      ReadTime: calculateReadTime(value),
    }));
  };
  const isArticleEmpty = () => {
    for (const key in article) {
      if (!Array.isArray(article[key]) && article[key] === "") {
        return true;
      }
    }
    return false;
  };
  const updatePost = async (e) => {
    e.preventDefault();
    if (!Updated) {
      CreateToast("Please click on Save first", "warning");
    } else {
      if (isArticleEmpty()) {
        CreateToast("please fill all the fields", "error");
        return;
      }
      CreateToast("updating Article", "info");

      await SETDOC(
        "Articles",
        article.id,
        {
          ...article,
          OriginallyMadeBy: ActiveUser,
          Author: chosenAuthor === null ? ActiveUser : chosenAuthor,
        },
        true
      );
      const articles = await GETCOLLECTION("Articles");
      Distributor(articles, Categories);
      CreateToast("Article updated", "info");
    }
  };
  useEffect(() => {
    const GetUser = async () => {
      const fetchedUser = await GETDOC("users", ActiveUser);
      setActiveUser(fetchedUser);
      setAuthorized(
        fetchedUser.Role === "Admin" || fetchedUser.Role === "Owner"
          ? true
          : false
      );
    };
    GetUser();
  }, []);
  useEffect(() => {
    const getArticle = async () => {
      const AllData = await GETCOLLECTION("Articles");
      const foundArticle = AllData.find((Article) => {
        return Article.id == id;
      });
      setArticle(foundArticle);
      const Category = await GETCOLLECTION("categories");
      const users = await GETCOLLECTION("users");
      const authorList = users.filter((user) => {
        return user.Role === "Author" && user.deleteUser === false;
      });
      setAuthorList(authorList);
      setCategories(Category);
    };
    getArticle();
  }, []);
  useEffect(() => {
    const fetchData = async () => {};
    fetchData();
  }, []);
  const handleInput = async (e) => {
    const now = new Date();
    const { name, value } = e.target;
    if (name === "Thumbnail") {
      CreateToast("updating thumbnail", "info");
      const Photo = e.target.files[0];
      const url = await UPLOADPHOTO(`Blog/${article.id}/thumbnail`, Photo);
      setArticle((prev) => {
        return {
          ...prev,
          thumbnail: url,
          DateAdded: date.format(now, pattern),
        };
      });
      CreateToast("thumbnail updated", "success");
      return;
    } else {
      setArticle((prev) => {
        return { ...prev, [name]: value, DateAdded: date.format(now, pattern) };
      });
    }
  };
  const RenderCategories = Categories?.map((category) => {
    return (
      <option key={category.id} value={category.Name}>
        {category.Name}
      </option>
    );
  });
  const handleCategoryChange = (event) => {
    setArticle((prev) => {
      return { ...prev, category: event.target.value };
    });
  };
  const RenderAuthor = authorList?.map((author) => {
    return (
      <option key={author.id} value={author.id}>
        {author.Fname} {author.Lname}
      </option>
    );
  });
  const handleOnBehalfChange = (event) => {
    const Author = authorList.find((author) => {
      return author.id === event.target.value;
    });
    setChosenAuthor(Author);
  };
  const setImageContainer = (imageContainer) => {
    setArticle((prev) => {
      return { ...prev, imageContainer };
    });
  };
  return authorized && article ? (
    <form className="ArticleBuilder">
      <div className="FormItem" id="Title">
        <label htmlFor="Title">Title:</label>
        <input
          type="text"
          required
          id="Title"
          name="Title"
          value={article.Title}
          onChange={handleInput}
        />
      </div>
      <div className="FormItem" id="Category">
        <label htmlFor="last-name">Category:</label>
        <div className="select-container">
          <select
            className="styled-select"
            value={article.category}
            required
            onChange={handleCategoryChange}
          >
            <option value="">Choose a Category</option>

            {RenderCategories}
          </select>
        </div>
      </div>
      <div className="FormItem" id="Thumbnail">
        <span>Thumbnail:</span>
        <label htmlFor="thumbnailInput">
          <img src={Upload} style={{ width: "25px", cursor: "pointer" }} />
        </label>
        <input
          type="file"
          hidden
          required
          id="thumbnailInput"
          name="Thumbnail"
          onChange={handleInput}
        />
      </div>
      <div className="FormItem" id="Description">
        <label htmlFor="Description">Description:</label>
        <textarea
          id="Description"
          name="Description"
          required
          value={article.Description}
          onChange={handleInput}
        />
      </div>
      <div className="FormItem" id="UnderName">
        <label htmlFor="last-name">Post on behalf of:</label>
        <div className="select-container">
          <select className="styled-select" onChange={handleOnBehalfChange}>
            <option value={null}>myself</option>
            {RenderAuthor}
          </select>
        </div>
      </div>
      {article.id && (
        <MyEditor
          handlePostBodyChange={handlePostBodyChange}
          SetUpdated={SetUpdated}
          ArticleID={article.id}
          Content={article.PostBody}
          updatePhotoList={setImageContainer}
        />
      )}

      <input
        id="Save"
        type="submit"
        className="Button"
        value="update"
        onClick={(e) => {
          updatePost(e);
        }}
        style={{ margin: "20px auto", width: "20%" }}
      />
    </form>
  ) : (
    <NotFound />
  );
};

export default EditBlog;
