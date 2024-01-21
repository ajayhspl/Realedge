import React, { useState, useEffect } from "react";
import "./Footer.css";

import {
  FaFacebook,
  FaYoutube,
  FaTelegram,
  FaPinterest,
  FaInstagram,
  FaWhatsapp,
  FaSkype,
  FaLinkedin,
  FaPhoneAlt,
} from "react-icons/fa";
import { MdOutlineEmail } from "react-icons/md";

import { RiTwitterXFill } from "react-icons/ri";

const Footer = ({ ServerData, Tabs }) => {
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
    let icon;
    let link;

    switch (Social.name) {
      case "Facebook":
        icon = (
          <FaFacebook style={{ fontSize: "2rem", color: "var(--icons)" }} />
        );
        link = Social.Link;
        break;
      case "Youtube":
        icon = (
          <FaYoutube style={{ fontSize: "2rem", color: "var(--icons)" }} />
        );
        link = Social.Link;
        break;
      case "Twitter":
        icon = (
          <RiTwitterXFill style={{ fontSize: "2rem", color: "var(--icons)" }} />
        );
        link = Social.Link;
        break;
      case "Telegram":
        icon = (
          <FaTelegram style={{ fontSize: "2rem", color: "var(--icons)" }} />
        );
        link = Social.Link;
        break;
      case "Pinterest":
        icon = (
          <FaPinterest style={{ fontSize: "2rem", color: "var(--icons)" }} />
        );
        link = Social.Link;
        break;
      case "Instagram":
        icon = (
          <FaInstagram style={{ fontSize: "2rem", color: "var(--icons)" }} />
        );
        link = Social.Link;
        break;
      case "WhatsApp":
        icon = (
          <FaWhatsapp style={{ fontSize: "2rem", color: "var(--icons)" }} />
        );
        link = `https://wa.me/${Social.Link}`;
        break;
      case "Skype":
        icon = <FaSkype style={{ fontSize: "2rem", color: "var(--icons)" }} />;
        link = Social.Link;
        break;
      case "Linkedin":
        icon = (
          <FaLinkedin style={{ fontSize: "2rem", color: "var(--icons)" }} />
        );
        link = Social.Link;
        break;
      default:
        link = Social.Link;
        break;
    }

    return Social.Link ? (
      <li key={Social.name}>
        <a href={link}>{icon}</a>
      </li>
    ) : null;
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
              <MdOutlineEmail
                style={{ fontSize: "2rem", color: "var(--icons)" }}
              />
              {ServerData.Email}
            </a>
          )}
          {ServerData.Phone && (
            <a className="ContactIcon" href={`tel:${ServerData.Phone}`}>
              <FaPhoneAlt
                style={{ fontSize: "1.2rem", color: "var(--icons)" }}
              />
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

        <p style={{ marginLeft: "auto", color: "white" }}>
          Website Version: 4.6
        </p>
      </div>
    </div>
  );
};

export default Footer;
