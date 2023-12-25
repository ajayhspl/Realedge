/* eslint-disable no-debugger */
import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { CreateToast } from "../../../App";
import { GETCOLLECTION, DELETEDOC, SETDOC, Distributor } from "../../../server";
import MyModal from "../../PopUps/Confirm/Confirm";
import sortBy from "sort-by";
import Input from "../../Input/Input";
const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [targetCategory, setTargetCategory] = useState(null);
  const [newCategory, SetNewCategory] = useState({
    Name: "",
    id: "",
    Articles: [],
  });
  const [showModal, setShowModal] = useState({
    ConfirmDelete: false,
    Add: false,
  });
  const [activePage, setActivePage] = useState("Main");
  const [users, setUsers] = useState(null);
  const [SelectedCate, setSelectedCate] = useState(null);
  const handleShowModal = (Target) => {
    if (Target === "Confirm") {
      setShowModal({ ConfirmDelete: true, Add: false });
    }
    if (Target === "Add") {
      setShowModal({ ConfirmDelete: false, Add: true });
    }
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
      DeleteCategory(id);
      handleCloseModal(Target);
    }
    if (Target === "Add") {
      handleCloseModal(Target);
      const nameExists = categories.some((category) => {
        return category.Name === newCategory.Name;
      });
      if (nameExists) {
        CreateToast("Category name is taken ", "error");
      } else {
        CreateToast("Creating Category", "info");
        await SETDOC("categories", newCategory.id, { ...newCategory }, true);
        setCategories(await GETCOLLECTION("categories"));
        CreateToast("Category Created", "success");
      }
      SetNewCategory((prev) => {
        return { ...prev, Name: "" };
      });
    }
  };
  const ChangeCate = async (id, newValue) => {
    CreateToast("Changing category..", "info");
    const targetArticle = SelectedCate.Articles.find((Article) => {
      return Article.id == id;
    });
    await SETDOC("Articles", id, { ...targetArticle, category: newValue });
    const tempArticles = await GETCOLLECTION("Articles");
    CreateToast(
      `Changed ${targetArticle.Title}'s category to ${newValue}!`,
      "success"
    );
    await Distributor(tempArticles, categories);
    setCategories(await GETCOLLECTION("categories"));
  };
  const ViewCate = (id) => {
    const targetCate = categories.find((category) => {
      return category.id === id;
    });
    setSelectedCate(targetCate);
    setActivePage("ViewCate");
  };
  const DeleteCategory = async (id) => {
    const targetCate = categories.find((category) => {
      return category.id === id;
    });
    if (targetCate.Articles.length > 0) {
      CreateToast(
        "This category has articles in it, please empty the category to be able to delete it",
        "error"
      );
      return;
    }
    CreateToast("Deleting...", "info", 2000);
    await DELETEDOC("categories", id);
    const NewList = await GETCOLLECTION("categories");
    setCategories(NewList);
    CreateToast("Category has been deleted", "success");
  };
  useEffect(() => {
    const fetchData = async () => {
      setUsers(await GETCOLLECTION("users"));
      setCategories(await GETCOLLECTION("categories"));
    };
    fetchData();
  }, []);
  useEffect(() => {
    const GetID = async () => {
      let id;
      if (categories.length === 0) {
        id = 1;
      } else {
        categories.sort(sortBy("id"));
        categories.forEach((category) => {
          id = +category.id + 1;
        });
      }
      SetNewCategory((prev) => {
        return { ...prev, id: String(id) };
      });
    };
    GetID();
  }, [categories]);
  const ChangePage = async () => {
    setCategories(await GETCOLLECTION("categories"));
    setSelectedCate(null);
    setActivePage("Main");
  };
  const columns = [
    {
      name: "Name",
      selector: (row) => row.Name,
      sortable: true,
      center: true,
    },
    {
      name: "#Articles",
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
      name: "Title",
      selector: (row) => row.Title,
      sortable: true,
      center: true,
    },
    {
      name: "category",
      selector: (row) => row.category,
      sortable: true,
      center: true,
      cell: (row) => (
        <div className="select-container ">
          <select
            className="styled-select"
            value={row.category}
            onChange={(e) => {
              ChangeCate(row.id, e.target.value);
              row.category = e.target.value;
            }}
          >
            {categories.map((category) => {
              return (
                <option value={category.Name} key={category.id}>
                  {category.Name}
                </option>
              );
            })}
          </select>
        </div>
      ),
    },
    {
      name: "Date",
      selector: (row) => row.DateAdded,
      sortable: true,
      center: true,
      minWidth: "150px",
    },
    {
      name: "Read Time",
      selector: (row) => row.ReadTime,
      sortable: true,
      center: true,
    },
    {
      name: "Likes",
      selector: (row) => row.LikeCount,
      sortable: true,
      center: true,
      width: "80px",
    },
    {
      name: "Replies",
      selector: (row) => row.ReplyCount,
      sortable: true,
      center: true,
      width: "90px",
    },
    {
      name: "Author",
      selector: (row) => row.AuthorName,
      sortable: true,
      center: true,
    },
    {
      name: "Author Status",
      selector: (row) => row.AuthorStatus,
      sortable: true,
      center: true,
      width: "125px",
    },
    {
      name: "Options",
      selector: (row) => row.Options,
      sortable: false,
      center: true,
      width: "230px",
    },
  ];
  const dataSelected = SelectedCate?.Articles?.map((Article) => {
    const AuthorActive = users.find((user) => {
      return user.id == Article.Author.id;
    });

    return {
      id: Article.id,
      Title: Article.Title,
      category: Article.category,
      DateAdded: Article.DateAdded,
      ReadTime: Article.ReadTime + "m",
      LikeCount: Article.liked.length,
      ReplyCount: Article.replies.length,
      AuthorStatus: AuthorActive
        ? AuthorActive.deleteUser
          ? "Deleted"
          : "Active"
        : "Deleted",
      AuthorName: (
        <a href={`/Dashboard/User/${Article.Author.id}`}>
          {Article.Author.Fname} {Article.Author.Lname}
        </a>
      ),
      Options: (
        <div className="Button-Wrapper">
          <button
            className="Button View"
            onClick={() => {
              window.location.href = `/BlogMain/Article/${Article.id}`;
            }}
          >
            View
          </button>
        </div>
      ),
    };
  });
  const data = categories.map((Category) => {
    return {
      id: Category.id,
      Name: Category.Name,
      number: Category.Articles.length,
      Options: (
        <div className="Button-Wrapper">
          <button
            className="Button View"
            onClick={() => {
              ViewCate(Category.id);
            }}
          >
            View
          </button>
          <button
            className="Button Danger"
            onClick={() => {
              setTargetCategory(Category);
              handleShowModal("Confirm");
            }}
          >
            Delete
          </button>
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
          title="Delete Category"
          primaryButtonText={`Delete ${targetCategory.Name}`}
          handlePrimaryAction={() => {
            handlePrimaryAction("Confirm", targetCategory.id);
          }}
        >
          <>
            <p style={{ textAlign: "center" }}>
              are you sure you want to delete {targetCategory.Name}? this action
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
          title="Add Category"
          primaryButtonText={`Add Category`}
          handlePrimaryAction={() => {
            handlePrimaryAction("Add");
          }}
        >
          <>
            <Input
              label="Category Name"
              type="text"
              required={true}
              id="Name"
              name="Name"
              value={newCategory.Name}
              onChangeFunction={(e) => {
                SetNewCategory((prev) => {
                  return { ...prev, Name: e.target.value };
                });
              }}
            />
          </>
        </MyModal>
      )}
      {activePage === "Main" && (
        <>
          <h1 className="animate__animated animate__backInDown ql-align-center">
            Categories
          </h1>
          <button
            className="Button"
            style={{ margin: "0px auto" }}
            onClick={() => {
              handleShowModal("Add");
            }}
          >
            Add Category
          </button>
          <DataTable
            className="animate__animated animate__fadeIn"
            style={{ animationDelay: ".4s" }}
            theme="light"
            pagination
            highlightOnHover
            columns={columns}
            data={data}
          />
        </>
      )}
      {activePage === "ViewCate" && (
        <>
          <span className="Link Reverse" onClick={ChangePage}>
            Go Back
          </span>

          <h1 style={{ textAlign: "center" }}>{SelectedCate.Name}</h1>
          <DataTable
            className="animate__animated animate__fadeIn"
            style={{ animationDelay: ".4s" }}
            theme="light"
            pagination
            highlightOnHover
            columns={columnsSelected}
            data={dataSelected}
          />
        </>
      )}
    </div>
  );
};

export default Categories;
