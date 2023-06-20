import { useOrdenes } from "../context"
import { ModalPdfDrop } from "./modal/Modal"


export const Header = () => {
  return (
    <header className="header">
            <div
            className="menu-icon">
                <span className="material-icons-outlined">
                    menu
                </span>
            </div>
            <div className="header-left">     
            <ModalPdfDrop cliente = "codelco"/>   
            <ModalPdfDrop cliente = "bhp"/>     
            </div>

            <div className="header-right">
            <ModalPdfDrop cliente = "licitacion"/>   
            <ModalPdfDrop cliente = "invoice"/>     
                {/* <span className="material-icons-outlined">
                    notifications
                </span>
                <span className="material-icons-outlined">
                    mail
                </span>
                <span className="material-icons-outlined">
                    account_circle
                </span>                    */}
            </div>
        </header>
  )
}
