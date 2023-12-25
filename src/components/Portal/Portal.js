/* eslint-disable no-undef */
import React, { useEffect, useState } from "react";
import "react-toastify/dist/ReactToastify.css";
import { CreateToast } from "../../App";
import {
  GETDOC,
  NEWUSER,
  SETDOC,
  LOGIN,
  DELETECURRENTUSER,
  DELETEDOC,
  RESETPASSWORD,
  GETCOLLECTION,
  encrypt,
  decrypt,
} from "../../server";
import "./Portal.css";
import MyModal from "../PopUps/Confirm/Confirm";
import Dashboard from "../Dashboard/Dashboard";
import Loading from "../Loading/Loading";
import Input from "../Input/Input";
import ReCAPTCHA from "react-google-recaptcha";

export default function Portal() {
  const [greeting, setGreeting] = useState("hello");
  const [user, setUser] = React.useState(
    JSON.parse(sessionStorage.getItem("activeUser")) || ""
  );
  const [isLoading, setIsLoading] = React.useState(true);
  const [IsAdmin, setIsAdmin] = React.useState(false);
  const [showSignup, setShowSignUp] = React.useState(false);
  const [email, setEmail] = React.useState("");
  const [recaptchaValue, setRecaptchaValue] = useState(null);
  const [disableRecaptcha, setDisableRecaptcha] = useState(null);
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
  const recaptchaRef = React.createRef();
  useEffect(() => {
    const getData = async () => {
      const disableRecaptcha = await GETDOC("customization", "Website");
      setDisableRecaptcha(disableRecaptcha.disableRecaptcha);
    };
    getData();
  }, []);
  const [showModal, setShowModal] = React.useState(false);
  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);
  const handlePrimaryAction = async () => {
    handleCloseModal();
    try {
      RESETPASSWORD(email);
      CreateToast("email has been sent", "success");
    } catch (error) {
      CreateToast(error, "error");
    }
    setEmail("");
  };
  const [loginData, setLoginData] = React.useState({
    email: "",
    Password: "",
  });
  const changeForm = () => {
    setShowSignUp((prev) => !prev);
    setLoginData({
      email: "",
      Password: "",
    });
    setNewUser((prev) => {
      return { ...prev, email: "", Password: "", Username: "" };
    });
  };

  const UpdateInput = (form, event) => {
    if (form === "login") {
      const { name, value } = event.target;
      setLoginData((prev) => {
        return {
          ...prev,
          [name]: value,
        };
      });
    }
    if (form === "newUser") {
      const { name, value } = event.target;
      setNewUser((prev) => {
        return {
          ...prev,
          [name]: value,
        };
      });
    }
  };
  function getCurrentDateFormatted() {
    const currentDate = new Date();
    const day = String(currentDate.getDate()).padStart(2, "0");
    const month = String(currentDate.getMonth() + 1).padStart(2, "0"); // January is 0!
    const year = String(currentDate.getFullYear()).slice(-2);
    return `${day}/${month}/${year}`;
  }
  const greetings = ["hello", "Bonjour", "Hola", "Ciao", "Namaste"];

  const Signup = async (e) => {
    if (
      ![newUser.Fname, newUser.Lname, newUser.Password, newUser.email].every(
        Boolean
      )
    ) {
      CreateToast("Please fill out all the fields", "error");
      return;
    }
    CreateToast("creating account...", "info");
    e.preventDefault();
    const Users = await GETCOLLECTION("users");

    try {
      const CheckUsername = Users.find((user) => {
        return user.Username === newUser.Username;
      });

      if (CheckUsername) {
        CreateToast("username is taken.", "error");

        return;
      }
      await NEWUSER(newUser.email, newUser.Password);
      const authUser = await LOGIN(newUser.email, newUser.Password);
      await SETDOC(
        "users",
        authUser.uid,
        { ...newUser, id: authUser.uid, Password: "", Active: true },
        true
      );
      sessionStorage.setItem(
        "activeUser",
        JSON.stringify({ id: encrypt(authUser.uid) })
      );
      if (newUser.Role === "Owner" || newUser.Role === "Admin") {
        window.location.href = "/Dashboard";
      } else {
        window.location.reload();
      }

      CreateToast("Successfully signed up! logging in...", "success");
      setShowSignUp(false);
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
  const signIn = async (e) => {
    e.preventDefault();
    if (!recaptchaValue && !disableRecaptcha) {
      alert("Please complete the reCAPTCHA challenge");
      return;
    }

    CreateToast("logging in", "info");

    try {
      const authUser = await LOGIN(loginData.email, loginData.Password);
      const DBuser = await GETDOC("users", authUser.uid);
      if (DBuser.deleteUser) {
        await DELETEDOC("users", authUser.uid),
          await DELETECURRENTUSER(),
          CreateToast("sorry your account have been deleted", "info");
        return;
      } else {
        await SETDOC("users", authUser.uid, { ...DBuser, Active: true });
        sessionStorage.setItem(
          "activeUser",
          JSON.stringify({ id: encrypt(DBuser.id) })
        );
        if (DBuser.Role === "Owner" || DBuser.Role === "Admin") {
          window.location.href = "/Dashboard";
        } else {
          window.location.reload();
        }
      }
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

  const logOut = async () => {
    let cleanData = [];
    await GETCOLLECTION("users").then((response) => {
      cleanData = response;
    });
    cleanData.forEach(async (User) => {
      if (User.id === user.id) {
        User.Active = false;
      }
      await SETDOC("users", User.id, { ...User });
      sessionStorage.clear();
      window.location.href = "/";
    });
  };
  useEffect(() => {
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * greetings.length);
      setGreeting(greetings[randomIndex]);
    }, 5000);
  }, [greeting]);
  const CheckInfo = (res) => {
    const vals = Object.keys(res).map(function (key) {
      return res[key];
    });
    for (let index = 0; index < vals.length; index++) {
      if (typeof vals[index] !== "boolean") {
        if (typeof vals[index] !== "object")
          if (vals[index] !== 0) {
            if (!vals[index]) {
              CreateToast(
                `your Profile is incomplete! go to ${
                  res.Role === "Admin" || res.Role === "Owner"
                    ? "Admin Profile"
                    : "settings"
                } to complete it`,
                "warning"
              );
              return;
            }
          }
      }
    }
  };
  useEffect(() => {
    const checkData = async () => {
      let fetchedData = {};
      GETDOC("users", decrypt(user.id)).then((res) => {
        fetchedData = res;
        fetchedData.Role === "Admin" || fetchedData.Role === "Owner"
          ? setIsAdmin(true)
          : setIsAdmin(false);
        setUser(fetchedData);
        if (fetchedData.Role === "Author" || fetchedData.Role === "User") {
          CheckInfo(fetchedData);
        }
      });
    };
    if (user) {
      checkData();
      setIsLoading(false);
    } else {
      setIsLoading(false);
    }
  }, []);
  function onChange(value) {
    setRecaptchaValue(value);
  }
  return (
    <>
      {user ? (
        isLoading ? (
          ""
        ) : IsAdmin ? (
          <Dashboard />
        ) : (
          user && (
            <div className="NotFound">
              <h1
                className="animate_animated animate__backOutDown"
                style={{ marginBottom: "100px" }}
              >
                {greeting}
              </h1>
              <p>You Are Now Logged in</p>
              <div className="Button-wrapper">
                <button
                  onClick={() => {
                    window.location.href = "/blogMain";
                  }}
                >
                  Visit Our Blog
                </button>
                <button
                  onClick={() => {
                    window.location.href = "/settings";
                  }}
                >
                  Edit Account Settings
                </button>
                {user.Role === "Author" ? (
                  <>
                    <button
                      onClick={() => {
                        window.location.href = "/ArticleBuilder";
                      }}
                    >
                      Upload an article
                    </button>
                  </>
                ) : (
                  ""
                )}
                <button onClick={logOut}>Log Out</button>
              </div>
            </div>
          )
        )
      ) : (
        <div className="Portal ">
          <h3
            className="animate__animated animate__fadeInDown"
            style={{ animationDelay: ".5s" }}
          >
            {!showSignup ? "Welcome Back" : "Register"}
          </h3>
          {showSignup ? (
            <form className="animate__animated animate__fadeInDown SignupForm">
              <Input
                label="Email"
                type="email"
                required={true}
                id="email"
                name="email"
                value={newUser.email}
                onChangeFunction={() => {
                  UpdateInput("newUser", event);
                }}
              />

              <Input
                label="Username"
                type="text"
                required={true}
                id="username"
                name="Username"
                value={newUser.Username}
                onChangeFunction={() => {
                  UpdateInput("newUser", event);
                }}
              />

              <div className="NameWrapper">
                <Input
                  label="FirstName"
                  type="text"
                  required={true}
                  id="Fname"
                  name="Fname"
                  value={newUser.Fname}
                  onChangeFunction={() => {
                    UpdateInput("newUser", event);
                  }}
                />
                <Input
                  label="LastName"
                  type="text"
                  required={true}
                  id="Lname"
                  name="Lname"
                  value={newUser.Lname}
                  onChangeFunction={() => {
                    UpdateInput("newUser", event);
                  }}
                />
              </div>
              <Input
                label="Password"
                type="password"
                required={true}
                id="Password"
                name="Password"
                value={newUser.Password}
                onChangeFunction={() => {
                  UpdateInput("newUser", event);
                }}
              />

              <input
                type="submit"
                className="Button"
                value="sign up"
                onClick={Signup}
              ></input>
            </form>
          ) : (
            <form className="animate__animated animate__fadeInDown">
              <Input
                label="Email"
                type="email"
                required={true}
                id="email"
                name="email"
                value={loginData.email}
                onChangeFunction={() => {
                  UpdateInput("login", event);
                }}
              />
              <Input
                label="Password"
                type="password"
                required={true}
                id="Password"
                name="Password"
                value={loginData.Password}
                onChangeFunction={() => {
                  UpdateInput("login", event);
                }}
              />
              {!disableRecaptcha && (
                <ReCAPTCHA
                  ref={recaptchaRef}
                  sitekey={process.env.REACT_APP_RECAPTCHA_KEY}
                  onChange={onChange}
                />
              )}
              <input
                type="submit"
                value="login"
                className="Button"
                onClick={signIn}
              ></input>
            </form>
          )}
          <p
            className="animate__animated animate__fadeInUp"
            style={{
              textAlign: "center",
              animationDelay: "1s",
              marginTop: "15px",
            }}
          >
            {!showSignup ? "not a user?" : "already have an account?"}{" "}
            <span style={{ cursor: "pointer" }} onClick={changeForm}>
              {!showSignup ? "sign up now" : "sign in now!"}
            </span>
          </p>
          <button
            style={{
              border: "none",
              animationDelay: "1.1s",
              opacity: ".7",
              backgroundColor: "white",
              fontSize: ".8rem",
            }}
            className="animate__animated animate__fadeInUp"
            onClick={handleShowModal}
          >
            Forgot Password?
          </button>
          <MyModal
            className="Confirm"
            show={showModal}
            handleClose={handleCloseModal}
            title="Reset password"
            primaryButtonText="send email"
            handlePrimaryAction={handlePrimaryAction}
          >
            <>
              <p>
                please put your email and if its a valid email we will send a
                reset password link to it
              </p>
              <Input
                required
                type="email"
                name="email"
                label="Email:"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
              />
            </>
          </MyModal>
        </div>
      )}
      <Loading loading={isLoading} />
    </>
  );
}
