import React, { useState, useEffect, useRef } from "react";
import { CreateToast } from "../../../../App";
import OtherLink from "./OtherLink";
import sortBy from "sort-by";
import MyModal from "../../../PopUps/Confirm/Confirm";

const FooterEdit = ({ FetchedData, UpdateData, Tabs, setEdited }) => {
  const [Data, setData] = React.useState(FetchedData);
  const [showModal, setShowModal] = useState(false);

  const [newLink, SetNewLink] = useState({
    FromPages: false,
    LinkLabel: "",
    PageID: "",
    ValidLink: false,
    id: null,
    link: "",
  });
  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);
  const handlePrimaryAction = () => {
    if (newLink.FromPages === false && newLink.ValidLink === false) {
      CreateToast("Link URL is invalid", "error");
      return;
    } else if (newLink.FromPages === true && newLink.PageID === "") {
      CreateToast("attached page is empty", "error");
      return;
    } else if (newLink.FromPages === false && newLink.LinkLabel === "") {
      CreateToast("Link title is empty", "error");
      return;
    }
    handleCloseModal();

    setData((prev) => {
      return { ...prev, Links: [newLink, ...prev.Links] };
    });
    SetNewLink({
      FromPages: false,
      LinkLabel: "",
      PageID: "",
      ValidLink: false,
      id: null,
      link: "",
    });
  };
  const ValidateData = () => {
    if (
      Data.Links.some(
        (object) => object.FromPages === false && object.ValidLink === false
      )
    ) {
      CreateToast(
        "Other Links Section error:One of the links is invalid",
        "error"
      );
      return;
    } else if (
      Data.Links.some(
        (object) => object.FromPages === true && object.PageID === ""
      )
    ) {
      CreateToast(
        "Other Links Section error:one of the attached pages is empty",
        "error"
      );
      return;
    } else if (
      Data.Links.some(
        (object) => object.FromPages === false && object.LinkLabel === ""
      )
    ) {
      CreateToast(
        "Other Links Section error: one of the Link titles is empty",
        "error"
      );
      return;
    }
    UpdateData("FooterData", Data);
  };

  const DeleteLink = (id) => {
    let updatedList = Data.Links.filter((link) => {
      return link.id != id;
    });
    setData((prev) => ({ ...prev, Links: updatedList }));
  };
  const handleInput = (e) => {
    const { name, value } = e.target;
    if (
      name === "Facebook" ||
      name === "Instagram" ||
      name === "Telegram" ||
      name === "Pinterest" ||
      name === "Twitter" ||
      name === "Youtube" ||
      name === "Skype" ||
      name === "WhatsApp" ||
      name === "Linkedin"
    ) {
      setData((prev) => {
        return { ...prev, Socials: { ...prev.Socials, [name]: value } };
      });
    } else if (name === "FirstAddressText") {
      setData((prev) => {
        return { ...prev, address: { ...prev.address, title: value } };
      });
    } else if (name === "FirstAddressValue") {
      setData((prev) => {
        return { ...prev, address: { ...prev.address, Address: value } };
      });
    } else if (name === "SecondAddressText") {
      setData((prev) => {
        return {
          ...prev,
          ExtraAddress: { ...prev.ExtraAddress, title: value },
        };
      });
    } else if (name === "SecondAddressValue") {
      setData((prev) => {
        return {
          ...prev,
          ExtraAddress: { ...prev.ExtraAddress, Address: value },
        };
      });
    } else {
      setData((prev) => {
        return { ...prev, [name]: value };
      });
    }
  };
  let socialElements = null;
  if (Data) {
    const socialArray = Object.entries(Data.Socials).map(([name, link]) => ({
      name,
      link,
    }));
    socialElements = socialArray.map((social) => (
      <div className="formItem" key={social.name}>
        <label htmlFor={social.name}>{social.name}:</label>
        <input
          type="text"
          id={social.name}
          name={social.name}
          onChange={handleInput}
          value={social.link}
        />
      </div>
    ));
  }
  const firstRender = useRef(true);
  useEffect(() => {
    if (firstRender.current) {
      // Skip the first render
      firstRender.current = false;
    } else {
      setEdited(true);
    }
  }, [Data]);
  useEffect(() => {
    const GetID = () => {
      let id;
      if (Data.Links.length === 0) {
        id = 0;
      } else {
        Data.Links.sort(sortBy("id"));
        Data.Links.forEach((category) => {
          id = +category.id + 1;
        });
      }
      SetNewLink((prev) => {
        return { ...prev, id: String(id) };
      });
    };
    GetID();
  }, [Data]);
  const RenderOtherLinks = Data.Links.map((Link) => {
    return (
      <OtherLink
        New={false}
        key={Link.id}
        Link={Link}
        Tabs={Tabs}
        DeleteLink={DeleteLink}
        Data={Data}
        setData={setData}
      />
    );
  });
  return (
    <div className="DataEntry Footer">
      {showModal && (
        <MyModal
          className="Confirm NewLink"
          show={showModal}
          handleClose={handleCloseModal}
          title="add Link"
          primaryButtonText={`Add`}
          handlePrimaryAction={handlePrimaryAction}
        >
          <OtherLink
            New={true}
            key={newLink.id}
            Link={newLink}
            Tabs={Tabs}
            setNewLink={SetNewLink}
            DeleteLink={DeleteLink}
            Data={Data}
            setData={setData}
          />
        </MyModal>
      )}
      <div className="FirstPart">
        <div className="formItem">
          <label htmlFor="BottomText">Bottom Text:</label>
          <input
            type="text"
            id="BottomText"
            name="BottomText"
            value={Data.BottomText}
            onChange={handleInput}
          />
        </div>
        <h3>Contact Info</h3>
        <div className="formItem">
          <label htmlFor="Email">Email:</label>
          <input
            type="email"
            id="Email"
            name="Email"
            value={Data.Email}
            onChange={handleInput}
          />
        </div>
        <div className="formItem">
          <label htmlFor="Phone">Phone:</label>
          <input
            type="text"
            id="Phone"
            name="Phone"
            value={Data.Phone}
            onChange={handleInput}
          />
        </div>

        <div className="formItem Address">
          <label htmlFor="FirstAddressText">Label:</label>

          <input
            type="text"
            id="FirstAddressText"
            name="FirstAddressText"
            value={Data.address.title}
            onChange={handleInput}
          />
          <label htmlFor="FirstAddressValue">Address:</label>
          <input
            type="text"
            id="FirstAddressValue"
            name="FirstAddressValue"
            value={Data.address.Address}
            onChange={handleInput}
          />
        </div>

        <div className="formItem Address">
          <label htmlFor="SecondAddressText">Second Label:</label>

          <input
            type="text"
            id="SecondAddressText"
            name="SecondAddressText"
            value={Data.ExtraAddress.title}
            onChange={handleInput}
          />
          <label htmlFor="SecondAddressValue">Second Address:</label>

          <input
            type="text"
            id="SecondAddressValue"
            name="SecondAddressValue"
            value={Data.ExtraAddress.Address}
            onChange={handleInput}
          />
        </div>
      </div>
      <div className="SocialLinks">
        <>
          <h3>Social Links</h3>
          {socialElements}
        </>
      </div>
      <div className="OtherLinks">
        <h3>Other Links</h3>
        <button className="Button View" onClick={handleShowModal}>
          Add Link
        </button>
        <div className="LinkWrapper">{RenderOtherLinks}</div>
      </div>
      <button
        style={{ margin: "auto" }}
        className="Button View"
        id="Submit"
        onClick={ValidateData}
      >
        Save
      </button>
    </div>
  );
};

export default FooterEdit;
