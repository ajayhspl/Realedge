import React, { useState, useEffect, useRef } from "react";
import DataTable from "react-data-table-component";
import MyModal from "../../../PopUps/Confirm/Confirm";
import { CreateToast } from "../../../../App";
import sortBy from "sort-by";
import Upload from "../../../../assets/upload.png";
import { DELETEPHOTO, UPLOADPHOTO } from "../../../../server";

const Section2 = ({ FetchedData, UpdateData, setEdited }) => {
  const maxCharacters = 300;
  const [data, setData] = useState(FetchedData);
  const [photoUploaded, setPhotoUploaded] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [NewCard, setNewCard] = useState({
    iconURL: "",
    id: "",
    description: "",
    title: "",
  });
  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);
  const changePhoto = async (e, id) => {
    CreateToast("uploading photo", "info", 2000);
    const Photo = e.target.files[0];
    const url = await UPLOADPHOTO(`/customization/Section8/${id}.png`, Photo);

    const newData = data.Cards.map((card) => {
      if (card.id === id) {
        return { ...card, iconURL: url }; // Create a new object with updated URL
      } else {
        return card;
      }
    });

    setData((prev) => {
      return { ...prev, Cards: newData };
    });
    CreateToast("photo uploaded", "success");
    setPhotoUploaded(true);
  };
  const handlePrimaryAction = () => {
    if (!photoUploaded) {
      CreateToast("photo uploading please wait", "error");
      return;
    }
    handleCloseModal();
    setData((prev) => {
      return { ...prev, Cards: [...prev.Cards, NewCard] };
    });

    setNewCard({ iconURL: "", id: "", description: "", title: "" });
    setPhotoUploaded(false);
  };
  const handleInput = async (e) => {
    const { name, value } = e.target;
    if (name === "url") {
      CreateToast("uploading photo", "info", 2000);
      const Photo = e.target.files[0];
      const url = await UPLOADPHOTO(
        `/customization/Section8/${NewCard.id}.png`,
        Photo
      );
      setNewCard((prev) => {
        return {
          ...prev,
          iconURL: url,
        };
      });
      CreateToast("photo uploaded", "success");
      setPhotoUploaded(true);
      return;
    }
    if (name === "description" && value.length >= maxCharacters) {
      CreateToast("max words reached", "error", 2000);
      return;
    }
    if (name === "title" && value.length >= 50) {
      CreateToast("max words reached", "error", 2000);
      return;
    }
    setNewCard((prev) => {
      return { ...prev, [name]: value };
    });
  };

  const DeleteCard = (id) => {
    const NewCards = data.Cards.filter((Card) => {
      return Card.id !== id;
    });
    DELETEPHOTO(`/customization/Section8/${id}.png`);
    setData((prev) => {
      return { ...prev, Cards: NewCards };
    });
  };
  const columns = [
    {
      name: "Name",
      selector: (row) => row.Name,
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
      selector: (row) => row.url,
      sortable: true,
      center: true,
      width: "200px",
    },

    {
      name: "Options",
      selector: (row) => row.Options,
      sortable: true,
      center: true,
      width: "300px",
    },
  ];
  const TableData = data.Cards.map((Card) => {
    const handleChange = (e) => {
      const { name, value } = e.target;
      if (name === "description" && value.length >= maxCharacters) {
        CreateToast("max words reached", "error", 2000);
        return;
      }
      if (name === "title" && value.length >= 50) {
        CreateToast("max words reached", "error", 2000);
        return;
      }
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
      Name: <input name="title" value={Card.title} onChange={handleChange} />,
      Description: (
        <textarea
          style={{ minWidth: "500px" }}
          name="description"
          onChange={handleChange}
          value={Card.description}
        />
      ),

      url: <img src={Card.iconURL} style={{ maxWidth: "75px" }} />,

      Options: (
        <div className="Button-wrapper">
          <button
            className="Button Danger"
            onClick={() => {
              DeleteCard(Card.ID);
            }}
          >
            Delete
          </button>
          <div className="FormItem" id="logo">
            <label htmlFor={`ChangePhoto${Card.id}`}>Change Photo</label>
            <input
              type="file"
              hidden
              required
              id={`ChangePhoto${Card.id}`}
              name="url"
              onChange={(e) => {
                changePhoto(e, Card.id);
              }}
            />
          </div>
        </div>
      ),
    };
  });
  const handleMainInput = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };
  useEffect(() => {
    let id;
    data.Cards.sort(sortBy("id"));
    if (data.Cards.length === 0) {
      id = 1;
    } else {
      data.Cards.forEach((card) => {
        id = +card.id + 1;
      });
    }
    setNewCard((prev) => {
      return { ...prev, id };
    });
  }, [data]);
  const handleCheckboxChange = () => {
    setData((prev) => ({ ...prev, Show: !prev.Show }));
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
  return (
    <div className="DataEntry section8">
      {showModal && (
        <MyModal
          className="Confirm"
          show={showModal}
          handleClose={handleCloseModal}
          title="Add Card"
          primaryButtonText={`Add`}
          handlePrimaryAction={handlePrimaryAction}
        >
          <>
            <div className="formItem" id="Name">
              <label htmlFor="title">Name:</label>
              <input
                type="text"
                required
                id="title"
                autoComplete="false"
                name="title"
                value={NewCard.title}
                onChange={handleInput}
              />
            </div>
            <div className="formItem" id="Name">
              <label htmlFor="description">description:</label>
              <textarea
                type="text"
                required
                id="description"
                name="description"
                value={NewCard.description}
                onChange={handleInput}
              />
            </div>
            <div className="formItem" id="logo">
              <span>Logo:</span>
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
                name="url"
                onChange={handleInput}
              />
            </div>
          </>
        </MyModal>
      )}
      <div className="FormItem">
        <label htmlFor="title">Title:</label>
        <input
          type="text"
          required
          id="title"
          name="Title"
          value={data.Title}
          onChange={handleMainInput}
        />
      </div>
      <div className="formItem form-check CheckBox">
        <label className="form-check-label">
          Show Section:
          <input
            className="form-check-input"
            type="checkbox"
            checked={data.Show}
            onChange={handleCheckboxChange}
          />
        </label>
      </div>
      <div className="FormItem">
        <label htmlFor="SubTitle">Paragraph:</label>
        <textarea
          type="text"
          required
          id="SubTitle"
          name="Paragraph"
          value={data.Paragraph}
          onChange={handleMainInput}
        />
      </div>
      <button
        className="Button Add"
        style={{ margin: "0px auto" }}
        onClick={handleShowModal}
      >
        Add Card
      </button>
      <DataTable
        className="Table animate__animated animate__fadeIn"
        style={{ animationDelay: ".4s" }}
        theme="light"
        highlightOnHover
        columns={columns}
        data={TableData}
      />
      <button
        className="Button View"
        id="Submit"
        onClick={() => {
          UpdateData("Section8", data);
        }}
      >
        Save
      </button>
    </div>
  );
};

export default Section2;
/*  categories.sort(sortBy("id"));
      categories.forEach((category) => {
        id = +category.id + 1;
      });
      */
