import React, { useState } from "react";

const CookiePopup = () => {
  const [showPopup, setShowPopup] = useState(true);

  const handleAccept = () => {
    setShowPopup(false);
    localStorage.setItem("Cookies", true);
    // You can add additional logic here to store the user's cookie preferences.
  };

  if (!showPopup) {
    return null;
  }

  return (
    <div className="cookie-popup animate__animated animate__fadeInUp">
      <p>
        By continuing to use the website, you agree to our Cookie Policy. To
        learn more about how we process your personal data, read our
        <a href="/Privacy" className="Link">
          Privacy Policy
        </a>
      </p>
      <button className="Button" onClick={handleAccept}>
        Okay
      </button>
    </div>
  );
};

export default CookiePopup;
