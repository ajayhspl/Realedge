import React, { useState, useEffect } from "react";
import "./Footer.css";
import Facebook from "../../assets/facebook.png";
import Youtube from "../../assets/youtube.png";
import Twitter from "../../assets/twitter.png";
import Telegram from "../../assets/telegram.png";
import Linkedin from "../../assets/linkedin.png";
import Pinterest from "../../assets/pinterest.png";
import Phone from "../../assets/phone.png";
import Email from "../../assets/mail.png";
import Instagram from "../../assets/instagram.png";
import WhatsApp from "../../assets/whatsapp.png";
import Skype from "../../assets/skype.png";
import { useRef } from "react";

const Footer = ({ ServerData, Tabs }) => {
  const Location = useRef(window.location.href).current;
  const [socialContainer, SetSocialContainer] = useState([]);
  const objectToArray = (obj) => {
    return Object.keys(obj).map((key) => ({
      key,
      ...obj[key],
    }));
  };

  useEffect(() => {
    for (const Social in ServerData.Socials) {
      SetSocialContainer((prev) => [
        ...prev,
        { name: Social, Link: ServerData.Socials[Social] },
      ]);
    }
  }, []);
  const RenderSocials = socialContainer?.map((Social) => {
    let img = "";
    let link;
    switch (Social.name) {
      case "Facebook":
        img = Facebook;
        link = Social.Link;

        break;
      case "Youtube":
        img = Youtube;
        link = Social.Link;

        break;
      case "Twitter":
        img = Twitter;
        link = Social.Link;

        break;
      case "Telegram":
        img = Telegram;
        link = Social.Link;

        break;
      case "Pinterest":
        img = Pinterest;
        link = Social.Link;

        break;
      case "Instagram":
        img = Instagram;
        link = Social.Link;

        break;
      case "WhatsApp":
        img = WhatsApp;
        link = `https://wa.me/${Social.Link}`;
        break;
      case "Skype":
        img = Skype;
        link = Social.Link;

        break;
      case "Linkedin":
        img = Linkedin;
        link = Social.Link;

        break;
      default:
        link = Social.Link;

        break;
    }

    return Social.Link ? (
      <li>
        <a href={link}>
          <img src={img} />
        </a>
      </li>
    ) : (
      ""
    );
  });

  const renderLinks = ServerData.Links.map((link) => {
    if (link.FromPages) {
      const AttachedPage = objectToArray(Tabs).find((Tab) => {
        return Tab.id == link.PageID;
      });
      return (
        <li key={link.id}>
          <a href={`/${AttachedPage.PageURL}`}>{AttachedPage.PageName}</a>
        </li>
      );
    } else {
      return (
        <li key={link.id}>
          <a target="_blank" rel="noopener noreferrer" href={link.link}>
            {link.LinkLabel}
          </a>
        </li>
      );
    }
  });
  return (
    <div className="FooterWrapper">
      <div className="columns">
        <div className="col">
          <p>CONTACT</p>
          {ServerData.Email && (
            <a className="ContactIcon" href={`mailto:${ServerData.Email}`}>
              <img src={Email} />
              {ServerData.Email}
            </a>
          )}
          {ServerData.Phone && (
            <a className="ContactIcon" href={`tel:${ServerData.Phone}`}>
              <img src={Phone} />
              {ServerData.Phone}
            </a>
          )}
          {ServerData.address.Address && (
            <div className="field">
              <span>{ServerData.address.title}</span>
              <p>{ServerData.address.Address}</p>
            </div>
          )}
          {ServerData.address.Address && (
            <div className="field">
              <span>{ServerData.ExtraAddress.title}</span>
              <p>{ServerData.ExtraAddress.Address}</p>
            </div>
          )}
        </div>
        <div className="col">
          <p>OUR BLOG</p>
          <ul>
            <li>
              <a href="/blogMain">Blog</a>
            </li>
          </ul>
        </div>
        <div className="col">
          <p>OTHER LINKS</p>
          <ul>
            <>
              <li>
                <a href={`/Portal`}>Portal</a>
              </li>
              {renderLinks}
            </>
          </ul>
        </div>
      </div>
      <div className="Links">
        <p>Follow us</p>
        <ul>{RenderSocials}</ul>
      </div>
      <div className="CopyRight">
        <p>{ServerData.BottomText}</p>
        <div>
          <a href={Tabs.TOU.PageURL}>Terms Of Use</a>
          <span>&</span>
          <a href={Tabs.Privacy.PageURL}>Privacy Policy</a>
        </div>
        {Location.includes("Dashboard") || Location.includes("Portal") ? (
          <p style={{ marginLeft: "auto", color: "white" }}>
            Website Version: 2.2
          </p>
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

export default Footer;
