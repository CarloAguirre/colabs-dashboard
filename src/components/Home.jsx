import { useEffect } from "react"
import { useOrdenes } from "../context"
import { UsersCountChart } from "./UsersCountChart"
import { UsersInfoChart } from "./UsersInfoChart"
import { OrdersRanking } from "./OrdersRanking"
import './tables/tables.css'
import { tokenValidatior } from "../helpers/tokenValidator"
import { DoubleChart } from "./DoubleChart"



export const Home = () => {
    useEffect(() => {
        tokenValidatior();
    }, [])
    
    const {orders, totalMoney, warningOrder, topUser, users, counter} = useOrdenes()
    
  return (
    <div className="main-container">
    <div className="main-title">
        <p className="font-weight-bold">DASHBOARD</p>
    </div>

    <div className="main-cards">

        <div className="card">
            <div className="card-inner">
                <p className="text-primary">ORDENES EN CURSO</p>
                <span className="material-icons-outlined text-blue">
                    inventory
                </span>
            </div>
            <span className="text-primary font-weight-bold">{counter}</span>
        </div>

        <div className="card">
            <div className="card-inner">
                <p className="text-primary">PROYECCIÓN DE INGRESOS</p>
                <span className="material-icons-outlined text-orange">
                attach_money
                </span>
            </div>
            <span className="text-primary font-weight-bold">${totalMoney.toLocaleString()}</span>
        </div>

        <div className="card">
            <div className="card-inner">
                <p className="text-primary">ORDEN TOP</p>
                <span className="material-icons-outlined text-green">
                how_to_reg
                </span>
            </div>
            <span className="text-primary font-weight-bold">#{topUser.nombre}</span>
        </div>

        <div className="card">
            <div className="card-inner">
                <p className="text-primary">ORDEN ATRASADA</p>
                <span className="material-icons-outlined text-red">
                    notifications
                </span>
            </div>
            <span className="text-primary font-weight-bold">#{warningOrder}</span>
        </div>

    </div>

    <div className="charts">

        <div className="charts-card">
            <p className="chart-title">Proyeccion vs Ventas</p>
            {/* <div className='users-charts'><OrdersRanking/></div> */}
            <div className='users-charts'><DoubleChart/></div>
        </div>
        <div className="charts-card">
            <p className="chart-title">Ultimas 10 ventas</p>
            <div className='users-charts'><UsersInfoChart /></div>
        </div>

        {/* <div className="charts-card">
            <p className="chart-title">Ordenes Facturadas</p>
            <div className='users-charts'><UsersCountChart orders={orders} users={users}/></div>
        </div> */}
    </div>

   

          
</div>
  )
}
