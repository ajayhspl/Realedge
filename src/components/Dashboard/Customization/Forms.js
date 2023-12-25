import React, { useState, useEffect, useRef } from "react";

import Input from "../../Input/Input";

const Forms = ({ Data, UpdateGeneralData, setEdited }) => {
  const [data, setData] = useState(Data);
  const handleInput = async (e) => {
    const { name, value } = e.target;
    setData((prev) => {
      return { ...prev, [name]: value };
    });
  };
  const handleColorChange = (colorName, newColor) => {
    setData((prevData) => ({
      ...prevData,
      Colors: {
        ...prevData.Colors,
        [colorName]: newColor,
      },
    }));
  };
  const firstRender = useRef(true);
  useEffect(() => {
    if (firstRender.current) {
      // Skip the first render
      firstRender.current = false;
    } else {
      setEdited(true);
    }
  }, [data]);

  const handleCheckboxChange = () => {
    setData((prev) => ({
      ...prev,
      DefaultJobContactTitle: !prev.DefaultJobContactTitle,
    }));
  };
  return (
    <div className="DataEntry section4">
      <span>
        hint: the Email that you will receive the any kind of form submits on
      </span>
      <label>
        Form Background Color:
        <input
          type="color"
          className="ColorPicker"
          value={data.Colors.formsBackground}
          onChange={(e) => handleColorChange("formsBackground", e.target.value)}
        />
      </label>
      <Input
        customWidth="70%"
        label="Email"
        type="email"
        id="Email"
        name="Email"
        value={data.Email}
        onChangeFunction={handleInput}
      />
      <h3>Contact forms</h3>

      <Input
        customWidth="70%"
        label="Nav bar contact form Description"
        type="text"
        id="NavBarContactDescription"
        name="NavBarContactDescription"
        value={data.NavBarContactDescription}
        onChangeFunction={handleInput}
      />
      <Input
        label="NavBar contact form title"
        type="text"
        id="NavBarContactTitle"
        name="NavBarContactTitle"
        value={data.NavBarContactTitle}
        onChangeFunction={handleInput}
        customWidth="70%"
      />

      <Input
        label="Header contact form title"
        type="text"
        id="HeaderContactTitle"
        name="HeaderContactTitle"
        value={data.HeaderContactTitle}
        onChangeFunction={handleInput}
        customWidth="70%"
      />

      <Input
        label="Header contact form Description"
        type="text"
        id="HeaderContactDescription"
        name="HeaderContactDescription"
        value={data.HeaderContactDescription}
        onChangeFunction={handleInput}
        customWidth="70%"
      />

      <Input
        label="Job Request form Description"
        type="text"
        id="JobRequestDescription"
        name="JobRequestDescription"
        value={data.JobRequestDescription}
        onChangeFunction={handleInput}
        customWidth="70%"
      />

      <div className="FormItem" id="Title">
        <Input
          label="Job Request form Title"
          type="text"
          id="JobRequestTitle"
          name="JobRequestTitle"
          value={data.JobRequestTitle}
          onChangeFunction={handleInput}
          customWidth="70%"
        />
        <div className="formItem form-check CheckBox">
          <label className="form-check-label">
            Default Naming:
            <input
              className="form-check-input"
              type="checkbox"
              checked={data.DefaultJobContactTitle}
              onChange={handleCheckboxChange}
            />
          </label>
        </div>
      </div>

      <Input
        label="Price Plan Request form Description"
        type="text"
        id="PriceContactDescription"
        name="PriceContactDescription"
        value={data.PriceContactDescription}
        onChangeFunction={handleInput}
        customWidth="70%"
      />
      <div className="FormItem" id="Title">
        <Input
          label="Price Plan Request form Title"
          type="text"
          id="PriceContactTitle"
          name="PriceContactTitle"
          value={data.PriceContactTitle}
          onChangeFunction={handleInput}
          customWidth="70%"
        />
        <div className="formItem form-check CheckBox">
          <label className="form-check-label">
            Default Naming:
            <input
              className="form-check-input"
              type="checkbox"
              checked={data.DefaultPriceContactTitle}
              onChange={() => {
                setData((prev) => ({
                  ...prev,
                  DefaultPriceContactTitle: !prev.DefaultPriceContactTitle,
                }));
              }}
            />
          </label>
        </div>
      </div>
      <button
        className="Button View"
        id="Submit"
        onClick={() => {
          UpdateGeneralData(data);
        }}
      >
        Save
      </button>
    </div>
  );
};

export default Forms;
