import React from 'react';
import './tooltip.css';

export const Tooltip = ({icon, infoPopupRef, name, mail, logoutHandler, setShowInfoPopup,showInfoPopup}) => {
    const onCloseTooltip = ()=>{
        setShowInfoPopup(!showInfoPopup)
    }
  return (
    
    <>
    {
        (icon === 'user')&&
        <div
            ref={infoPopupRef}
            className="info-popup"
        >
            <div className="tooltip-arrow"></div>
            <div className='d-flex justify-content-between'>
                <p>
                <strong>Usuario:</strong> {name}
                </p>
                <span class="material-icons-outlined mt-2" onClick={onCloseTooltip} style={{ cursor: "pointer", zoom: '80%'}}>
                    cancel
                </span>
            </div>
            <p>
            <strong>Mail:</strong> {mail}
            </p>
            <p
            style={{ cursor: "pointer" }}
            onClick={logoutHandler}
            >
            <span className="material-icons-outlined">
                    logout
                </span> Cerrar sesión
            </p>
        </div>
    }
    {
          (icon === 'mail')&&
          <div
              ref={infoPopupRef}
              className="info-popup"
          >
              <div className="tooltip-arrow"></div>
              <div className='d-flex justify-content-between'>
                <p>
                <strong>Usuario:</strong> {name}
                </p>
                <span class="material-icons-outlined mt-2" onClick={onCloseTooltip} style={{ cursor: "pointer", zoom: '80%'}}>
                    cancel
                </span>
            </div>
              <p>
              <strong>Mail:</strong> {mail}
              </p>
              <p
              style={{ cursor: "pointer" }}
              onClick={logoutHandler}
              >
              <span className="material-icons-outlined">
                      logout
                  </span> Cerrar sesión
              </p>
          </div>
        
    }
    {
          (icon === 'notification')&&
          <div
              ref={infoPopupRef}
              className="info-popup"
          >
              <div className="tooltip-arrow"></div>
              <div className='d-flex justify-content-between'>
                <p>
                <strong>Usuario:</strong> {name}
                </p>
                <span class="material-icons-outlined mt-2" onClick={onCloseTooltip} style={{ cursor: "pointer", zoom: '80%'}}>
                    cancel
                </span>
            </div>
              <p>
              <strong>Mail:</strong> {mail}
              </p>
              <p
              style={{ cursor: "pointer" }}
              onClick={logoutHandler}
              >
              <span className="material-icons-outlined">
                      logout
                  </span> Cerrar sesión
              </p>
          </div>
        
    }
        
    </>
  )
}
