import React, { useState, useEffect } from "react";
import { UPLOADPHOTO } from "../../../../server";
import { CreateToast } from "../../../../App";
import DataTable from "react-data-table-component";
import MyModal from "../../../PopUps/Confirm/Confirm";
import sortBy from "sort-by";

import Upload from "../../../../assets/upload.png";
import "./SidePages.css";
import TipTap from "./RichTextEditor/tiptap";
const Template9 = ({ Data, UpdateData, BackEndName }) => {
  const [data, setData] = useState(Data);
  const [NewCard, setNewCard] = useState({
    Content: "",
    Name: "",
    id: "",
  });
  const [showModal, setShowModal] = useState(false);
  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);
  const handlePrimaryAction = () => {
    if (data.Sec3Elements.length === 5) {
      CreateToast("max Cards Reached", "error");
      return;
    }
    const FoundName = data.Sec3Elements.some((element) => {
      return element.Name === NewCard.Name;
    });
    if (FoundName) {
      CreateToast("Name is taken by another card", "error");
      return;
    }
    setData((prev) => ({
      ...prev,
      Sec3Elements: [...prev.Sec3Elements, NewCard],
    }));
    setNewCard({
      Content: "",
      Name: "",
      id: "",
    });
    handleCloseModal();
  };
  const handlePostBodyChange = (value, Target) => {
    if (Target === "NewCard") {
      setNewCard((prev) => {
        return { ...prev, Content: value };
      });
      return;
    }
    let valueToChange;
    switch (Target) {
      case "Section1":
        valueToChange = "Sec1Body";
        break;
      case "Section2":
        valueToChange = "Sec2Body";
        break;
      case "Section4":
        valueToChange = "Sec4Body";
        break;
      case "Section5":
        valueToChange = "Sec5Body";
        break;
      case "Section6":
        valueToChange = "Sec6Body";
        break;
      case "Section7":
        valueToChange = "Sec7Body";
        break;

      default:
        break;
    }
    setData((prev) => {
      return { ...prev, [valueToChange]: value };
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
    } else {
      setData((prev) => {
        return { ...prev, [name]: value };
      });
    }
  };
  const DeleteCard = (id) => {
    const NewCards = data.Sec3Elements.filter((Card) => {
      return Card.id !== id;
    });

    setData((prev) => {
      return { ...prev, Sec3Elements: NewCards };
    });
  };
  const CardsData = data.Sec3Elements.map((Card) => {
    return {
      id: Card.id,
      title: Card.Name,
      Description: Card.Content,
      Options: (
        <button
          className="Button Danger"
          onClick={() => {
            DeleteCard(Card.id);
          }}
        >
          Delete
        </button>
      ),
    };
  });
  const CardsColumns = [
    {
      name: "Name",
      selector: (row) => row.title,
      sortable: true,
      center: true,
      width: "200px",
    },
    {
      name: "Description",
      selector: (row) => (
        <div
          className="text-wrap"
          dangerouslySetInnerHTML={{ __html: row.Description }}
        ></div>
      ),
      sortable: true,
      center: true,
    },

    {
      name: "Options",
      selector: (row) => row.Options,
      center: true,
      width: "200px",
    },
  ];
  useEffect(() => {
    let id;
    if (data.Sec3Elements.length === 0) {
      id = 1;
    } else {
      data.Sec3Elements.sort(sortBy("id"));
      data.Sec3Elements.forEach((category) => {
        id = +category.id + 1;
      });
    }
    setNewCard((prev) => {
      return { ...prev, id };
    });
  }, []);
  return (
    <div className="DataEntry Hosting">
      {showModal && (
        <MyModal
          className="Confirm PricingModal"
          show={showModal}
          handleClose={handleCloseModal}
          title="add Card"
          primaryButtonText={`add`}
          handlePrimaryAction={handlePrimaryAction}
        >
          <>
            <div className="formItem ">
              <label htmlFor="Name">Tab Name:</label>
              <input
                type="text"
                id="Name"
                name="Name"
                value={NewCard.Name}
                onChange={(event) => {
                  setNewCard((prev) => {
                    return { ...prev, [event.target.name]: event.target.value };
                  });
                }}
              ></input>
            </div>
            <TipTap
              setHTML={(value) => {
                handlePostBodyChange(value, "NewCard");
              }}
              OldData={NewCard.Content}
            />
          </>
        </MyModal>
      )}
      <div className="formItem" id="logo">
        <span>Background:</span>
        <label htmlFor="BG">
          <img src={Upload} style={{ width: "25px", cursor: "pointer" }} />
        </label>
        <input
          type="file"
          accept="image/*"
          hidden
          id="BG"
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
      <button className="Button View" onClick={handleShowModal}>
        AddCard
      </button>
      <DataTable
        className="Table animate__animated animate__fadeIn"
        style={{ animationDelay: ".4s" }}
        theme="light"
        highlightOnHover
        columns={CardsColumns}
        data={CardsData}
      />
      <div className="Section-wrapper">
        <h3>Section one</h3>
        <div className="FormItem" id="Title">
          <label htmlFor="Sec1Title">Section one Title:</label>
          <input
            type="text"
            id="Sec1Title"
            name="Sec1Title"
            value={data.Sec1Title}
            onChange={handleInput}
          />
        </div>
        <TipTap
          setHTML={(value) => {
            handlePostBodyChange(value, "Section1");
          }}
          OldData={data.Sec1Body}
        />
      </div>
      <div className="Section-wrapper">
        <h3>Section Two</h3>
        <div className="FormItem" id="Title">
          <label htmlFor="Sec2Title">Section Two Title:</label>
          <input
            type="text"
            id="Sec2Title"
            name="Sec2Title"
            value={data.Sec2Title}
            onChange={handleInput}
          />
        </div>
        <TipTap
          setHTML={(value) => {
            handlePostBodyChange(value, "Section2");
          }}
          OldData={data.Sec2Body}
        />
      </div>
      <div className="Section-wrapper">
        <h3>Section Four</h3>
        <div className="FormItem" id="Title">
          <label htmlFor="Sec4Title">Section Four Title:</label>
          <input
            type="text"
            id="Sec4Title"
            name="Sec4Title"
            value={data.Sec4Title}
            onChange={handleInput}
          />
        </div>
        <div className="FormItem" id="Title">
          <label htmlFor="Sec4Subtitle">Section Four Sub Title:</label>
          <input
            type="text"
            id="Sec4Subtitle"
            name="Sec4Subtitle"
            value={data.Sec4Subtitle}
            onChange={handleInput}
          />
        </div>
        <TipTap
          setHTML={(value) => {
            handlePostBodyChange(value, "Section4");
          }}
          oldData={data.Sec4Body}
        />
      </div>
      <div className="Section-wrapper">
        <h3>Section Five</h3>
        <div className="FormItem" id="Title">
          <label htmlFor="Sec5Title">Section Five Title:</label>
          <input
            type="text"
            id="Sec5Title"
            name="Sec5Title"
            value={data.Sec5Title}
            onChange={handleInput}
          />
        </div>

        <TipTap
          setHTML={(value) => {
            handlePostBodyChange(value, "Section5");
          }}
          oldData={data.Sec5Body}
        />
      </div>
      <div className="Section-wrapper">
        <h3>Section Six</h3>
        <div className="FormItem" id="Title">
          <label htmlFor="Sec6Title">Section Six Title:</label>
          <input
            type="text"
            id="Sec6Title"
            name="Sec6Title"
            value={data.Sec6Title}
            onChange={handleInput}
          />
        </div>

        <TipTap
          setHTML={(value) => {
            handlePostBodyChange(value, "Section6");
          }}
          oldData={data.Sec6Body}
        />
      </div>
      <div className="Section-wrapper">
        <h3>Section Seven</h3>
        <div className="FormItem" id="Title">
          <label htmlFor="Sec7Title">Section Seven Title:</label>
          <input
            type="text"
            id="Sec7Title"
            name="Sec7Title"
            value={data.Sec7Title}
            onChange={handleInput}
          />
        </div>

        <TipTap
          setHTML={(value) => {
            handlePostBodyChange(value, "Section7");
          }}
          oldData={data.Sec7Body}
        />
      </div>
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

export default Template9;
