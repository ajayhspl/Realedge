import React, { useEffect, useRef, useState } from "react";
import {
  GETCOLLECTION,
  SETDOC,
  DELETEDOC,
  EMPTYFOLDER,
  Distributor,
  GETDOC,
} from "../../../server";
import DataTable from "react-data-table-component";
import "./Articles.css";
import MyModal from "../../PopUps/Confirm/Confirm";
import { CreateToast } from "../../../App";
import sortBy from "sort-by";

const Articles = () => {
  const [isFirstRender, setIsFirstRender] = useState(true);
  const [Articles, setArticles] = useState([]);
  const [users, setUsers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [targetArticle, setTargetArticle] = useState(null);
  const [FeaturedArticles, setFeaturedArticles] = useState([]);
  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);
  const handlePrimaryAction = (id) => {
    DeleteArticle(id);
    handleCloseModal();
  };
  useEffect(() => {
    const getArticles = async () => {
      setArticles(await GETCOLLECTION("Articles"));
      setUsers(await GETCOLLECTION("users"));
      setCategories(await GETCOLLECTION("categories"));
      await GETDOC("Blog", "BlogPageCustomization").then((res) => {
        setFeaturedArticles(res.Featured);
      });
    };
    getArticles();
  }, []);
  const DeleteArticle = async (id) => {
    EMPTYFOLDER(`/Blog/${id}`);
    DELETEDOC("Articles", id);
    setArticles(await GETCOLLECTION("Articles"));
    CreateToast("Article has been deleted", "success");
  };
  useEffect(() => {
    Distributor(Articles, categories);
  }, [Articles]);
  const ChangeCate = async (id, newValue) => {
    CreateToast("Changing category..", "info");
    const targetArticle = Articles.find((Article) => {
      return Article.id == id;
    });
    await SETDOC("Articles", id, { ...targetArticle, category: newValue });
    setArticles(await GETCOLLECTION("Articles"));
    CreateToast(
      `Changed ${targetArticle.Title}'s category to ${newValue}!`,
      "success"
    );
  };
  const ChangeStatutes = async (Article) => {
    let updatedAR;

    const ArticleFound = FeaturedArticles.find((FeatArticle) => {
      return FeatArticle.Blogid == Article.id;
    });
    if (ArticleFound) {
      updatedAR = FeaturedArticles.filter((FeatArticle) => {
        return FeatArticle.Blogid != Article.id;
      });
    } else {
      let id;
      if (FeaturedArticles.length === 0) {
        id = 1;
      } else {
        FeaturedArticles.sort(sortBy("id"));
        FeaturedArticles.forEach((category) => {
          id = +category.id + 1;
        });
      }
      updatedAR = [
        { Blogid: String(Article.id), id: String(id) },
        ...FeaturedArticles,
      ];
    }
    setFeaturedArticles(updatedAR);
    CreateToast("...updating", "info", 2000);
    let tempData = await GETDOC("Blog", "BlogPageCustomization");
    tempData = { ...tempData, Featured: updatedAR };
    await SETDOC("Blog", "BlogPageCustomization", tempData, false);
    CreateToast("updated!", "success", 2000);
  };
  const columns = [
    {
      name: "Title",
      selector: (row) => row.Title,
      sortable: true,
      center: true,
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
      name: "Made by",
      selector: (row) => row.MakerName,
      sortable: true,
      center: true,
    },
    {
      name: "Under name of",
      selector: (row) => row.AuthorName,
      sortable: true,
      center: true,
    },
    {
      name: "Author status",
      selector: (row) => row.AuthorStatus,
      sortable: true,
      center: true,
      width: "125px",
    },
    {
      name: "Featured",
      selector: (row) => row.Featured,
      sortable: true,
      center: true,
      minWidth: "20px",
    },
    {
      name: "Category",
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
      name: "Options",
      selector: (row) => row.Options,
      sortable: false,
      center: true,
      width: "170px",
    },
  ];
  const data = Articles?.map((Article) => {
    const AuthorActive = users.find((user) => {
      return user.id == Article.Author.id;
    });
    const IsFeatured = FeaturedArticles.find((FeatArticle) => {
      return FeatArticle.Blogid == Article.id;
    });
    return {
      id: Article.id,
      Title: Article.Title,
      category: Article.category,
      DateAdded: Article.DateAdded,
      ReadTime: Article.ReadTime + "m",
      LikeCount: Article.liked.length,
      ReplyCount: Article.replies.length,
      MakerName: (
        <a href={`/Dashboard/User/${Article.OriginallyMadeBy.id}`}>
          {Article.OriginallyMadeBy.Fname} {Article.OriginallyMadeBy.Lname}
        </a>
      ),
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
      Featured: (
        <button
          className="Button"
          onClick={() => {
            ChangeStatutes(Article);
          }}
        >
          {IsFeatured ? "YES" : "NO"}
        </button>
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
          <button
            className="Button Delete"
            onClick={() => {
              setTargetArticle(Article);
              handleShowModal();
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
      {showModal && (
        <MyModal
          className="Confirm"
          show={showModal}
          handleClose={handleCloseModal}
          title="Delete Article"
          primaryButtonText={`Delete this Article`}
          handlePrimaryAction={() => {
            handlePrimaryAction(targetArticle.id);
          }}
        >
          <>
            <p style={{ textAlign: "center" }}>
              are you sure you want to delete {targetArticle.Title}? this action
              can not be undone
            </p>
          </>
        </MyModal>
      )}
      <h1 className="animate__animated animate__backInDown ql-align-center">
        Articles
      </h1>
      <DataTable
        className="Articles animate__animated animate__fadeIn"
        style={{ animationDelay: ".4s" }}
        theme="light"
        pagination
        highlightOnHover
        columns={columns}
        data={data}
      />
    </div>
  );
};

export default Articles;
