import React, { useState, useEffect } from "react";
import { UPLOADPHOTO, DELETEPHOTO } from "../../../../server";
import { CreateToast } from "../../../../App";
import Upload from "../../../../assets/upload.png";
import sortBy from "sort-by";
import DataTable from "react-data-table-component";
import MyModal from "../../../PopUps/Confirm/Confirm";
import TipTap from "./RichTextEditor/tiptap";
const Template3 = ({ Data, UpdateData, BackEndName }) => {
  const [data, setData] = useState(Data);
  const [NewCard, setNewCard] = useState({
    img: "",
    text: "",
    title: "",
    id: "",
  });
  const [photoUploading, setPhotoUploading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);
  const handlePrimaryAction = () => {
    setData((prev) => {
      return { ...prev, Cards: [...prev.Cards, NewCard] };
    });
    setNewCard({ img: "", text: "", title: "", id: "" });
    handleCloseModal();
  };
  const handlePostBodyChange = (value) => {
    setData((prev) => {
      return { ...prev, PageText: value };
    });
  };
  const handleInput = async (e) => {
    const { name, value } = e.target;
    if (name === "URL") {
      setPhotoUploading(true);
      CreateToast("uploading photo", "info", 2000);
      const Photo = e.target.files[0];
      const img = await UPLOADPHOTO(
        `/customization/SidePages/${data.id}/Icon${NewCard.id}.png`,
        Photo
      );
      setNewCard((prev) => {
        return {
          ...prev,
          img,
        };
      });
      CreateToast("photo uploaded", "success");
      setPhotoUploading(false);
      return;
    }
    if (name === "BG") {
      setPhotoUploading(true);

      CreateToast("uploading photo", "info", 2000);

      const Photo = e.target.files[0];
      const url = await UPLOADPHOTO(
        `/customization/SidePages/${data.id}/BG.jpg`,
        Photo
      );
      setData((prev) => {
        return { ...prev, BG: url };
      });
      CreateToast("photo uploaded", "success", 2000);
      setPhotoUploading(false);

      return;
    } else {
      setData((prev) => {
        return { ...prev, [name]: value };
      });
    }
  };
  const Cardscolumns = [
    {
      name: "Title",
      selector: (row) => row.title,
      sortable: true,
      center: true,
      width: "200px",
    },
    {
      name: "Description",
      selector: (row) => <div className="text-wrap">{row.Description}</div>,
      sortable: true,
      center: true,
    },
    {
      name: "image",
      selector: (row) => row.img,
      center: true,
      width: "200px",
    },
    {
      name: "Options",
      selector: (row) => row.Options,
      center: true,
      width: "200px",
    },
  ];
  const DeleteCard = (id) => {
    const NewCards = data.Cards.filter((Card) => {
      return Card.id !== id;
    });
    DELETEPHOTO(`/customization/SidePages/${data.id}/Icon${id}.png`);
    setData((prev) => {
      return { ...prev, Cards: NewCards };
    });
  };

  const CardsData = data.Cards.map((Card) => {
    const handleChange = (e) => {
      const { name, value } = e.target;
      let oldData = data.Cards;
      let newData = oldData.map((oldCard) => {
        if (oldCard.id === Card.id) {
          return {
            ...oldCard,
            [name]: value,
          };
        } else {
          return oldCard;
        }
      });
      setData((prev) => ({ ...prev, Cards: newData }));
    };
    return {
      id: Card.id,
      title: <input name="title" value={Card.title} onChange={handleChange} />,
      Description: (
        <textarea
          style={{ minWidth: "500px" }}
          name="text"
          onChange={handleChange}
          value={Card.text}
        />
      ),
      img: <img src={Card.img} style={{ maxWidth: "50px", margin: "10px" }} />,
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
  useEffect(() => {
    let id;
    if (data.Cards.length === 0) {
      id = 1;
    } else {
      data.Cards.sort(sortBy("id"));
      data.Cards.forEach((category) => {
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
          className="Confirm"
          show={showModal}
          handleClose={handleCloseModal}
          title="add Card"
          primaryButtonText={`add`}
          handlePrimaryAction={handlePrimaryAction}
        >
          <>
            <div className="formItem" id="logo">
              <span>Photo:</span>
              <label htmlFor="thumbnailInput">
                <img
                  src={Upload}
                  style={{ width: "25px", cursor: "pointer" }}
                />
              </label>
              <input
                type="file"
                hidden
                required
                id="thumbnailInput"
                name="URL"
                onChange={handleInput}
              />
            </div>
            <div className="formItem ">
              <label htmlFor="title">title:</label>
              <input
                type="text"
                id="title"
                name="title"
                value={NewCard.title}
                onChange={(event) => {
                  setNewCard((prev) => {
                    return { ...prev, [event.target.name]: event.target.value };
                  });
                }}
              ></input>
            </div>
            <div className="formItem ">
              <label htmlFor="text">Description:</label>
              <textarea
                id="text"
                name="text"
                value={NewCard.text}
                onChange={(event) => {
                  setNewCard((prev) => {
                    return { ...prev, [event.target.name]: event.target.value };
                  });
                }}
              ></textarea>
            </div>
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
        />
        <input
          className="ColorPicker"
          type="color"
          value={data.BottomColor}
          name="BottomColor"
          onChange={handleInput}
        />
      </div>
      <TipTap setHTML={handlePostBodyChange} OldData={data.PageText} />

      <button
        className="Button Add"
        style={{ margin: "0px 20px" }}
        onClick={handleShowModal}
      >
        Add Card
      </button>
      <h4 style={{ margin: "20px" }}>Cards Table</h4>
      <DataTable
        className="Table animate__animated animate__fadeIn"
        style={{ animationDelay: ".4s" }}
        theme="light"
        highlightOnHover
        columns={Cardscolumns}
        data={CardsData}
      />
      <button
        className="Button View"
        id="Submit"
        onClick={() => {
          if (photoUploading) {
            CreateToast("uploading Photo,please wait...", "error", 2000);
            return;
          }
          UpdateData(BackEndName, data);
        }}
      >
        Save
      </button>
    </div>
  );
};

export default Template3;
