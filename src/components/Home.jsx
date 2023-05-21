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
    
    const {counter, totalMoney, lastColab, topUser, users} = useOrdenes()
    
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

   

          
</div>
  )
}
