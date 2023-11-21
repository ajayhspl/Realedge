import React from "react";
import { Modal } from "react-bootstrap";
import "./ProjectPopup.css";
import Carousel from "../../carosuel";
function ProjectPopup(props) {
  return (
    <Modal
      className={props.className}
      show={props.show}
      onHide={props.handleClose}
    >
      <Modal.Header closeButton></Modal.Header>
      <Modal.Body>
        <div className="ProjectPopupWrapper">
          {props.Data.ExtraImages.length > 0 && (
            <Carousel id="one" images={props.Data.ExtraImages} />
          )}
          <div className="ProjectData">
            {props.Data.Title && <h3>{props.Data.Title}</h3>}
            {props.Data.Description && <p>{props.Data.Description}</p>}
            {props.Data.Category && <p>Category: {props.Data.Category}</p>}
            {props.Data.Country && <p>Country: {props.Data.Country}</p>}
            {props.Data.CompanyName && <p>Company:{props.Data.CompanyName}</p>}
            {props.Data.Website && (
              <p>
                Website:
                <a
                  href={`//${props.Data.Website}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  {props.Data.CompanyName}
                </a>
              </p>
            )}
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
}

export default ProjectPopup;
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
