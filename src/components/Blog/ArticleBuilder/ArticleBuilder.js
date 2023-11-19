import React, { useEffect, useState } from "react";
import MyEditor from "./Editor";
import date from "date-and-time";
import { CreateToast } from "../../../App";
import {
  UPLOADPHOTO,
  GETCOLLECTION,
  GETDOC,
  SETDOC,
  Distributor,
  decrypt,
} from "../../../server";
import sortBy from "sort-by";
import "./ArticleBuilder.css";
import Upload from "../../../assets/upload.png";
import NotFound from "../../NotFound/NotFound";
const pattern = date.compile("HH A ,MMM DD YYYY");
const ArticleBuilder = () => {
  const [Categories, setCategories] = useState(null);
  const [authorList, setAuthorList] = useState([]);
  const [chosenAuthor, setChosenAuthor] = useState(null);
  const [ActiveUser, setActiveUser] = useState(
    sessionStorage.getItem("activeUser")
      ? decrypt(JSON.parse(sessionStorage.getItem("activeUser")).id)
      : ""
  );
  const [Article, setArticle] = useState({
    DateAdded: "",
    Description: "",
    PostBody: "",
    ReadTime: "",
    Title: "",
    category: "",
    id: "",
    liked: [],
    replies: [],
    imageContainer: [],
    thumbnail: "",
    views: 0,
  });
  const [Updated, SetUpdated] = useState(false);
  const handleInput = async (e) => {
    const now = new Date();
    const { name, value } = e.target;
    if (name === "Thumbnail") {
      CreateToast("uploading thumbnail", "info");
      const Photo = e.target.files[0];
      const url = await UPLOADPHOTO(`Blog/${Article.id}/thumbnail`, Photo);
      setArticle((prev) => {
        return {
          ...prev,
          thumbnail: url,
          DateAdded: date.format(now, pattern),
        };
      });
      CreateToast("thumbnail uploaded", "success");
      return;
    } else {
      setArticle((prev) => {
        return { ...prev, [name]: value, DateAdded: date.format(now, pattern) };
      });
    }
  };
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
  const updatePost = async (e) => {
    e.preventDefault();
    if (!Updated) {
      CreateToast("Please click on Save first", "warning");
    } else {
      if (isArticleEmpty()) {
        CreateToast("please fill all the fields", "error");
        return;
      }
      CreateToast("uploading Article", "info");

      await SETDOC(
        "Articles",
        Article.id,
        {
          ...Article,
          OriginallyMadeBy: ActiveUser,
          Author: chosenAuthor === null ? ActiveUser : chosenAuthor,
        },
        true
      );
      const articles = await GETCOLLECTION("Articles");
      Distributor(articles, Categories);
      CreateToast("Article Uploaded", "info");
      setArticle((prev) => ({
        ...prev,
        thumbnail: "",
        Description: "",
        Title: "",
      }));
      setChosenAuthor(null);
      GetID();
    }
  };
  const isArticleEmpty = () => {
    for (const key in Article) {
      if (!Array.isArray(Article[key]) && Article[key] === "") {
        return true;
      }
    }
    return false;
  };
  useEffect(() => {
    const fetchData = async () => {
      const Category = await GETCOLLECTION("categories");
      const users = await GETCOLLECTION("users");
      const authorList = users.filter((user) => {
        return user.Role === "Author" && user.deleteUser === false;
      });
      setAuthorList(authorList);
      setCategories(Category);
    };
    fetchData();
  }, []);
  useEffect(() => {
    const DetectUser = async () => {
      if (!ActiveUser) {
        return;
      }
      const FetchedUser = await GETDOC("users", ActiveUser);
      setActiveUser(FetchedUser);
      if (FetchedUser.Role === "Author") {
        setArticle((prev) => {
          return { ...prev, Author: FetchedUser };
        });
      }
    };
    DetectUser();
    GetID();
  }, []);
  const GetID = async () => {
    let id;
    const Articles = await GETCOLLECTION("Articles");
    if (Articles.length === 0) {
      id = 1;
    } else {
      Articles.sort(sortBy("id"));
      Articles.forEach((product) => {
        id = +product.id + 1;
      });
    }
    setArticle((prev) => {
      return { ...prev, id };
    });
  };

  return (
    <>
      {ActiveUser ? (
        <>
          {ActiveUser.Role === "User" ? (
            <NotFound />
          ) : (
            <form className="ArticleBuilder">
              <div className="FormItem" id="Title">
                <label htmlFor="Title">Title:</label>
                <input
                  type="text"
                  required
                  id="Title"
                  name="Title"
                  value={Article.Title}
                  onChange={handleInput}
                />
              </div>
              <div className="FormItem" id="Category">
                <label htmlFor="last-name">Category:</label>
                <div className="select-container">
                  <select
                    className="styled-select"
                    value={Article.category}
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
                  <img
                    src={Upload}
                    style={{ width: "25px", cursor: "pointer" }}
                  />
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
                  value={Article.Description}
                  onChange={handleInput}
                />
              </div>
              <div className="FormItem" id="UnderName">
                <label htmlFor="last-name">Post on behalf of:</label>
                <div className="select-container">
                  <select
                    className="styled-select"
                    onChange={handleOnBehalfChange}
                  >
                    <option value={null}>myself</option>
                    {RenderAuthor}
                  </select>
                </div>
              </div>
              {Article.id && (
                <MyEditor
                  handlePostBodyChange={handlePostBodyChange}
                  SetUpdated={SetUpdated}
                  ArticleID={Article.id}
                  updatePhotoList={(photolist) => {
                    setImageContainer(photolist);
                  }}
                />
              )}

              <input
                id="Save"
                type="submit"
                className="Button"
                value="Upload"
                onClick={(e) => {
                  updatePost(e);
                }}
                style={{ margin: "20px auto", width: "20%" }}
              />
            </form>
          )}
        </>
      ) : (
        <NotFound />
      )}
    </>
  );
};

export default ArticleBuilder;
