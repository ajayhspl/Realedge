import React, { useState, useEffect, useRef } from "react";
import DataTable from "react-data-table-component";
import MyModal from "../../../PopUps/Confirm/Confirm";
import { CreateToast } from "../../../../App";
import sortBy from "sort-by";
import Input from "../../../Input/Input";

const Section1 = ({ FetchedData, UpdateData, setEdited, edited }) => {
  const maxCharacters = 120;

  const [data, setData] = useState(FetchedData);
  const [showModal, setShowModal] = useState(false);
  const [NewCard, setNewCard] = useState({
    MainNumber: "",
    subTitle: "",
    Description: "",
    Link: "",
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
      name: "Link",
      selector: (row) => row.Link,
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
        <Input
          textarea={true}
          name="Description"
          onChange={handleChange}
          value={Card.Description}
          customWidth="500px"
        />
      ),
      subTitle: (
        <Input
          name="subTitle"
          value={Card.subTitle}
          onChangeFunction={handleChange}
        />
      ),
      Link: (
        <Input name="Link" value={Card.Link} onChangeFunction={handleChange} />
      ),
      MainNumber: (
        <Input
          name="MainNumber"
          value={Card.MainNumber}
          onChangeFunction={handleChange}
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
            <Input
              label="SubTitle"
              type="text"
              id="SubTitle"
              name="subTitle"
              value={NewCard.subTitle}
              onChangeFunction={(event) => {
                const { name, value } = event.target;
                if (value.length >= 15) {
                  CreateToast("Max words reached", "error", 2000);
                  return;
                }
                setNewCard((prev) => {
                  return { ...prev, [name]: value };
                });
              }}
            />
            <Input
              label="Link"
              type="text"
              id="Link"
              name="Link"
              value={NewCard.Link}
              onChangeFunction={(event) => {
                const { name, value } = event.target;
                setNewCard((prev) => {
                  return { ...prev, [name]: value };
                });
              }}
            />
            <Input
              label="MainNumber"
              type="text"
              id="MainNumber"
              name="MainNumber"
              value={NewCard.MainNumber}
              onChangeFunction={(event) => {
                setNewCard((prev) => {
                  return { ...prev, [event.target.name]: event.target.value };
                });
              }}
            />
            <Input
              textarea={true}
              label="Description"
              id="Description"
              name="Description"
              value={NewCard.Description}
              onChangeFunction={(event) => {
                const { name, value } = event.target;
                if (value.length >= maxCharacters) {
                  CreateToast("Max words reached", "error", 2000);
                  return;
                }
                setNewCard((prev) => {
                  return { ...prev, [name]: value };
                });
              }}
            />
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

      <Input
        label="Title"
        id="Title"
        name="Title"
        required={true}
        value={data.Title}
        onChangeFunction={handleInput}
        customWidth="70%"
      />
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
      <div className={`SubmitWrapper ${edited ? "fixed" : ""}`}>
        <button
          className="Button View"
          id="Submit"
          onClick={() => {
            setEdited(false);
            UpdateData("Section1", data);
          }}
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default Section1;
/*  categories.sort(sortBy("id"));
      categories.forEach((category) => {
        id = +category.id + 1;
      });
      */
