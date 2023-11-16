import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { CreateToast } from "../../../App";
import {
  GETCOLLECTION,
  SETDOC,
  GETDOC,
  decrypt,
  NEWUSER,
} from "../../../server";
import MyModal from "../../PopUps/Confirm/Confirm";
const Users = () => {
  const [ActiveUser, setActiveUser] = useState(
    decrypt(JSON.parse(sessionStorage.getItem("activeUser")).id)
  );
  const [userList, setUserList] = useState([]);
  const [targetUser, setTargetUser] = useState(null);
  const [showModal, setShowModal] = useState({
    deleteUser: false,
    addUser: false,
  });
  const [newUser, setNewUser] = React.useState({
    Active: false,
    Lname: "",
    Fname: "",
    Role: "User",
    dateOfBirth: "",
    email: "",
    deleteUser: false,
    gender: "",
    joinedAt: getCurrentDateFormatted(),
    Username: "",
    Password: "",
    phone: "",
  });
  function getCurrentDateFormatted() {
    const currentDate = new Date();
    const day = String(currentDate.getDate()).padStart(2, "0");
    const month = String(currentDate.getMonth() + 1).padStart(2, "0"); // January is 0!
    const year = String(currentDate.getFullYear()).slice(-2);
    return `${day}/${month}/${year}`;
  }
  const handleShowDeleteModal = () =>
    setShowModal((prev) => ({ addUser: false, deleteUser: true }));
  const handleShowAddModal = () =>
    setShowModal((prev) => ({ deleteUser: false, addUser: true }));
  const handleCloseDeleteModal = () =>
    setShowModal((prev) => ({ ...prev, deleteUser: false }));
  const handleCloseAddModal = () =>
    setShowModal((prev) => ({ ...prev, addUser: false }));
  const handlePrimaryDeleteAction = (id, username) => {
    DeleteUser(id, username);
    handleCloseDeleteModal();
  };
  const handlePrimaryAddAction = () => {
    Signup();
  };
  const fetchData = async () => {
    setActiveUser(await GETDOC("users", ActiveUser));
    const UserList = await GETCOLLECTION("users");
    setUserList(UserList.filter((user) => user.deleteUser === false));
  };
  useEffect(() => {
    fetchData();
  }, []);
  const DeleteUser = async (id) => {
    const targetUser = await GETDOC("users", id);
    await SETDOC("users", id, { ...targetUser, deleteUser: true });
    const UserList = await GETCOLLECTION("users");
    setUserList(UserList.filter((user) => user.deleteUser === false));
    CreateToast("user has been deleted", "success");
  };

  const ChangeRole = async (id, newValue) => {
    CreateToast("Changing role..", "info");
    const targetUser = userList.find((user) => {
      return user.id == id;
    });

    await SETDOC("users", id, { ...targetUser, Role: newValue });
    const UserList = await GETCOLLECTION("users");
    setUserList(UserList.filter((user) => user.deleteUser === false));
    CreateToast(
      `Changed ${targetUser.Fname} ${targetUser.Lname} to ${newValue}!`,
      "success"
    );
  };
  const Signup = async () => {
    if (
      ![newUser.Fname, newUser.Lname, newUser.Password, newUser.email].every(
        Boolean
      )
    ) {
      CreateToast("Please fill out all the fields", "error");
      return;
    }
    CreateToast("creating account...", "info");
    const Users = await GETCOLLECTION("users");
    try {
      const CheckUsername = Users.find((user) => {
        return user.Username === newUser.Username;
      });

      if (CheckUsername) {
        CreateToast("username is taken.", "error");

        return;
      }
      const authUser = await NEWUSER(newUser.email, newUser.Password);
      await SETDOC(
        "users",
        authUser.uid,
        { ...newUser, id: authUser.uid, Password: "" },
        true
      );
      CreateToast("Successfully signed up! You can now login.", "success");
      await fetchData();
      handleCloseAddModal();
    } catch (error) {
      if (error.message.includes("auth/user-not-found")) {
        CreateToast("no such user", "error");
      } else if (error.message.includes("invalid-email")) {
        CreateToast("invalid Email", "error");
      } else if (error.message.includes("missing-password")) {
        CreateToast("Password cant be empty", "error");
      } else if (error.message.includes("auth/wrong-password")) {
        CreateToast(
          "Wrong Password if you forgot it, try resetting it",
          "error"
        );
      } else {
        CreateToast(error.message, "error");
      }
    }
  };
  const columns = [
    {
      name: "UserName",
      selector: (row) => row.UserName,
      sortable: true,
      center: true,
    },
    {
      name: "First Name",
      selector: (row) => row.FirstName,
      sortable: true,
      center: true,
    },
    {
      name: "Last Name",
      selector: (row) => row.LastName,
      sortable: true,
      center: true,
    },
    {
      name: "Joined At",
      selector: (row) => row.joinedAt,
      sortable: true,
      center: true,
    },
    {
      name: "Email",
      selector: (row) => row.Email,
      sortable: true,
      center: true,
      width: "220px",
    },

    {
      name: "Role",
      selector: (row) => row.selectedRole,
      sortable: true,
      center: true,
      cell: (row) =>
        ActiveUser.Role === "Owner" ? (
          row.selectedRole === "Owner" ? (
            "Owner"
          ) : (
            <div className="select-container">
              <select
                className="styled-select"
                value={row.selectedRole}
                onChange={(e) => {
                  ChangeRole(row.id, e.target.value);
                  row.selectedRole = e.target.value;
                }}
              >
                <option>Admin</option>
                <option>User</option>
                <option>Author</option>
              </select>
            </div>
          )
        ) : (
          row.selectedRole
        ),
    },
    {
      name: "Active",
      selector: (row) => row.loggedIn,
      sortable: true,
      center: true,
    },
    {
      name: "Options",
      selector: (row) => row.options,
      center: true,
      width: "250px",
    },
  ];
  const data = userList.map((User) => {
    return {
      id: User.id,
      UserName: User.Username,
      FirstName: User.Fname,
      LastName: User.Lname,
      joinedAt: User.joinedAt,
      Email: User.email,
      loggedIn: User.Active ? "Yes" : "No",
      selectedRole: User.Role,

      options: (
        <div className="Button-Wrapper">
          <button
            className="Button Details"
            onClick={() => {
              window.location.href = `/Dashboard/User/${User.id}`;
            }}
          >
            Details
          </button>
          {User.id === ActiveUser.id ||
          User.Role === "Owner" ||
          (User.Role === "Admin" && ActiveUser.Role == "Admin") ? (
            ""
          ) : (
            <button
              className="Button Danger"
              onClick={() => {
                setTargetUser(User);
                handleShowDeleteModal();
              }}
            >
              Delete
            </button>
          )}
        </div>
      ),
    };
  });
  const UpdateInput = (event) => {
    const { name, value } = event.target;
    setNewUser((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };
  return (
    <div className="Users">
      {showModal.deleteUser && (
        <MyModal
          className="Confirm"
          show={handleShowDeleteModal}
          handleClose={handleCloseDeleteModal}
          title="Delete Account"
          primaryButtonText={`Delete ${targetUser.Username}`}
          handlePrimaryAction={() => {
            handlePrimaryDeleteAction(targetUser.id, targetUser.Username);
          }}
        >
          <>
            <p style={{ textAlign: "center" }}>
              are you sure you want to delete {targetUser.Username}? this action
              can not be undone
            </p>
          </>
        </MyModal>
      )}
      {showModal.addUser && (
        <MyModal
          className="Confirm"
          show={handleShowAddModal}
          handleClose={handleCloseAddModal}
          title="Create a User"
          primaryButtonText="Add User"
          handlePrimaryAction={() => {
            handlePrimaryAddAction();
          }}
        >
          <form className="SignupForm" style={{ width: "100%" }}>
            <div className="formItem ">
              <label htmlFor="email">Email:</label>
              <input
                required
                type="email"
                id="email"
                name="email"
                value={newUser.email}
                onChange={UpdateInput}
              ></input>
            </div>
            <div className="formItem ">
              <label htmlFor="username">Username:</label>
              <input
                required
                type="text"
                id="username"
                name="Username"
                value={newUser.Username}
                onChange={UpdateInput}
              ></input>
            </div>
            <div className="NameWrapper">
              <div className="formItem">
                <label htmlFor="Fname">FirstName:</label>
                <input
                  required
                  type="text"
                  id="Fname"
                  name="Fname"
                  value={newUser.Fname}
                  onChange={UpdateInput}
                ></input>
              </div>
              <div className="formItem">
                <label htmlFor="Lname">LastName:</label>
                <input
                  required
                  type="text"
                  id="Lname"
                  name="Lname"
                  value={newUser.Lname}
                  onChange={UpdateInput}
                ></input>
              </div>
            </div>
            <div className="formItem ">
              <label htmlFor="Password">Password:</label>
              <input
                required
                type="password"
                id="Password"
                name="Password"
                value={newUser.Password}
                onChange={UpdateInput}
              ></input>
            </div>
          </form>
        </MyModal>
      )}
      <h1 className="animate__animated animate__backInDown ql-align-center">
        Users
      </h1>
      <button className="Button View" onClick={handleShowAddModal}>
        Add User
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
    </div>
  );
};

export default Users;
