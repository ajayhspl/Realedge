import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import MyModal from "../../../PopUps/Confirm/Confirm";
import { CreateToast } from "../../../../App";
import sortBy from "sort-by";
import Upload from "../../../../assets/upload.png";
import { DELETEPHOTO, UPLOADPHOTO } from "../../../../server";

const Section3 = ({ FetchedData, UpdateData }) => {
  const [data, setData] = useState(FetchedData);
  const [photoUploaded, setPhotoUploaded] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [NewCard, setNewCard] = useState({
    url: "",
    id: "",
  });
  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);
  const handlePrimaryAction = () => {
    if (!photoUploaded) {
      CreateToast("photo uploading please wait", "error");
      return;
    }
    handleCloseModal();
    setData((prev) => {
      return { ...prev, imgList: [...prev.imgList, NewCard] };
    });

    setNewCard({ url: "", id: "" });
    setPhotoUploaded(false);
  };
  const changePhoto = async (e, id) => {
    CreateToast("uploading photo", "info", 2000);
    const Photo = e.target.files[0];
    const url = await UPLOADPHOTO(`/customization/Section3/${id}.png`, Photo);

    const newData = data.imgList.map((card) => {
      if (card.id === id) {
        return { ...card, url }; // Create a new object with updated URL
      } else {
        return card;
      }
    });

    setData((prev) => {
      return { ...prev, imgList: newData };
    });
    CreateToast("photo uploaded", "success");
    setPhotoUploaded(true);
  };
  const handleInput = async (e) => {
    const { name, value } = e.target;
    if (name === "url") {
      CreateToast("uploading photo", "info", 2000);
      const Photo = e.target.files[0];
      const url = await UPLOADPHOTO(
        `/customization/Section3/${NewCard.id}.png`,
        Photo
      );
      setNewCard((prev) => {
        return {
          ...prev,
          url: url,
        };
      });
      CreateToast("photo uploaded", "success");
      setPhotoUploaded(true);
      return;
    }
    setData((prev) => {
      return { ...prev, [name]: value };
    });
  };

  const DeleteCard = (id) => {
    const NewCards = data.imgList.filter((Card) => {
      return Card.id !== id;
    });
    DELETEPHOTO(`/customization/Section3/${id}.png`);
    setData((prev) => {
      return { ...prev, imgList: NewCards };
    });
  };
  const columns = [
    {
      name: "id",
      selector: (row) => row.id,
      sortable: true,
      center: true,
      width: "150px",
    },
    {
      name: "image",
      selector: (row) => row.url,
      sortable: true,
      center: true,
    },

    {
      name: "Options",
      selector: (row) => row.Options,
      sortable: true,
      center: true,
      width: "300px",
    },
  ];
  const TableData = data.imgList.map((Card) => {
    return {
      id: Card.id,
      url: (
        <img style={{ maxWidth: "200px", margin: "20px 0" }} src={Card.url} />
      ),

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

  useEffect(() => {
    let id;
    data.imgList.sort(sortBy("id"));
    if (data.imgList.length === 0) {
      id = 1;
    } else {
      data.imgList.forEach((img) => {
        id = +img.id + 1;
      });
    }
    setNewCard((prev) => {
      return { ...prev, id };
    });
  }, [data]);
  const handleCheckboxChange = () => {
    setData((prev) => ({ ...prev, Show: !prev.Show }));
  };
  return (
    <div className="DataEntry Section1">
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
            <div className="FormItem" id="logo">
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
      <div className="FormItem" id="Title">
        <label htmlFor="title">Title:</label>
        <textarea
          type="text"
          required
          id="title"
          name="title"
          value={data.title}
          onChange={handleInput}
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
          UpdateData("Section3", data);
        }}
      >
        Save
      </button>
    </div>
  );
};

export default Section3;
/*  categories.sort(sortBy("id"));
      categories.forEach((category) => {
        id = +category.id + 1;
      });
      */
