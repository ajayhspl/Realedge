import React, { useState, useEffect } from "react";

const OtherLink = ({
  Link,
  Data,
  setData,
  DeleteLink,
  Tabs,
  New,
  setNewLink,
}) => {
  const objectToArray = (obj) => {
    return Object.keys(obj).map((key) => ({
      key,
      ...obj[key],
    }));
  };
  const [link, setLink] = useState(Link);

  const handleSelectChange = (e) => {
    if (New) {
      setNewLink((prev) => ({ ...prev, PageID: e.target.value }));
    }
    setLink((prev) => ({ ...prev, PageID: e.target.value }));
  };
  const handleInputLink = (e) => {
    const { name, value } = e.target;
    if (name === "link") {
      if (New) {
        setNewLink((prev) => ({
          ...prev,
          [name]: value,
          ValidLink: validateLink(value),
        }));
      }
      setLink((prev) => ({
        ...prev,
        [name]: value,
        ValidLink: validateLink(value),
      }));
      return;
    }
    if (New) {
      setNewLink((prev) => ({ ...prev, [name]: value }));
    }
    setLink((prev) => ({ ...prev, [name]: value }));
  };
  const handleCheckboxChange = () => {
    if (New) {
      setNewLink((prev) => ({ ...prev, FromPages: !prev.FromPages }));
    }
    setLink((prev) => ({ ...prev, FromPages: !prev.FromPages }));
  };
  const targetObjectIndex = Data.Links.findIndex((item) => item.id === link.id);
  const validateLink = (link) => {
    const linkPattern = /^(http|https):\/\/([\w.-]+)\.([a-zA-Z]{2,})(\/\S*)?$/;
    return linkPattern.test(link);
  };
  useEffect(() => {
    const updatedData = { ...Data };
    if (targetObjectIndex !== -1) {
      // If the target object is found
      updatedData.Links[targetObjectIndex] = {
        ...link,
      };
    }
    setData(updatedData);
  }, [link]);
  return (
    <div key={link.name} className="OtherLink">
      <div className="formItem form-check CheckBox">
        <label className="form-check-label">
          Attach to Website:
          <input
            className="form-check-input"
            type="checkbox"
            checked={link.FromPages}
            onChange={handleCheckboxChange}
          />
        </label>
      </div>
      {link.FromPages && (
        <div className="formItem" style={{ margin: "15px" }}>
          <label>
            Attached Page:
            <select
              className="styled-select"
              style={{ width: "60%", marginLeft: "20px" }}
              value={link.PageID}
              onChange={handleSelectChange}
            >
              {objectToArray(Tabs).map((Page) => {
                if (Page.PageURL) {
                  return (
                    <option value={Page.id} key={Page.id}>
                      {Page.PageName}
                    </option>
                  );
                } else {
                  return null;
                }
              })}
            </select>
          </label>
        </div>
      )}
      {!link.FromPages && (
        <div style={{ margin: "20px" }}>
          <div className="formItem">
            <label htmlFor="LinkLabel">Link Title:</label>
            <input
              type="text"
              id="LinkLabel"
              name="LinkLabel"
              value={link.LinkLabel}
              onChange={handleInputLink}
            />
          </div>
          <div className="formItem">
            <label htmlFor="link">Link:</label>
            <input
              type="text"
              id="link"
              name="link"
              value={link.link}
              onChange={handleInputLink}
            />
          </div>
          {!link.ValidLink && (
            <p className="Error">Not a valid website link.</p>
          )}
          {!link.LinkLabel && (
            <p className="Error">Link title cant be empty.</p>
          )}
        </div>
      )}
      {!New && (
        <button
          className="Button Danger"
          onClick={() => {
            DeleteLink(link.id);
          }}
        >
          Delete
        </button>
      )}
    </div>
  );
};

export default OtherLink;
