import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import "./ContactPopup.css";
import Phone from "../../../assets/phone.png";
import Email from "../../../assets/mail.png";
import { GETCOLLECTION } from "../../../server";
function ContactPopUp(props) {
  const [email, setEmail] = useState("");
  const [webName, setWebName] = useState("");
  const [Data, setData] = useState({ Phone: "", Email: "", Description: "" });
  useEffect(() => {
    const FetchEmail = async () => {
      const res = await GETCOLLECTION("customization");
      setEmail(res[2].Email);
      setWebName(res[2].WebsiteName);
      setData({
        Email: res[0].FooterData.Email,
        Phone: res[0].FooterData.Phone,
        Description: res[2].ModalDescription,
      });
    };
    FetchEmail();
  }, []);
  const [width, setWidth] = useState(window.innerWidth);
  function handleWindowSizeChange() {
    setWidth(window.innerWidth);
  }
  useEffect(() => {
    window.addEventListener("resize", handleWindowSizeChange);
    return () => {
      window.removeEventListener("resize", handleWindowSizeChange);
    };
  }, []);

  const [formType, setFormType] = useState("");
  const FormTypes = {
    Contact: {
      title: "Contact Us",
      ExtraProperties: {},
    },
    Price: {
      title: `Select our ${props.Name} plan`,
      ExtraProperties: {},
    },
    ProjectDiscuss: {
      title: "Discuss Your Project with us",
      ExtraProperties: { ProjectType: true },
    },
    JobOffering: {
      title: `Apply For ${props.JobTitle}`,
      ExtraProperties: {
        Experience: true,
        qualification: true,
        CurrentEmployer: true,
        CurrentCTCPerMonth: true,
        ExpectedCTCPerMonth: true,
        NoticePeriod: true,
        JobTitle: true,
      },
    },
  };

  useEffect(() => {
    switch (props.type) {
      case "Contact":
        setFormType(FormTypes.Contact);
        break;
      case "Project":
        setFormType(FormTypes.ProjectDiscuss);
        break;
      case "Price":
        setFormType(FormTypes.Price);
        break;
      case "Job":
        setFormType(FormTypes.JobOffering);
        break;
      default:
        break;
    }
  }, []);

  return (
    <Modal
      className={props.className}
      show={props.show}
      onHide={props.handleClose}
    >
      <Modal.Header closeButton></Modal.Header>
      <Modal.Body>
        <>
          <div className={`Form-wrapper ${width < 1000 ? "small" : ""}`}>
            <h2>{formType?.title}</h2>
            <form
              className="ContactForm"
              action={`https://formsubmit.co/${email}`}
              method="POST"
            >
              <input
                type="hidden"
                name="_subject"
                value={`form submission from ${webName}`}
              />
              <input type="hidden" name="_template" value="box" />

              <input
                id="Fname"
                required
                type="text"
                name="Fname"
                placeholder="First Name"
              />
              <input
                required
                type="text"
                name="Lname"
                placeholder="Last Name"
                id="Lname"
              />
              <input
                required
                type="email"
                name="email"
                placeholder="Email"
                id="Email"
              />
              <input
                required
                type="number"
                name="number"
                placeholder="Contact Number"
                id="number"
              />
              {formType.ExtraProperties?.ProjectType && (
                <input
                  required
                  type="text"
                  name="Project Type"
                  placeholder="Project Type"
                  id="ProjectType"
                />
              )}
              {formType.ExtraProperties?.JobTitle && (
                <input
                  required
                  type="text"
                  name="Job Title"
                  placeholder="Job Title"
                  id="Job Title"
                />
              )}
              {formType.ExtraProperties?.Experience && (
                <input
                  required
                  type="text"
                  name="Experience"
                  placeholder="Experience"
                  id="Experience"
                />
              )}
              {formType.ExtraProperties?.qualification && (
                <input
                  required
                  type="text"
                  name="qualification"
                  placeholder="qualification"
                  id="qualification"
                />
              )}
              {formType.ExtraProperties?.NoticePeriod && (
                <input
                  required
                  type="text"
                  name="NoticePeriod"
                  placeholder="NoticePeriod"
                  id="NoticePeriod"
                />
              )}
              {formType.ExtraProperties?.CurrentEmployer && (
                <input
                  required
                  type="text"
                  name="Current Employer"
                  placeholder="Current Employer"
                  id="CurrentEmployer"
                />
              )}
              {formType.ExtraProperties?.ExpectedCTCPerMonth && (
                <input
                  required
                  type="text"
                  name="Expected CTC Per Month"
                  placeholder="Expected CTC Per Month"
                  id="ExpectedCTCPerMonth"
                />
              )}
              {formType.ExtraProperties?.CurrentCTCPerMonth && (
                <input
                  required
                  type="text"
                  name="Current CTC Per Month"
                  placeholder="Current CTC Per Month"
                  id="CurrentCTCPerMonth"
                />
              )}
              <input
                required
                type="text"
                name="subject"
                placeholder="Subject"
                id="Subject"
              />
              <textarea
                required
                type="text"
                name="message"
                placeholder="Message"
                id="Message"
              />
              <button>Send</button>
            </form>
          </div>
          {width > 1000 ? (
            <div className="SidePanel">
              <div className="section">
                <h2>{Data.Description}</h2>
              </div>
              <div className="section">
                <h5>Contact Us</h5>
                <div className="ContactInfo">
                  <a href={`tel:${Data.Phone}`}>
                    <img src={Phone} /> {Data.Phone}
                  </a>
                  <a href={`mailto:${Data.Email}`}>
                    <img src={Email} /> {Data.Email}
                  </a>
                </div>
              </div>
            </div>
          ) : (
            ""
          )}
        </>
      </Modal.Body>
    </Modal>
  );
}

export default ContactPopUp;
/*
  import MyModal from "../components/Modal";

  const [showModal, setShowModal] = React.useState(false);
  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);
  const handlePrimaryAction =  () => {};
  
                <button onClick={handleShowModal}>delete Account</button>
                <MyModal
                  show={showModal}
                  handleClose={handleCloseModal}
                  //title="MODAL TITLE"
                 // primaryButtonText="MODAL TEXT"
                  handlePrimaryAction={handlePrimaryAction}
                >
                  <>
                    //MODAL CONTENT
                  </>
                </MyModal>
                 */
