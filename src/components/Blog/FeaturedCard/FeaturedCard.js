import React from "react";
import "./FeaturedCard.css";
import Calendar from "../../../assets/calendar.png";
import ReadTime from "../../../assets/ReadTime.png";
import { Link } from "react-router-dom";
import Like from "../../../assets/like.png";

const FeaturedCard = ({ Article }) => {
  return (
    <div className="FeaturedPost">
      <div className="TopPart">
        <h2>{Article.Title}</h2>
        <p>
          by {Article.Author.Fname} {Article.Author.Lname}
        </p>
      </div>
      <div className="BottomPart">
        <img src={Article.thumbnail} />
        <p className="Description">{Article.Description}</p>
      </div>
      <div className="ExtraData">
        <span>
          <img src={Calendar}></img>
          {Article.DateAdded}
        </span>
        <span>
          <img src={ReadTime} />
          {Article.ReadTime} min(s)
        </span>
        <span className="LikeButton">
          <img src={Like} /> {Article.liked.length}
        </span>
        <Link to={`/BlogMain/Article/${Article.id}`} className="Category">
          {Article.category}
        </Link>

        <Link to={`/BlogMain/Article/${Article.id}`} className="Link">
          Continue Reading
        </Link>
      </div>
    </div>
  );
};

export default FeaturedCard;
