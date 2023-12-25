import React, { useState, useEffect, useRef } from "react";
import { GETCOLLECTION } from "../../../../server";
import sortBy from "sort-by";
import DataTable from "react-data-table-component";
import Input from "../../../Input/Input";

const Section5 = ({ FetchedData, UpdateData, setEdited, edited }) => {
  const [data, setData] = useState(FetchedData);
  const [showAdd, setShowAdd] = useState(false);
  const [projects, SetProjects] = useState([]);

  const [newTestimonial, SetNewTestimonial] = useState({
    ProjectID: "",
    id: "",
    Testimonial: {
      Description: "",
      PersonName: "",
      PersonPosition: "",
      Title: "",
    },
  });
  const handleCheckboxChange = () => {
    setData((prev) => ({ ...prev, Show: !prev.Show }));
  };
  const handleSelectChange = (event) => {
    SetNewTestimonial((prev) => {
      return { ...prev, ProjectID: +event.target.value };
    });
  };

  const handleNew = (e) => {
    const { name, value } = e.target;
    SetNewTestimonial((prev) => {
      return {
        ...prev,
        Testimonial: {
          ...prev.Testimonial,
          [name]: value,
        },
      };
    });
  };
  const handleInput = (e) => {
    const { name, value } = e.target;
    setData((prev) => {
      return { ...prev, [name]: value };
    });
  };
  useEffect(() => {
    const FetchData = async () => {
      SetProjects(await GETCOLLECTION("Projects"));
    };
    FetchData();
  }, []);

  useEffect(() => {
    let id;
    data.Testimoinals.sort(sortBy("id"));
    if (data.Testimoinals.length === 0) {
      id = 1;
    } else {
      data.Testimoinals.forEach((Testimonial) => {
        id = +Testimonial.id + 1;
      });
    }

    SetNewTestimonial((prev) => {
      return { ...prev, id };
    });
  }, [data]);
  const renderIDs = projects?.map((Project) => {
    return (
      <option key={Project.ProjectID} value={Project.ProjectID}>
        {Project.Title}
      </option>
    );
  });
  const Exit = () => {
    setShowAdd(false);
    SetNewTestimonial((prev) => {
      return {
        ProjectID: "",
        id: prev.id,
        Testimonial: {
          Description: "",
          PersonName: "",
          PersonPosition: "",
          Title: "",
        },
      };
    });
  };
  const Cardscolumns = [
    {
      name: "Project",
      selector: (row) => row.targetProject,
      width: "200px",
    },
    {
      name: "Title",
      width: "190px",

      selector: (row) => <div className="text-wrap">{row.Title}</div>,
    },
    {
      name: "Description",
      selector: (row) => <div className="text-wrap">{row.Description}</div>,
      center: true,
      width: "400px",
    },
    {
      name: <div className="text-wrap">Testimonial Giver</div>,
      selector: (row) => <div className="text-wrap">{row.PersonName}</div>,
      center: true,
      width: "190px",
    },
    {
      name: <div className="text-wrap">Testimonial giver Position</div>,
      selector: (row) => <div className="text-wrap">{row.PersonPosition}</div>,
      center: true,
      width: "190px",
    },
    {
      name: <div className="text-wrap">Testimonial giver Company</div>,

      selector: (row) => <div className="text-wrap">{row.Company}</div>,
      center: true,
    },

    {
      name: "Options",
      selector: (row) => row.Options,
      center: true,
      width: "150px",
    },
  ];
  const firstRender = useRef(true);
  useEffect(() => {
    if (firstRender.current) {
      // Skip the first render
      firstRender.current = false;
    } else {
      setEdited(true);
    }
  }, [data]);
  const DeleteCard = (id) => {
    const Testimoinals = data.Testimoinals.filter((Card) => {
      return Card.id !== id;
    });

    setData((prev) => {
      return { ...prev, Testimoinals };
    });
  };

  const CardsData =
    projects.length > 0
      ? data.Testimoinals.map((Card) => {
          const handleChange = (e) => {
            const { name, value } = e.target;
            let oldData = data.Testimoinals;
            let newData = oldData.map((oldCard) => {
              if (oldCard.id === Card.id) {
                return {
                  ...oldCard,
                  Testimonial: {
                    ...oldCard.Testimonial,
                    [name]: value,
                  },
                };
              } else {
                return oldCard;
              }
            });
            setData((prev) => ({ ...prev, Testimoinals: newData }));
          };

          const targetProject = projects?.find((project) => {
            return project.ProjectID == Card.ProjectID;
          });
          return {
            id: Card.id,
            Title: (
              <Input
                textarea={true}
                customWidth="150px"
                name="Title"
                onChangeFunction={handleChange}
                value={Card.Testimonial.Title}
              />
            ),
            targetProject: targetProject
              ? targetProject.Title
              : "Project Deleted",
            Description: (
              <Input
                textarea={true}
                customWidth="300px"
                name="Description"
                onChangeFunction={handleChange}
                value={Card.Testimonial.Description}
              />
            ),
            PersonName: (
              <Input
                name="PersonName"
                onChangeFunction={handleChange}
                value={Card.Testimonial.PersonName}
              />
            ),
            PersonPosition: (
              <Input
                name="PersonPosition"
                onChangeFunction={handleChange}
                value={Card.Testimonial.PersonPosition}
              />
            ),
            Company: targetProject
              ? targetProject.CompanyName
              : "Project Deleted",
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
        })
      : "";
  const AddNew = () => {
    setData((prev) => {
      return { ...prev, Testimoinals: [...prev.Testimoinals, newTestimonial] };
    });
    setShowAdd(false);
    SetNewTestimonial((prev) => {
      return {
        ProjectID: "",
        id: prev.id,
        Testimonial: {
          Description: "",
          PersonName: "",
          PersonPosition: "",
          Title: "",
        },
      };
    });
  };

  return (
    <div className="DataEntry section5">
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
        label="Section Title"
        type="text"
        required={true}
        id="Title"
        name="Title"
        value={data.Title}
        onChangeFunction={handleInput}
        customWidth="70%"
      />
      <Input
        label="Paragraph"
        textarea={true}
        required={true}
        id="paragraph"
        name="paragraph"
        value={data.paragraph}
        onChangeFunction={handleInput}
        customWidth="70%"
      />

      <button
        onClick={() => {
          setShowAdd((prev) => !prev);
        }}
        className="Button"
      >
        Add Testimonial
      </button>
      {showAdd && (
        <>
          <form className="Add-Testimonial">
            <Input
              label="Title"
              type="text"
              id="Title"
              name="Title"
              value={newTestimonial.Testimonial.Title}
              onChangeFunction={handleNew}
              customWidth="45%"
            />
            <Input
              label="Person Name"
              type="text"
              id="PersonName"
              name="PersonName"
              value={newTestimonial.Testimonial.PersonName}
              onChangeFunction={handleNew}
              customWidth="45%"
            />
            <Input
              label="Person Position"
              type="text"
              id="PersonPosition"
              name="PersonPosition"
              value={newTestimonial.Testimonial.PersonPosition}
              onChangeFunction={handleNew}
              customWidth="45%"
            />

            <div className="FormItem select-container">
              <label htmlFor="PersonPosition">Project: </label>
              <select
                className="styled-select"
                style={{ width: "200px" }}
                value={newTestimonial.ProjectID}
                onChange={handleSelectChange}
              >
                {renderIDs}
              </select>
            </div>
            <Input
              label="Description"
              textarea={true}
              id="Description"
              name="Description"
              value={newTestimonial.Testimonial.Description}
              onChangeFunction={handleNew}
            />
          </form>

          <div className="Button-wrapper">
            <button className="Button View" onClick={AddNew}>
              Upload
            </button>
            <button className="Button Danger" onClick={Exit}>
              Cancel
            </button>
          </div>
        </>
      )}
      <h4 style={{ margin: "20px" }}>Testimonials</h4>
      <DataTable
        className="Table animate__animated animate__fadeIn"
        style={{ animationDelay: ".4s" }}
        theme="light"
        highlightOnHover
        columns={Cardscolumns}
        data={CardsData}
      />
      <div className={`SubmitWrapper ${edited ? "fixed" : ""}`}>
        <button
          className="Button View"
          id="Submit"
          onClick={() => {
            setEdited(false);
            UpdateData("Section5", data);
          }}
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default Section5;
