import React from "react";
import "./FeaturedCard.css";

import { Link } from "react-router-dom";
import { SlCalender } from "react-icons/sl";
import { CiClock1 } from "react-icons/ci";
import { AiOutlineLike } from "react-icons/ai";
import { FiEye } from "react-icons/fi";

const FeaturedCard = ({ Article }) => {
  return (
    <div
      className="FeaturedPost"
      style={{ backgroundImage: `url(${Article.thumbnail})` }}
    >
      <div className="MainData">
        <h3 className="animate__animated animate__fadeInUp">{Article.Title}</h3>
        <p className="animate__animated animate__fadeInUp">
          by {Article.Author.Fname} {Article.Author.Lname}
        </p>
      </div>
      <div className="ExtraData animate__animated animate__fadeInUp">
        <span className="Date">
          <SlCalender className="icon" />
          {Article.DateAdded}
        </span>
        <span>
          <FiEye className="icon" />
          {Article.views}
        </span>
        <span>
          <CiClock1 className="icon" />
          {Article.ReadTime} min(s)
        </span>
        <span className="LikeButton">
          <AiOutlineLike className="icon" /> {Article.liked.length}
        </span>
        <Link to={`/BlogMain/Article/${Article.id}`} className="Category">
          {Article.category}
        </Link>

        <Link to={`/BlogMain/Article/${Article.id}`} className="Link">
          Continue Reading
        </Link>
      </div>

      <div className="overlay"></div>
    </div>
  );
};

export default FeaturedCard;
