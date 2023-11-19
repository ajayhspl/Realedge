/* eslint-disable react/jsx-key */
/* eslint-disable no-debugger */
import React, { useEffect, useState, useRef } from "react";
import "./ArticlePage.css";
import { useParams, Link } from "react-router-dom";

import NotFound from "../../NotFound/NotFound";
import {
  GETCOLLECTION,
  GETDOC,
  SETDOC,
  UPDATEDOC,
  decrypt,
} from "../../../server";
import { CreateToast } from "../../../App";
import date from "date-and-time";
import sortBy from "sort-by";
import { FiEye } from "react-icons/fi";
import { SlCalender } from "react-icons/sl";
import { CiClock1 } from "react-icons/ci";
import { AiOutlineLike, AiFillLike } from "react-icons/ai";
import { BiCategory } from "react-icons/bi";

const ArticlePage = ({ Categories, Users, width }) => {
  const [Articles, setArticles] = useState([]);
  const isFirstRender = useRef(true);
  const pattern = date.compile("ddd, MMM DD YYYY");
  const ID = useParams().ID;
  let lastID;
  let firstID;
  const [User, setUser] = useState(null);
  const [comment, setComment] = useState({
    replyText: "",
    PersonId: User,
    Date: "",
  });
  let nextArticleUrl;
  let previousArticleUrl;
  if (Articles.length > 0) {
    Articles.sort(sortBy("id"));
    firstID = Articles[0].id;
    Articles.forEach((articles) => {
      lastID = articles.id;
    });
    const currentIndex = Articles.findIndex((article) => article.id == ID);
    const nextArticle = Articles[currentIndex + 1]?.id;
    const previousArticle = Articles[currentIndex - 1]?.id;
    nextArticleUrl = nextArticle ? `/BlogMain/Article/${nextArticle}` : "#";
    previousArticleUrl = previousArticle
      ? `/BlogMain/Article/${previousArticle}`
      : "#";
  }

  const [UserLiked, setUserLiked] = useState(false);
  const [TargetArticle, setTargetArticle] = useState(null);
  let TargetCategory = null;
  useEffect(() => {
    const FetchData = async () => {
      const FetchedArticles = await GETCOLLECTION("Articles");
      const TargetArticle = FetchedArticles?.find((Article) => {
        return Article.id == ID;
      });
      console.log(TargetArticle);
      setArticles(FetchedArticles);
      await UPDATEDOC("Articles", ID, {
        ...TargetArticle,
        views: TargetArticle.views++,
      });
    };
    FetchData();
  }, []);
  useEffect(() => {
    setTargetArticle(
      Articles?.find((Article) => {
        return Article.id == ID;
      })
    );
  }, [Articles]);
  const RenderAuthors = Users.map((User) => {
    if (User.Role === "User") {
      return;
    }
    if (User.deleteUser) {
      return;
    }
    const AuthorArticles = Articles?.filter((Article) => {
      return Article.Author.id == User.id;
    });
    const NameToRender = User.Fname + " " + User.Lname;
    const decryptedID = decrypt(User.id);

    return (
      <li key={decryptedID}>
        <Link to={`/BlogMain/Author/${decryptedID}`}>
          {NameToRender} ({AuthorArticles.length})
        </Link>
      </li>
    );
  });
  const RenderComments = TargetArticle?.replies.map((reply) => {
    let NameToRender;
    const Person = Users.find((User) => {
      return User.id == reply.PersonId;
    });
    if (Person) {
      NameToRender = Person.Fname + " " + Person.Lname;
    } else {
      NameToRender = "DELETED USER";
    }
    return (
      <div className="CommentBody animate__animated animate__fadeInDown">
        <h3>{NameToRender}</h3>
        <span>{reply.Date}</span>
        <p>{reply.replyText}</p>
      </div>
    );
  });
  const RenderCategories = TargetArticle
    ? Categories.map((Category) => {
        if (Category.Name === TargetArticle.category) {
          TargetCategory = Category;
        }
        return (
          <li key={Category.id}>
            <a href={`/BlogMain/Category/${Category.id}`}>
              {Category.Name} ({Category.Articles.length})
            </a>
          </li>
        );
      })
    : "";
  const AddLike = () => {
    if (!User) {
      CreateToast("you aren't signed in", "error");
      return;
    }
    const PrevLiked = TargetArticle.liked.find((UsersWhoLiked) => {
      return UsersWhoLiked == User.id;
    });
    if (PrevLiked) {
      const UpdatedLikes = TargetArticle.liked.filter((UsersWhoLiked) => {
        return UsersWhoLiked !== PrevLiked;
      });
      setTargetArticle((prev) => {
        return { ...prev, liked: UpdatedLikes };
      });
      CreateToast("Like Removed", "success");
    } else {
      setTargetArticle((prev) => {
        return { ...prev, liked: [...prev.liked, User.id] };
      });
      CreateToast("Article Liked", "success");
    }
  };
  React.useEffect(() => {
    const fetchUser = async () => {
      await GETDOC(
        "users",
        decrypt(JSON.parse(sessionStorage.getItem("activeUser")).id)
      ).then((res) => setUser(res));
    };
    if (JSON.parse(sessionStorage.getItem("activeUser"))) {
      fetchUser();
    }
  }, []);
  React.useEffect(() => {
    if (User) {
      const PrevLiked = TargetArticle?.liked.find((UsersWhoLiked) => {
        return UsersWhoLiked == User.id;
      });
      if (PrevLiked) {
        setUserLiked(true);
      } else {
        setUserLiked(false);
      }
    }
  }, [User, TargetArticle]);
  useEffect(() => {
    // Ignore the first render
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    if (TargetArticle) {
      SETDOC("Articles", TargetArticle.id, { ...TargetArticle });
    }
  }, [TargetArticle]);
  const AddComment = () => {
    if (!User) {
      CreateToast("you aren't signed in", "error");
      return;
    }
    setComment((prev) => {
      return { ...prev, replyText: "" };
    });
    setTargetArticle((prev) => {
      return { ...prev, replies: [comment, ...prev.replies] };
    });
  };

  const handleChange = (e) => {
    const now = new Date();

    const { name, value } = e.target;
    setComment((prev) => {
      return {
        ...prev,
        [name]: value,
        Date: date.format(now, pattern),
      };
    });
    if (User) {
      setComment((prev) => {
        return {
          ...prev,
          PersonId: User.id,
        };
      });
    }
  };

  return (
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
      {TargetArticle ? (
        <div className="BlogMain">
          {TargetArticle && (
            <div className="ArticlePage">
              <div className="ArticleDetails">
                <span>
                  <SlCalender className="icon" />
                  {TargetArticle.DateAdded}
                </span>
                <span>
                  <FiEye className="icon" />
                  {TargetArticle.views}
                </span>
                <span className="LikeButton">
                  {UserLiked ? (
                    <AiFillLike className="icon" onClick={AddLike} />
                  ) : (
                    <AiOutlineLike className="icon" onClick={AddLike} />
                  )}
                  {TargetArticle.liked.length}
                </span>
                <span>
                  <CiClock1 className="icon" /> {TargetArticle.ReadTime} min(s)
                </span>
                <div>
                  <BiCategory className="icon" />
                  <Link
                    to={`/BlogMain/Category/${TargetCategory.id}`}
                    className="Category"
                  >
                    {TargetArticle.category}
                  </Link>
                </div>
              </div>
              <div
                className="ArticleBody"
                dangerouslySetInnerHTML={{ __html: TargetArticle.PostBody }}
              ></div>
              <div className="Comments">
                <h4>Comments</h4>
                <div className="AddComment">
                  <label htmlFor="CommentArea">Leave your comment Below:</label>
                  <textarea
                    id="CommentArea"
                    value={comment.replyText}
                    onChange={(e) => {
                      handleChange(e);
                    }}
                    name="replyText"
                  ></textarea>
                  <button className="Button" onClick={AddComment}>
                    Post Comment
                  </button>
                </div>
                {RenderComments}
              </div>
              <div className="Navigation">
                {firstID == ID ? (
                  ""
                ) : (
                  <a href={previousArticleUrl} className="Link Reverse">
                    Read Previous
                  </a>
                )}
                <Link to="/blogMain" className="Home">
                  Blog
                </Link>

                {lastID == ID ? (
                  ""
                ) : (
                  <a href={nextArticleUrl} className="Link">
                    Read Next
                  </a>
                )}
              </div>
            </div>
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
      ) : (
        <NotFound />
      )}
    </div>
  );
};

export default ArticlePage;
