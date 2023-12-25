import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { CreateToast } from "../../../App";
import { GETCOLLECTION, DELETEDOC, SETDOC, GETDOC } from "../../../server";
import MyModal from "../../PopUps/Confirm/Confirm";
import sort from "../../../assets/sort.png";
import sortBy from "sort-by";
import Input from "../../Input/Input";
const DropDowns = ({ SetCustomizationPage, setActivePageDash }) => {
  const [dropDowns, setDropDowns] = useState([]);
  const [targetDropDown, setTargetDropDown] = useState(null);
  const [Pages, setPages] = useState([]);
  const [changeInOrder, setChangeInOrder] = useState(false);
  const [DoingOperation, setDoingOperation] = useState(false);
  const [newDropDown, SetNewDropDown] = useState({
    Name: "",
    id: "",
    Pages: [],
  });
  const [showModal, setShowModal] = useState({
    ConfirmDelete: false,
    Add: false,
  });
  const [activePage, setActivePage] = useState("Main");
  const [SelectedDropDown, setSelectedDropDown] = useState(null);
  const handleShowModal = (Target) => {
    if (Target === "Confirm") {
      setShowModal({ ConfirmDelete: true, Add: false });
    }
    if (Target === "Add") {
      if (dropDowns.length >= 6) {
        CreateToast("sorry max dropdowns reached", "error");
        return;
      }

      setShowModal({ ConfirmDelete: false, Add: true });
    }
  };
  const handleInput = async (e) => {
    const { name, value } = e.target;
    setSelectedDropDown((prev) => {
      return { ...prev, [name]: value };
    });
  };
  const handleCloseModal = (Target) => {
    if (Target === "Confirm") {
      setShowModal({ ConfirmDelete: false, Add: false });
    }
    if (Target === "Add") {
      setShowModal({ ConfirmDelete: false, Add: false });
    }
  };
  const handlePrimaryAction = async (Target, id) => {
    if (Target === "Confirm") {
      DeleteDropDown(id);
      handleCloseModal(Target);
    }
    if (Target === "Add") {
      handleCloseModal(Target);
      if (dropDowns.length >= 6) {
        CreateToast("sorry max dropdowns reached", "error");
        return;
      }
      const nameExists = dropDowns.some((DropDown) => {
        return DropDown.Name === newDropDown.Name;
      });
      if (nameExists) {
        CreateToast("DropDown name is taken ", "error");
      } else if (newDropDown.Name === "") {
        CreateToast("DropDown name cant be empty", "error");
        return;
      } else {
        CreateToast("Creating DropDown", "info");
        await SETDOC("DropDown", newDropDown.id, { ...newDropDown }, true);
        setDropDowns(await GETCOLLECTION("DropDown"));
        CreateToast("DropDown Created", "success");
      }
      SetNewDropDown((prev) => {
        return { ...prev, Name: "" };
      });
    }
  };
  const objectToArray = (obj) => {
    return Object.keys(obj).map((key) => ({
      key,
      ...obj[key],
    }));
  };
  const moveToTop = (index) => {
    if (index === 0) {
      return; // If the item is already at the top, do nothing
    }

    const updatedItems = [...SelectedDropDown.Pages];
    const selectedItem = updatedItems.splice(index, 1)[0];
    updatedItems.splice(index - 1, 0, selectedItem);
    setSelectedDropDown((prev) => ({ ...prev, Pages: updatedItems }));
    setChangeInOrder(true);
  };
  const ChangeCate = async (id, newValue) => {
    if (DoingOperation) {
      CreateToast("Please wait..Changing pervious dropDown", "error", 1500);
      return;
    }
    setDoingOperation(true);
    CreateToast("Changing DropDown..", "info", 1500);
    const TempPagesData = await GETDOC("customization", "Sidepages");
    let PurePagesAr = objectToArray(TempPagesData);

    const TargetPage = PurePagesAr.find((Page) => Page.id == id);

    const updatedPages = {};
    for (const key in TempPagesData) {
      const element = TempPagesData[key];
      if (element.id == id) {
        updatedPages[key] = { ...TargetPage, DropDownFamily: newValue };
      } else {
        updatedPages[key] = element;
      }
    }
    let ArPages = [];
    for (const key in updatedPages) {
      if (Object.hasOwnProperty.call(updatedPages, key)) {
        const element = updatedPages[key];
        ArPages.push({
          Name: key,
          PageName: element.PageName,
          PageURL: element.PageURL,
          DropDownFamily: element.DropDownFamily,
          id: element.id,
          Type: element.PageType,
        });
      }
    }
    setPages(ArPages);
    const updatedDropDown = SelectedDropDown.Pages.filter(
      (Page) => Page !== id
    );
    const secondArray = await GETDOC("DropDown", newValue);
    secondArray.Pages.unshift(id);
    const updateSelectedDropDown = SETDOC("DropDown", SelectedDropDown.id, {
      ...SelectedDropDown,
      Pages: [...new Set(updatedDropDown)],
    });

    const updateNewValue = SETDOC("DropDown", newValue, { ...secondArray });

    const updateSidepages = SETDOC(
      "customization",
      "Sidepages",
      { ...updatedPages },
      false
    );

    await Promise.all([
      updateSelectedDropDown,
      updateNewValue,
      updateSidepages,
    ]);

    setSelectedDropDown({
      ...SelectedDropDown,
      Pages: [...new Set(updatedDropDown)],
    });

    CreateToast(
      `Changed ${TargetPage.PageName}'s DropDown Family`,
      "success",
      1000
    );
    setDoingOperation(false);
  };
  const ViewCate = (id) => {
    const targetDropDown = dropDowns.find((DropDown) => {
      return DropDown.id === id;
    });
    setSelectedDropDown(targetDropDown);
    setActivePage("ViewCate");
  };
  const DeleteDropDown = async (id) => {
    const targetDropDown = dropDowns.find((DropDown) => {
      return DropDown.id === id;
    });
    if (targetDropDown.Pages.length > 0) {
      CreateToast(
        "This DropDown has Pages in it, please empty the DropDown to be able to delete it",
        "error"
      );
      return;
    }
    CreateToast("Deleting...", "info", 2000);
    await DELETEDOC("DropDown", id);
    const NewList = await GETCOLLECTION("DropDown");
    setDropDowns(NewList);
    CreateToast("DropDown has been deleted", "success");
  };
  const UpdateDropDown = async () => {
    CreateToast("updating..", "info", 2000);
    await SETDOC(
      "DropDown",
      SelectedDropDown.id,
      { ...SelectedDropDown },
      false
    );
    CreateToast("updated", "success", 2000);
    setChangeInOrder(false);
  };
  const UpdateName = async () => {
    if (SelectedDropDown.Name === "") {
      CreateToast("DropDown name cant be empty", "error");
      return;
    }
    CreateToast("updating..", "info", 2000);
    await SETDOC(
      "DropDown",
      SelectedDropDown.id,
      { ...SelectedDropDown },
      false
    );
    CreateToast("updated", "success", 2000);
  };
  const ChangePage = async () => {
    setDropDowns(await GETCOLLECTION("DropDown"));
    setSelectedDropDown(null);
    setActivePage("Main");
  };
  useEffect(() => {
    const fetchData = async () => {
      const TempPagesData = await GETDOC("customization", "Sidepages");
      let PurePagesAr = [];
      let ArPages = [];
      for (const key in TempPagesData) {
        if (Object.hasOwnProperty.call(TempPagesData, key)) {
          const element = TempPagesData[key];
          PurePagesAr.push(element);
          ArPages.push({
            Name: key,
            PageName: element.PageName,
            PageURL: element.PageURL,
            DropDownFamily: element.DropDownFamily,
            id: element.id,
            Type: element.PageType,
          });
        }
      }
      setPages(ArPages);

      setDropDowns(await GETCOLLECTION("DropDown"));
    };
    fetchData();
  }, []);
  useEffect(() => {
    const GetID = async () => {
      let id;
      dropDowns.sort(sortBy("id"));
      dropDowns.forEach((DropDown) => {
        id = +DropDown.id + 1;
      });
      SetNewDropDown((prev) => {
        return { ...prev, id: String(id) };
      });
    };
    GetID();
  }, [dropDowns]);

  const columns = [
    {
      name: "Name",
      selector: (row) => row.Name,
      sortable: true,
      center: true,
    },

    {
      name: "#Tabs",
      selector: (row) => row.number,
      sortable: true,
      center: true,
    },
    {
      name: "Options",
      selector: (row) => row.Options,
      sortable: false,
      center: true,
    },
  ];
  const columnsSelected = [
    {
      name: "ID",
      selector: (row) => row.id,
      sortable: true,
      center: true,
      width: "100px",
    },
    {
      name: "Name",
      selector: (row) => row.Name,
      sortable: true,
      center: true,
    },
    {
      name: "URL",
      selector: (row) => row.URL,
      sortable: true,
      center: true,
    },
    {
      name: "Page Type",
      selector: (row) => <div>{row.Type}</div>,
      sortable: true,
      center: true,
    },
    {
      name: "dropdown Family",
      selector: (row) => row.DropDown,
      sortable: true,
      center: true,
      cell: (row) => (
        <div className="select-container ">
          <select
            className="styled-select"
            value={row.DropDown}
            onChange={(e) => {
              ChangeCate(row.id, e.target.value);
              row.dropDown = e.target.value;
            }}
          >
            {dropDowns.map((category) => {
              return (
                <option value={category.id} key={category.id}>
                  {category.Name}
                </option>
              );
            })}
          </select>
        </div>
      ),
    },
    {
      name: "Options",
      selector: (row) => row.Options,
      sortable: false,
      center: true,
    },
  ];
  const dataSelected = SelectedDropDown?.Pages?.map((Page, index) => {
    const TargetPage = Pages?.find((page) => {
      return page.id == Page;
    });
    return {
      id: Page,
      URL: TargetPage.PageURL ? TargetPage.PageURL : "HIDDEN PAGE",
      Name: TargetPage.PageURL ? TargetPage.PageName : "HIDDEN PAGE",
      Type: TargetPage.Type,
      DropDown: TargetPage.DropDownFamily,
      Options: (
        <>
          <button
            className="Button Edit"
            onClick={() => {
              setActivePageDash("Customization");
              SetCustomizationPage(Page);
            }}
          >
            Edit
          </button>
          <button
            className="Button Sort"
            onClick={() => {
              moveToTop(index);
            }}
          >
            <img src={sort} />
          </button>
        </>
      ),
    };
  });
  const data = dropDowns.map((DropDown) => {
    return {
      id: DropDown.id,
      Name: DropDown.Name,
      number: DropDown.Pages.length,
      Options: (
        <div className="Button-Wrapper">
          <button
            className="Button View"
            onClick={() => {
              ViewCate(DropDown.id);
            }}
          >
            View
          </button>
          {DropDown.id == 0 ? (
            ""
          ) : (
            <button
              className="Button Danger"
              onClick={() => {
                setTargetDropDown(DropDown);
                handleShowModal("Confirm");
              }}
            >
              Delete
            </button>
          )}
        </div>
      ),
    };
  });
  return (
    <div className="Users">
      {showModal.ConfirmDelete && (
        <MyModal
          className="Confirm"
          show={showModal.ConfirmDelete}
          handleClose={() => {
            handleCloseModal("Confirm");
          }}
          title="Delete DropDown"
          primaryButtonText={`Delete ${targetDropDown.Name}`}
          handlePrimaryAction={() => {
            handlePrimaryAction("Confirm", targetDropDown.id);
          }}
        >
          <>
            <p style={{ textAlign: "center" }}>
              are you sure you want to delete {targetDropDown.Name}? this action
              is <strong>Irreversible</strong>
            </p>
          </>
        </MyModal>
      )}
      {showModal.Add && (
        <MyModal
          className="Confirm"
          show={showModal.Add}
          handleClose={() => {
            handleCloseModal("Add");
          }}
          title="Add DropDown"
          primaryButtonText={`Add DropDown`}
          handlePrimaryAction={() => {
            handlePrimaryAction("Add");
          }}
        >
          <>
            <Input
              label="DropDown Name"
              type="text"
              id="Name"
              name="Name"
              value={newDropDown.Name}
              onChangeFunction={() => {
                SetNewDropDown((prev) => {
                  return { ...prev, Name: event.target.value };
                });
              }}
            />
          </>
        </MyModal>
      )}
      {activePage === "Main" && (
        <>
          <h1 className="animate__animated animate__backInDown ql-align-center">
            DropDowns
          </h1>
          <button
            className="Button"
            style={{ margin: "0px auto" }}
            onClick={() => {
              handleShowModal("Add");
            }}
          >
            Add DropDown
          </button>
          <DataTable
            className="animate__animated animate__fadeIn"
            style={{ animationDelay: ".4s" }}
            theme="light"
            highlightOnHover
            columns={columns}
            data={data}
          />
        </>
      )}
      {activePage === "ViewCate" && (
        <div className="DataEntry Hosting">
          <span className="Link Reverse" onClick={ChangePage}>
            Go Back
          </span>
          <h1 style={{ textAlign: "center" }}>{SelectedDropDown.Name}</h1>
          <Input
            startWithContent={true}
            customWidth="70%"
            label="DropDown Name"
            type="text"
            id="Name"
            name="Name"
            value={SelectedDropDown.Name}
            onChangeFunction={handleInput}
          />
          <button className="Button" onClick={UpdateName}>
            Save
          </button>
          <DataTable
            className="animate__animated animate__fadeIn"
            style={{ animationDelay: ".4s" }}
            theme="light"
            highlightOnHover
            columns={columnsSelected}
            data={dataSelected}
          />
          {changeInOrder && (
            <button className="Button View" onClick={UpdateDropDown}>
              Save Changes
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default DropDowns;
