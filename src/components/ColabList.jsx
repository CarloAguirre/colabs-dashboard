import { useState } from 'react';

import { UsersCountChart } from './UsersCountChart';
import { UsersInfoChart } from './UsersInfoChart';
import { colaboradores } from '../config/colaboradores';

import '../App.css'


export const ColabList = () => {
    // input nuevo colaborado config
    const [users, setUsers] = useState(colaboradores);
  
    const [counter, setCounter] = useState(Number(users.length));

    const [inputValue, setInputValue] = useState("");

    
    const onInputChange = ({target})=>{
    const {name, value} = target;
    setInputValue({
        ...inputValue,
        [name]: value
    })
    };
    
    
    const onSubmitHandler = (event)=>{
        event.preventDefault();

        let idUser = Number(users[users.length-1].id) + 1;
        const {nombre, cantidad, correo} = inputValue

        setUsers([ ...users,      
            {
                id: idUser,
                nombre,
                cantidad,
                correo
            }])
            
        setCounter(counter + 1);    
    } 
    
    // buscador de colaborador config
    const fullList = document.getElementById("full-list");
    const filteredList = document.getElementById("filtered-list")
    const [searchedUser, setSearchedUser] = useState("");

    const [FilteredArray, setFilteredArray] = useState([]);

    const onSearchInput = ({target})=>{
        const {value} = target;
        setSearchedUser(value);
    }

    const onSearchSubmit = (event)=>{
        event.preventDefault();
        if(searchedUser != []){  
            const filterUser = users.filter(user => user.nombre.toLowerCase() === searchedUser.toLowerCase());
            if(filterUser[0]){
                fullList.style.display="none";
                filterUser.forEach(user =>{               
                    setFilteredArray([{
                        id: user.id,
                        nombre: user.nombre,
                        cantidad: user.cantidad,
                        correo: user.correo
                    }])
                })
                }else{
                    alert("No existe ningún usuario con ese nombre");
                }
        }else{               
            alert("Ingresa un nombre!");
        }
    }

    const onRefreshSubmit = (event)=>{
        event.preventDefault()
        fullList.style.display = ""
        filteredList.style.display = "none"

    }
        
    // stats configs
    let totalMoney = 0;
    let lastColab = 0;
    const [topUser, setTopUser] = useState({
        cantidad: 0,
        nombre: ""
    })

    const statsGenerator = ()=>{  
        users.forEach(user=>{
            let name = user.nombre
            let monto = Number(user.cantidad) 
            totalMoney += monto
            
            if(monto > topUser.cantidad){
                setTopUser({
                    cantidad: monto,
                    nombre: name
                })
            }
        })
        let lasUserColab = Number(users[users.length-1].cantidad)
        lastColab += lasUserColab
    }
    statsGenerator();

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
                    <input type="text" name='nombre' onChange={onInputChange} className="addColab-input"></input>
                    Monto
                    <input type="number" name='cantidad' onChange={onInputChange} className="addColab-input" ></input>
                    mail
                    <input type="email" name='correo' onChange={onInputChange} className="addColab-input"></input>
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

        <div className="main-container">
            <div className="main-title">
                <p className="font-weight-bold">DASHBOARD</p>
            </div>

            <div className="main-cards">

                <div className="card">
                    <div className="card-inner">
                        <p className="text-primary">COLABORADORES</p>
                        <span className="material-icons-outlined text-blue">
                            inventory
                        </span>
                    </div>
                    <span className="text-primary font-weight-bold">{counter}</span>
                </div>

                <div className="card">
                    <div className="card-inner">
                        <p className="text-primary">TOTAL COLABORACIONES</p>
                        <span className="material-icons-outlined text-orange">
                        attach_money
                        </span>
                    </div>
                    <span className="text-primary font-weight-bold">${totalMoney.toLocaleString()}</span>
                </div>

                <div className="card">
                    <div className="card-inner">
                        <p className="text-primary">COLABORADOR TOP</p>
                        <span className="material-icons-outlined text-green">
                        how_to_reg
                        </span>
                    </div>
                    <span className="text-primary font-weight-bold">{topUser.nombre}</span>
                </div>

                <div className="card">
                    <div className="card-inner">
                        <p className="text-primary">ÚLTIMA COLABORACIÓN</p>
                        <span className="material-icons-outlined text-red">
                            notifications
                        </span>
                    </div>
                    <span className="text-primary font-weight-bold">${lastColab.toLocaleString()}</span>
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
                    <input type="text" name='buscarNombre' onChange={onSearchInput}></input>
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
                        <th scope="col">Colaboración</th>
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
};
