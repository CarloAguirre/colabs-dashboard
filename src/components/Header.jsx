import React, { useState, useEffect, useRef } from "react";

import { ModalPdfDrop } from "./modal/Modal";
import Cookies from "universal-cookie";
import { logoutHandler } from "../helpers/logoutHandlerToken";
import { Tooltip } from "./tooltip/Tooltip";

export const Header = () => {
  const cookies = new Cookies();
  const mail = cookies.get("email");
  const name = cookies.get("name");

  const [showInfoPopup, setShowInfoPopup] = useState(false);
  const infoPopupRef = useRef(null);

  const [currentIcon, setCurrentIcon] = useState("");

  const handleAccountIconClick = (icon) => {
    setCurrentIcon(icon);
    setShowInfoPopup(!showInfoPopup);
  };

  const handleDocumentClick = (event) => {
    if (
      infoPopupRef.current &&
      !infoPopupRef.current.contains(event.target) &&
      !event.target.classList.contains("account-icon")
    ) {
      setShowInfoPopup(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleDocumentClick);
    return () => {
      document.removeEventListener("click", handleDocumentClick);
    };
  }, []);

  return (
    <>
      {mail !== "carlo_aguirre@hotmail.com" ? (
        <header className="header">
            <div
            className="menu-icon">
                <span className="material-icons-outlined">
                    menu
                </span>
            </div>
            <div>
                <ModalPdfDrop cliente = "licitacion"/>   
            </div>
            <div className="header-left">     
                <ModalPdfDrop cliente = "codelco"/>   
                <ModalPdfDrop cliente = "bhp"/>     
            </div>

            <div className="header-right">
                <ModalPdfDrop cliente = "invoice"/>     
            </div>
        </header>
      ) : (
        <>
          <header className="header-user">
            <div className="d-flex justify-content-end">
            <span
                    className="material-icons-outlined account-icon"
                    onClick={() => handleAccountIconClick("notification")}
                    style={{ cursor: "pointer" }}
                    title="Notification"
                >
                    notifications
              </span>
              <span
                className="material-icons-outlined account-icon"
                onClick={() => handleAccountIconClick("mail")}
                style={{ cursor: "pointer" }}
                title="Mail"
              >
                mail
              </span>
              <span
                className="material-icons-outlined account-icon"
                id="account-icon"
                onClick={() => handleAccountIconClick("user")}
                style={{ cursor: "pointer" }}
                title="Settings"
              >
                account_circle
              </span>

            </div>
            {showInfoPopup && (
                <Tooltip
                  icon={currentIcon}
                  infoPopupRef={infoPopupRef}
                  name={name}
                  mail={mail}
                  logoutHandler={logoutHandler}
                  setShowInfoPopup={setShowInfoPopup}
                  showInfoPopup={showInfoPopup}
                />
            )}
          </header>
        </>
      )}
    </>
  );
};
