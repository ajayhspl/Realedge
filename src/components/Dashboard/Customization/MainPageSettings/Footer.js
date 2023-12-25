import React, { useState, useEffect, useRef } from "react";
import { CreateToast } from "../../../../App";
import OtherLink from "./OtherLink";
import sortBy from "sort-by";
import MyModal from "../../../PopUps/Confirm/Confirm";
import Input from "../../../Input/Input";

const FooterEdit = ({ FetchedData, UpdateData, Tabs, setEdited, edited }) => {
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
    setEdited(false);
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
      <Input
        key={social.name}
        label={social.name}
        type="text"
        id={social.name}
        name={social.name}
        onChangeFunction={handleInput}
        value={social.link}
      />
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
        <Input
          label="Bottom Text"
          type="text"
          id="BottomText"
          name="BottomText"
          onChangeFunction={handleInput}
          value={Data.BottomText}
        />

        <h3>Contact Info</h3>
        <Input
          label="Email"
          type="email"
          id="Email"
          name="Email"
          onChangeFunction={handleInput}
          value={Data.Email}
        />

        <Input
          label="Phone"
          type="text"
          id="Phone"
          name="Phone"
          onChangeFunction={handleInput}
          value={Data.Phone}
        />

        <div className="formItem Address">
          <Input
            label="Label"
            type="text"
            id="FirstAddressText"
            name="FirstAddressText"
            value={Data.address.title}
            onChangeFunction={handleInput}
          />

          <Input
            label="Address"
            type="text"
            id="FirstAddressValue"
            name="FirstAddressValue"
            value={Data.address.Address}
            onChangeFunction={handleInput}
          />
        </div>

        <div className="formItem Address">
          <Input
            label="Second Label"
            type="text"
            id="SecondAddressText"
            name="SecondAddressText"
            value={Data.ExtraAddress.title}
            onChangeFunction={handleInput}
          />

          <Input
            label="Second Address"
            type="text"
            id="SecondAddressValue"
            name="SecondAddressValue"
            value={Data.ExtraAddress.Address}
            onChangeFunction={handleInput}
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
      <div className={`SubmitWrapper ${edited ? "fixed" : ""}`}>
        <button
          style={{ margin: "auto" }}
          className="Button View"
          id="Submit"
          onClick={ValidateData}
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default FooterEdit;
