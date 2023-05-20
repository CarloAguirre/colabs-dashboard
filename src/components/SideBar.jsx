import React from 'react'
import '../App.css'

export const SideBar = () => {
  return (
    <aside id="sidebar">
            <div className="sidebar-title">
                <div className="sidebar-brand">
                    <span className="material-icons-outlined">
                        inventory
                    </span> Carlo's Colabs
                </div>
                <span className="material-icons-outlined">
                    close
                </span>
            </div>

            <ul className="sidebar-list">
                <li className="sidebar-list-item selected-label">
                    <span className="material-icons-outlined">
                        dashboard
                    </span> Dashboard
                </li>
                <a className="anchor-link">
                    <li className="sidebar-list-item">
                        <span className="material-icons-outlined">
                            inventory_2
                        </span> Inversiones
                    </li>
                </a>
                <a className="anchor-link">
                    <li className="sidebar-list-item">
                        <span className="material-icons-outlined">
                            fact_check
                        </span> Colaboradores
                    </li>
                </a>
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
