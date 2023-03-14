import { useState } from 'react';
import '../App.css'
import { UsersCountChart } from './UsersCountChart';
import { UsersInfoChart } from './UsersInfoChart';


export const ColabList = () => {
  
    const [users, setUsers] = useState([
        {
            id: "1",
            nombre: "Colaborador 1",
            cantidad: "1000000",
            correo: "colaborador1@colaborador1.com"
            },
            {
            id: "2",
            nombre: "Colaborador 2",
            cantidad: "2000000",
            correo: "colaborador2@colaborador2.com"
            },
            {
            id: "3",
            nombre: "Colaborador 3",
            cantidad: "3000000",
            correo: "colaborador3@colaborador3.com"
        },
      ])
    
      const [counter, setCounter] = useState(Number(users.length))
    
      const [inputValue, setInputValue] = useState("")
    
      
      const onInputChange = ({target})=>{
        const {name, value} = target
        setInputValue({
            ...inputValue,
            [name]: value
        })
      }
      
      
      const onSubmitHandler = (event)=>{
        event.preventDefault() 
    
        let idUser = Number(users[users.length-1].id) + 1;
        const {nombre, cantidad, correo} = inputValue
    
        setUsers([...users,      
            {
                id: idUser,
                nombre,
                cantidad,
                correo
            }])
         
        setCounter(counter + 1)    
        } 
        

        const [searchedUser, setSearchedUser] = useState("")

        const [FilteredArray, setFilteredArray] = useState([])

        const onSearchChange = ({target})=>{
            const {value} = target
            setSearchedUser(value)
        }

        const fullList = document.getElementById("full-list")
        const filteredList = document.getElementById("filtered-list")

        const onSearchSubmit = (event)=>{
            event.preventDefault();
            const filterUser = users.find(user => user.nombre.toLowerCase() === searchedUser.toLowerCase());

            if(filterUser){  
                fullList.style.display = "none"
                filteredList.style.display = ""
                
                setFilteredArray([{
                    id: filterUser.id,
                    nombre: filterUser.nombre,
                    cantidad: filterUser.cantidad,
                    correo: filterUser.correo
                }])
            }else{               
                alert("No existe ningún colaborador con ese nombre")
            }
        }

        const onRefreshSubmit = (event)=>{
            event.preventDefault()
            fullList.style.display = ""
            filteredList.style.display = "none"

        }
    
      return (
        <>
    
    
    
        <div className="grid-container">
            <header className="header">
                <div
                className="menu-icon">
                    <span className="material-icons-outlined">
                        menu
                    </span>
                </div>
                <div className="header-left">          
                    <form onSubmit={onSubmitHandler}>
                        Nombre
                        <input type="text" name='nombre' onChange={onInputChange}></input>
                        Monto
                        <input type="number" name='cantidad' onChange={onInputChange} className="ms-3"></input>
                        mail
                        <input type="email" name='correo' onChange={onInputChange} className="ms-3"></input>
                        <button type='submit'><span className="material-icons-outlined">                           
                        add
                        
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
                            </span> Products
                        </li>
                    </a>
                    <a className="anchor-link">
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
    
            <div className="main-container">
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
                        <p className="chart-title">Colaboraciones</p>
                        <div className='users-charts'><UsersInfoChart users={users} counter={counter} /></div>
                    </div>
    
                    <div className="charts-card">
                        <p className="chart-title">Total Colaboradores</p>
                        <div className='users-charts'><UsersCountChart counter={counter} users={users}/></div>
                    </div>
                </div>

                <div className='search-reset_inputs'>
                    <form action="" onSubmit={onSearchSubmit}>       
                        Buscar
                        <input type="text" name='buscarNombre' onChange={onSearchChange} className="ms-3"></input>
                        <button type='submit'><span className="material-icons-outlined">                           
                            search   
                        </span></button>
                    </form>
                        <form action="" onSubmit={onRefreshSubmit}>
                            <button type='submit'><span className="material-icons-outlined">                           
                                refresh  
                            </span></button>
                        </form>
                </div>

                <div>
                <table className="table">
                        <thead>
                          <tr>
                            <th scope="col"># ID</th>
                            <th scope="col">Name</th>
                            <th scope="col">Colaboracion</th>
                            <th scope="col">Mail</th>                      
                          </tr>
                        </thead>
                        <tbody id='full-list'>
             
                            {
                                users.map(user=>{  
                                let monto = Number(user.cantidad)
                                return <tr key={user.id}>
                                        <th scope="row">{user.id}</th>
                                        <td>{user.nombre}</td>
                                        <td>${monto.toLocaleString()}</td>
                                        <td>{user.correo}</td>
                                    </tr>    
                                })
                            }
                            
                        </tbody>
                        <tbody id='filtered-list'>
                            {
                                    FilteredArray.map(user=>{  
                                    let monto = Number(user.cantidad)
                                    return <tr key={user.id}>
                                            <th scope="row">{user.id}</th>
                                            <td>{user.nombre}</td>
                                            <td>${monto.toLocaleString()}</td>
                                            <td>{user.correo}</td>
                                        </tr>   
                                    })
                                }
                        </tbody>
                      </table>
    
                </div>
                
            </div>
        </div>
    
    
        </>
  )
}
