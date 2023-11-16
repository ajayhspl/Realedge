import React, { useState, useEffect } from "react";
import MyModal from "../../../PopUps/Confirm/Confirm";
import { CreateToast } from "../../../../App";
import Upload from "../../../../assets/upload.png";
import { UPLOADPHOTO } from "../../../../server";
import sortBy from "sort-by";
import "./SidePages.css";
import PriceCard from "../../../Cards/PriceCard/PriceCard";
const Template6 = ({ Data, UpdateData, BackEndName }) => {
  const [data, setData] = useState(Data);
  const [proText, setProText] = useState("");
  const [highLightedID, setHighlightedId] = useState(null);
  const changeHighlight = (id) => {
    setHighlightedId(id);
  };
  const [showModal, setShowModal] = useState(false);
  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);
  const [pricingCard, setPricingCard] = useState({
    PerMonth: false,
    Price: "",
    description: "",
    title: "",
    pros: [],
    id: "",
  });
  const CheckData = () => {
    if (data.Plans.length === 3) {
      CreateToast("max Plans Reached", "error");
      return;
    }
    handleShowModal();
  };
  const handlePrimaryAction = () => {
    handleCloseModal();
    setData((prev) => {
      return { ...prev, Plans: [...prev.Plans, pricingCard] };
    });
    setPricingCard({
      PerMonth: false,
      Price: "",
      description: "",
      title: "",
      pros: [],
      id: "",
    });
  };
  const addPro = () => {
    if (proText === "") {
      return;
    }
    let id;
    if (pricingCard.pros.length === 0) {
      id = 0;
    } else {
      pricingCard.pros.sort(sortBy("id"));
      pricingCard.pros.forEach((category) => {
        id = +category.id + 1;
      });
    }
    setPricingCard((prev) => {
      return { ...prev, pros: [...prev.pros, { id: id, text: proText }] };
    });
    setProText("");
  };
  const DeletePro = (id) => {
    let tempList = pricingCard.pros.filter((pro) => {
      return pro.id != id;
    });
    setPricingCard((prev) => {
      return { ...prev, pros: tempList };
    });
  };
  const handleInput = async (e) => {
    const { name, value } = e.target;
    if (name === "BG") {
      CreateToast("uploading photo", "info", 2000);

      const Photo = e.target.files[0];
      const url = await UPLOADPHOTO(
        `/customization/SidePages/${BackEndName}/BG.jpg`,
        Photo
      );
      setData((prev) => {
        return { ...prev, BG: url };
      });
      CreateToast("photo uploaded", "success", 2000);

      return;
    }

    setData((prev) => {
      return { ...prev, [name]: value };
    });
  };
  const DeletePricing = (id) => {
    const NewCards = data.Plans.filter((Card) => {
      return Card.id !== id;
    });
    setData((prev) => {
      return { ...prev, Plans: NewCards };
    });
  };

  useEffect(() => {
    let PricingID;
    if (data.Plans.length === 0) {
      PricingID = 1;
    } else {
      data.Plans.sort(sortBy("id"));
      data.Plans.forEach((category) => {
        PricingID = +category.id + 1;
      });
    }
    setPricingCard((prev) => {
      return { ...prev, id: PricingID };
    });
  }, [data]);

  const renderDummyPricingData = data.Plans.map((PricePlan) => {
    return (
      <div
        key={PricePlan.id}
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: "20px",
        }}
      >
        <PriceCard
          data={PricePlan}
          changeHighlight={changeHighlight}
          highLightedID={highLightedID}
        />
        <button
          className="Button Danger"
          onClick={() => {
            DeletePricing(PricePlan.id);
          }}
        >
          Delete
        </button>
      </div>
    );
  });
  return (
    <div className="DataEntry Hosting">
      {showModal && (
        <MyModal
          className="Confirm PricingModal"
          show={showModal}
          handleClose={handleCloseModal}
          title="add Pricing Card"
          primaryButtonText={`add`}
          handlePrimaryAction={() => {
            handlePrimaryAction("Pricing");
          }}
        >
          <>
            <div className="formItem">
              <label htmlFor="Subscription">Subscription:</label>
              <input
                id="Subscription"
                type="checkbox"
                name="PerMonth"
                style={{ height: "20px" }}
                checked={pricingCard.PerMonth}
                onChange={(e) =>
                  setPricingCard((prev) => {
                    return { ...prev, PerMonth: e.target.checked };
                  })
                }
              />
            </div>

            <div className="formItem">
              <label htmlFor="title">title:</label>
              <input
                type="text"
                id="title"
                name="title"
                value={pricingCard.title}
                onChange={(event) => {
                  setPricingCard((prev) => {
                    return { ...prev, [event.target.name]: event.target.value };
                  });
                }}
              ></input>
            </div>
            <div className="formItem">
              <label htmlFor="title">Price:</label>
              <input
                type="text"
                id="Price"
                name="Price"
                value={pricingCard.Price}
                onChange={(event) => {
                  setPricingCard((prev) => {
                    return { ...prev, [event.target.name]: event.target.value };
                  });
                }}
              ></input>
            </div>
            <div className="formItem">
              <label htmlFor="Description">Description:</label>
              <textarea
                id="Description"
                name="description"
                value={pricingCard.description}
                onChange={(event) => {
                  setPricingCard((prev) => {
                    return { ...prev, [event.target.name]: event.target.value };
                  });
                }}
              ></textarea>
            </div>
            <div className="formItem">
              <div className="Pros-Wrapper">
                <div className="Pros-Adder">
                  <span>Pros</span>
                  <input
                    type="text"
                    value={proText}
                    onChange={(e) => {
                      setProText(e.target.value);
                    }}
                  ></input>
                  <button className="Button Add" onClick={addPro}>
                    Add
                  </button>
                </div>
                <ul>
                  {pricingCard.pros?.map((pro) => {
                    return (
                      <li key={pro.id}>
                        {pro.text}
                        <button
                          className="Button Danger"
                          onClick={() => {
                            DeletePro(pro.id);
                          }}
                        >
                          Delete
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          </>
        </MyModal>
      )}
      <div className="formItem" id="logo">
        <span>Background:</span>
        <label htmlFor="thumbnailInput">
          <img src={Upload} style={{ width: "25px", cursor: "pointer" }} />
        </label>
        <input
          type="file"
          hidden
          accept="image/*"
          id="thumbnailInput"
          name="BG"
          onChange={handleInput}
        />
      </div>
      <span style={{ margin: "20px" }}>
        to hide a page just leave the <strong>Page URL</strong> field empty
      </span>
      <div className="FormItem" id="Title">
        <label htmlFor="PageURL">Page URL:</label>
        <input
          type="text"
          id="PageURL"
          name="PageURL"
          value={data.PageURL}
          onChange={handleInput}
        />
      </div>
      <div className="FormItem" id="Title">
        <label htmlFor="PageName">Page Name:</label>
        <input
          type="text"
          id="PageName"
          name="PageName"
          value={data.PageName}
          onChange={handleInput}
        />
      </div>
      <div className="FormItem" id="Title">
        <label htmlFor="HeaderTitle">Header Title:</label>
        <input
          type="text"
          id="HeaderTitle"
          name="HeaderTitle"
          value={data.HeaderTitle}
          onChange={handleInput}
        />
      </div>
      <div className="FormItem">
        <label htmlFor="TopTitle">Top Title:</label>
        <input
          type="text"
          required
          id="TopTitle"
          name="TopTitle"
          value={data.TopTitle}
          onChange={handleInput}
        />
        <input
          className="ColorPicker"
          type="color"
          value={data.TopColor}
          name="TopColor"
          onChange={handleInput}
        />
      </div>
      <div className="FormItem">
        <label htmlFor="BottomTitle">Bottom Title:</label>
        <input
          type="text"
          required
          id="BottomTitle"
          name="BottomTitle"
          value={data.BottomTitle}
          onChange={handleInput}
          style={{ color: data.BottomColor }}
        />
        <input
          className="ColorPicker"
          type="color"
          value={data.BottomColor}
          name="BottomColor"
          onChange={handleInput}
        />
      </div>
      <div className="FormItem" id="Title">
        <label htmlFor="Para">Introduction</label>
        <textarea
          type="text"
          id="Para"
          name="Para"
          value={data.Para}
          onChange={handleInput}
        />
      </div>
      <div>
        <button
          className="Button Add"
          style={{ margin: "0px auto" }}
          onClick={CheckData}
        >
          Add Pricing Card
        </button>
      </div>
      <h4 style={{ margin: "20px" }}>Pricing Cards</h4>
      <div className="Pricing-container">{renderDummyPricingData}</div>
      <button
        className="Button View"
        id="Submit"
        onClick={() => {
          UpdateData(BackEndName, data);
        }}
      >
        Save
      </button>
    </div>
  );
};

export default Template6;
