import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import MyModal from "../../../PopUps/Confirm/Confirm";
import { CreateToast } from "../../../../App";
import sortBy from "sort-by";
const Section1 = ({ FetchedData, UpdateData }) => {
  const maxCharacters = 120;

  const [data, setData] = useState(FetchedData);
  const [showModal, setShowModal] = useState(false);
  const [NewCard, setNewCard] = useState({
    MainNumber: "",
    subTitle: "",
    Description: "",
    id: "",
  });
  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);
  const handlePrimaryAction = () => {
    if (NewCard.Description.length >= maxCharacters) {
      CreateToast("max words reached in Description", "error", 2000);
      return;
    }
    if (NewCard.subTitle.length >= 15) {
      CreateToast("max words reached in subtitle", "error", 2000);
      return;
    }
    setData((prev) => {
      return { ...prev, Cards: [...prev.Cards, NewCard] };
    });
    setNewCard({ MainNumber: "", subTitle: "", Description: "", id: "" });
    handleCloseModal();
  };

  const handleInput = async (e) => {
    const { name, value } = e.target;

    setData((prev) => {
      return { ...prev, [name]: value };
    });
  };
  const CheckCards = () => {
    if (data.Cards.length === 3) {
      CreateToast(
        "you can only add 3 cards max,please delete some to be able to add more",
        "error"
      );
    } else {
      handleShowModal();
    }
  };
  const DeleteCard = (id) => {
    const NewCards = data.Cards.filter((Card) => {
      return Card.id !== id;
    });
    setData((prev) => {
      return { ...prev, Cards: NewCards };
    });
  };
  const columns = [
    {
      name: "Name",
      selector: (row) => row.subTitle,
      sortable: true,
      center: true,
      width: "200px",
    },
    {
      name: "Description",
      selector: (row) => row.Description,
      sortable: true,
      center: true,
    },

    {
      name: "MainNumber",
      selector: (row) => row.MainNumber,
      sortable: true,
      center: true,
      width: "100px",
    },
    {
      name: "Options",
      selector: (row) => row.Options,
      sortable: true,
      center: true,
      width: "200px",
    },
  ];
  const TableData = data.Cards.map((Card) => {
    const handleChange = (e) => {
      const { name, value } = e.target;
      if (name === "Description") {
        if (value.length >= maxCharacters) {
          CreateToast("max words reached", "error", 2000);
          return;
        }
      }
      if (name === "subTitle") {
        if (value.length >= 15) {
          CreateToast("max words reached", "error", 2000);
          return;
        }
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
      Description: (
        <textarea
          style={{ minWidth: "500px" }}
          name="Description"
          onChange={handleChange}
          value={Card.Description}
        />
      ),
      subTitle: (
        <input name="subTitle" value={Card.subTitle} onChange={handleChange} />
      ),
      MainNumber: (
        <input
          name="MainNumber"
          value={Card.MainNumber}
          onChange={handleChange}
        />
      ),
      Options: (
        <>
          <button
            className="Button Danger"
            onClick={() => {
              DeleteCard(Card.id);
            }}
          >
            Delete
          </button>
        </>
      ),
    };
  });
  useEffect(() => {
    let id;
    data.Cards.sort(sortBy("id"));
    data.Cards.forEach((category) => {
      id = +category.id + 1;
    });
    setNewCard((prev) => {
      return { ...prev, id: id };
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
          title="AddCard"
          primaryButtonText={`Add`}
          handlePrimaryAction={handlePrimaryAction}
        >
          <>
            <div className="formItem ">
              <label htmlFor="SubTitle">SubTitle:</label>
              <input
                type="text"
                id="SubTitle"
                name="subTitle"
                value={NewCard.subTitle}
                onChange={(event) => {
                  const { name, value } = event.target;
                  if (value.length >= 15) {
                    CreateToast("max words reached", "error", 2000);
                    return;
                  }
                  setNewCard((prev) => {
                    return { ...prev, [name]: value };
                  });
                }}
              ></input>
            </div>
            <div className="formItem ">
              <label htmlFor="MainNumber">MainNumber:</label>
              <input
                type="text"
                id="MainNumber"
                name="MainNumber"
                value={NewCard.MainNumber}
                onChange={(event) => {
                  setNewCard((prev) => {
                    return { ...prev, [event.target.name]: event.target.value };
                  });
                }}
              ></input>
            </div>
            <div className="formItem ">
              <label htmlFor="MainNumber">Description:</label>
              <textarea
                type="number"
                id="Description"
                name="Description"
                value={NewCard.Description}
                onChange={(event) => {
                  const { name, value } = event.target;
                  if (value.length >= maxCharacters) {
                    CreateToast("max words reached", "error", 2000);
                    return;
                  }
                  setNewCard((prev) => {
                    return { ...prev, [name]: value };
                  });
                }}
              ></textarea>
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
        <label htmlFor="Title">Title:</label>
        <textarea
          type="text"
          required
          id="Title"
          name="Title"
          value={data.Title}
          onChange={handleInput}
        />
      </div>
      <button
        className="Button Add"
        style={{ margin: "0px auto" }}
        onClick={CheckCards}
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
          UpdateData("Section1", data);
        }}
      >
        Save
      </button>
    </div>
  );
};

export default Section1;
/*  categories.sort(sortBy("id"));
      categories.forEach((category) => {
        id = +category.id + 1;
      });
      */
