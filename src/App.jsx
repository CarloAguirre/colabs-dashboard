
import { useState } from 'react';

import { UsersInfoChart } from './components/UsersInfoChart';


import './App.css';
import { UsersCountChart } from './components/UsersCountChart';

function App() {


  const [users, setUsers] = useState([
    {
        id: "1",
        nombre: "Colaborador 1",
        correo: "colaborador1@colaborador1.com"
        },
        {
        id: "2",
        nombre: "Colaborador 2",
        correo: "colaborador2@colaborador2.com"
        },
        {
        id: "3",
        nombre: "Colaborador 3",
        correo: "colaborador3@colaborador3.com"
    },
  ])

  const [inpuValue, setInpuValue] = useState("")

  
  const onInputChange = ({target})=>{
    const newTarea = target.value
    setInpuValue(newTarea)
  }
  
  
  const onSubmitHandler = (event)=>{
    event.preventDefault()
    let idTarea = new Date().getTime();

    setUsers([...users,      
        {
            id: idTarea,
            nombre: inpuValue,
            correo: "colaborador3@colaborador3.com"
        }])

    }

  

      

  return (
    <>



    <div className="grid-container">
        <header className="header">
            <div
            className="menu-icon" onClick="openSidebar()">
                <span className="material-icons-outlined">
                    menu
                </span>
            </div>
            <div className="header-left"> 
            <h5>Nuevo Colaborador</h5>            
                <form onSubmit={onSubmitHandler}>
                    <input type="text" name='Name' onChange={onInputChange}></input>
                    <button type='submit'><span className="material-icons-outlined">
                    add_circle
                </span></button>
                </form>
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

        <aside id="sidebar">
            <div className="sidebar-title">
                <div className="sidebar-brand">
                    <span className="material-icons-outlined">
                        inventory
                    </span> Carlo's Inventory
                </div>
                <span className="material-icons-outlined" onClick="closeSidebar()">
                    close
                </span>
            </div>

            <ul className="sidebar-list">
                <li className="sidebar-list-item selected-label">
                    <span className="material-icons-outlined">
                        dashboard
                    </span> Dashboard
                </li>
                <a href="products.html" className="anchor-link">
                    <li className="sidebar-list-item">
                        <span className="material-icons-outlined">
                            inventory_2
                        </span> Products
                    </li>
                </a>
                <a href="inventory.html" className="anchor-link">
                    <li className="sidebar-list-item">
                        <span className="material-icons-outlined">
                            fact_check
                        </span> Inventory
                    </li>
                </a>
                <li className="sidebar-list-item">
                    <span className="material-icons-outlined">
                        add_shopping_cart
                    </span> Purchase Orders
                </li>
                <li className="sidebar-list-item">
                    <span className="material-icons-outlined">
                        shopping_cart
                    </span> Sales Orders
                </li>
                <li className="sidebar-list-item">
                    <span className="material-icons-outlined">
                        bar_chart
                    </span> Reports
                </li>
                <li className="sidebar-list-item">
                    <span className="material-icons-outlined">
                        settings
                    </span> Settings
                </li>
            </ul>
        </aside>

        <main className="main-container">
            <div className="main-title">
                <p className="font-weight-bold">DASHBOARD</p>
            </div>

            <div className="main-cards">

                <div className="card">
                    <div className="card-inner">
                        <p className="text-primary">PRODUCTS</p>
                        <span className="material-icons-outlined text-blue">
                            inventory
                        </span>
                    </div>
                    <span className="text-primary font-weight-bold">249</span>
                </div>

                <div className="card">
                    <div className="card-inner">
                        <p className="text-primary">PURCHASE ORDERS</p>
                        <span className="material-icons-outlined text-orange">
                            add_shopping_cart
                        </span>
                    </div>
                    <span className="text-primary font-weight-bold">81</span>
                </div>

                <div className="card">
                    <div className="card-inner">
                        <p className="text-primary">SALES ORDERS</p>
                        <span className="material-icons-outlined text-green">
                            shopping_cart
                        </span>
                    </div>
                    <span className="text-primary font-weight-bold">47</span>
                </div>

                <div className="card">
                    <div className="card-inner">
                        <p className="text-primary">INVETORY ALERTS</p>
                        <span className="material-icons-outlined text-red">
                            notifications
                        </span>
                    </div>
                    <span className="text-primary font-weight-bold">28</span>
                </div>

            </div>

            <div className="charts">

                <div className="charts-card">
                    <p className="chart-title">Top 5 Colaboradores</p>
                    <div className='users-charts'><UsersInfoChart /></div>
                </div>

                <div className="charts-card">
                    <p className="chart-title">Total Colaboradores</p>
                    <div className='users-charts'><UsersCountChart /></div>
                </div>

            </div>
{/* 
            <ol>
                {
                    users.map(tarea=>{
                    return <li key={tarea}>{tarea}</li>
                    })
                }
            </ol> */}


            <div>

            <table class="table">
                    <thead>
                      <tr>
                        <th scope="col"># ID</th>
                        <th scope="col">Name</th>
                        <th scope="col">Colaboracion</th>
                        <th scope="col">Mail</th>                      
                      </tr>
                    </thead>
                    <tbody>
                        {
                            users.map(user=>{  
                            return <tr>
                                    <th scope="row">{user.id}</th>
                                    <td>{user.nombre}</td>
                                    <td>$890.000</td>
                                    <td>{user.correo}</td>
                                </tr>      
                            })
                        }
                    </tbody>
                  </table>

            </div>
            
        </main>

    </div>


    </>


  );
}

export default App;
