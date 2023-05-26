

import {  NavLink } from "react-router-dom";
import '../App.css'


export const SideBar = () => {
  return (
    <aside id="sidebar">


            <div className="sidebar-title">
                <div className="sidebar-brand">
                    <span className="material-icons-outlined">
                        inventory
                    </span> AGI Controls
                </div>
                <span className="material-icons-outlined">
                    close
                </span>
            </div>

            <ul className="sidebar-list">           
                <NavLink  to="/dashboard" className={({isActive})=>(isActive ? "sidebar-list-item selected-label" : "sidebar-list-item")} > 
                    <span className="material-icons-outlined">
                        dashboard
                    </span> Panel
                </NavLink>
                
                <NavLink  to="/orders" className={({isActive})=>(isActive ? "sidebar-list-item selected-label" : "sidebar-list-item")} >
                        <span className="material-icons-outlined">
                            inventory_2
                        </span> Ordenes

                    </NavLink>
                    <NavLink  to="/paids" className={({isActive})=>(isActive ? "sidebar-list-item selected-label" : "sidebar-list-item")} >

                        <span className="material-icons-outlined">
                            fact_check
                        </span> Facturadas
                    </NavLink>
               
                <li className="sidebar-list-item">
                    <span className="material-icons-outlined">
                    attach_money
                    </span> Total Fondos
                </li>
                <li className="sidebar-list-item">
                    <span className="material-icons-outlined">
                    account_balance
                    </span> Bienes y activos
                </li>
                <li className="sidebar-list-item">
                    <span className="material-icons-outlined">
                        bar_chart
                    </span> Reportes
                </li>
                <li className="sidebar-list-item">
                    <span className="material-icons-outlined">
                        settings
                    </span> Ajustes
                </li>
            </ul>
        </aside>
  )

}
