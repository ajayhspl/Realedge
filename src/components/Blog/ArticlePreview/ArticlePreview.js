import React from "react";
import "./ArticlePreview.css";

import { FiEye } from "react-icons/fi";
import { SlCalender } from "react-icons/sl";
import { CiClock1 } from "react-icons/ci";
import { AiOutlineLike } from "react-icons/ai";
import { BiCategory } from "react-icons/bi";
import { Link } from "react-router-dom";
const ArticlePreview = ({ Article, delay }) => {
  const delayString = delay.toString() + "s";
  return (
    <div
      className="ArticlePreview"
      data-aos="fade-in"
      style={{ animationDelay: delayString }}
    >
      <div className="TopPart">
        <h2>{Article.Title}</h2>
        <p>
          by {Article.Author.Fname} {Article.Author.Lname}
        </p>
      </div>
      <div className="bottomPART">
        <img src={Article.thumbnail} />
        <p className="Description">{Article.Description}</p>
      </div>
      <div className="ExtraData">
        <span>
          <FiEye className="icon" />
          {Article.views}
        </span>
        <span>
          <SlCalender className="icon" />
          {Article.DateAdded}
        </span>
        <span>
          <CiClock1 className="icon" />
          {Article.ReadTime} min(s)
        </span>
        <span className="LikeButton">
          <AiOutlineLike className="icon" />
          {Article.liked.length}
        </span>
        <Link to={`/BlogMain/Article/${Article.id}`} className="Category">
          <BiCategory className="icon" />
          {Article.category}
        </Link>
        <Link to={`/BlogMain/Article/${Article.id}`} className="Link">
          Continue Reading
        </Link>
      </div>
    </div>
  );
};

export default ArticlePreview;
