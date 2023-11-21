import React from "react";
import "./Header.css";
import { useParams } from "react-router-dom";
import { encrypt } from "../../server";

const Header2 = (props) => {
  const ID = useParams().ID;
  const Location = window.location.href;
  let Target = null;

  if (Location.includes("Category")) {
    Target = props.BlogCategory.find((Category) => {
      return Category.id == ID;
    });
  }
  if (Location.includes("Member")) {
    Target = props.Teams.find((Team) => {
      return Team.id == ID;
    });
  }
  if (Location.includes("Author")) {
    Target = props.Users.find((Author) => {
      return Author.id == encrypt(ID);
    });
  }
  const RenderHeader = () => {
    if (Location.includes("Category")) {
      return <h1>{Target.Name}</h1>;
    } else if (Location.includes("Author")) {
      return (
        <h1 style={{ width: "100%" }}>
          {Target.Fname} {Target.Lname}'s posts
        </h1>
      );
    } else if (Location.includes("Member")) {
      return <h1>{Target?.name}</h1>;
    } else {
      return <h1>{props.title}</h1>;
    }
  };
  return props.bg ? (
    <div
      className={`Header ${
        Location.includes("/") ? "Second NoOverlay" : "NoOverlay"
      }`}
    >
      <div className="Content">
        <div className="TopBar">
          <h2 style={{ color: props.TopColor }}>{props.TopTitle}</h2>
          <h2 style={{ color: props.BottomColor }}>{props.BottomTitle}</h2>
        </div>
        <div className="BTM">{RenderHeader()}</div>
      </div>

      <div
        className="overlay"
        style={{
          backgroundImage: `url(${props.bg})`,
          transform: "ScaleX(1)",
        }}
      ></div>
    </div>
  ) : (
    <h2 style={{ padding: "2vw" }}>{props.title}</h2>
  );
};

export default Header2;
