import { useOrdenes } from "../context"
import { ModalPdfDrop } from "./modal/Modal"


export const Header = () => {
    const {onSubmitHandler, onInputChange} = useOrdenes()
  return (
    <header className="header">
            <div
            className="menu-icon">
                <span className="material-icons-outlined">
                    menu
                </span>
            </div>
            <div className="header-left">     
            <ModalPdfDrop />     
                {/* <form onSubmit={onSubmitHandler}>
                    <input type="text" name='nombre' onChange={onInputChange} className="addColab-input" placeholder='Nombre'></input>  
                    <input type="number" name='cantidad' onChange={onInputChange} className="addColab-input" placeholder='Monto' ></input>
                    <input type="email" name='correo' onChange={onInputChange} className="addColab-input" placeholder='mail'></input>
                    <button type='submit'><span className="material-icons-outlined">                           
                    add  
                    </span></button>
                </form> */}
            </div>

            <div className="header-right">
                <span className="material-icons-outlined">
                    notifications
                </span>
                <span className="material-icons-outlined">
                    mail
                </span>
                <span className="material-icons-outlined">
                    account_circle
                </span>                   
            </div>
        </header>
  )
}
