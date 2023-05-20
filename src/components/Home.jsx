import { useEffect } from "react"
import { useOrdenes } from "../context"
import { UsersCountChart } from "./UsersCountChart"
import { UsersInfoChart } from "./UsersInfoChart"
import Cookies from 'universal-cookie'


export const Home = () => {
    useEffect(() => {
        const cookies = new Cookies();
        const token = cookies.get("token")
        if(!token){
            alert('No tienes acceso al dashboard de administracion, inicia sesión')
            window.location.href = "./"
        }

    }, [])
    
    const {counter, totalMoney, lastColab, topUser, users, searchedUser, onSearchInput, onRefreshSubmit, onSearchSubmit, FilteredArray  } = useOrdenes()
    
  return (
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
            <div className='users-charts'><UsersInfoChart  users={users} counter={counter} /></div>
        </div>

        <div className="charts-card">
            <p className="chart-title">Total Colaboradores</p>
            <div className='users-charts'><UsersCountChart counter={counter} users={users}/></div>
        </div>
    </div>

    <div className='search-reset_inputs'>
        <form action="" onSubmit={onSearchSubmit}>  
            <input type="text" name='buscarNombre' onChange={onSearchInput} placeholder='Buscar' value={searchedUser}></input>
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
  )
}
