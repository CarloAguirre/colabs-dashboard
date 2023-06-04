import { useEffect } from "react"
import { useOrdenes } from "../context"
import { UsersCountChart } from "./UsersCountChart"
import { UsersInfoChart } from "./UsersInfoChart"
import { OrdersRanking } from "./OrdersRanking"
import './tables/tables.css'
import { tokenValidatior } from "../helpers/tokenValidator"
import { DoubleChart } from "./DoubleChart"
import { DoubleChartMonthly } from "./DoubleChartMonthly"



export const Home = () => {
    useEffect(() => {
        tokenValidatior();
    }, [])
    
    const {totalDebt, totalMoney, warningOrder, topUser, counter, totalAtrasos} = useOrdenes()
    
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
                <span className="material-icons-outlined text-green">
                attach_money
                </span>
            </div>
            <span className="text-primary font-weight-bold">${totalMoney.toLocaleString()}</span>
        </div>

        <div className="card">
            <div className="card-inner">
                <p className="text-primary">Total atrasos</p>
                <span className="material-icons-outlined text-orange">
                error
                </span>
            </div>
            <span className="text-primary font-weight-bold">{totalAtrasos}</span>
        </div>

        <div className="card">
            <div className="card-inner">
                <p className="text-primary">MONTO ATRASOS</p>
                <span className="material-icons-outlined text-red">
                    notifications
                </span>
            </div>
            <span className="text-primary font-weight-bold">${totalDebt.toLocaleString()}</span>
        </div>

    </div>

    <div className="charts">

        <div className="charts-card">
            <p className="chart-title">Última Actividad</p>
            <div className='users-charts'><DoubleChart/></div>
        </div>
        <div className="charts-card">
            <p className="chart-title">Visión General</p>
            {/* <div className='users-charts'><UsersInfoChart /></div> */}
            {/* <div className='users-charts'><OrdersRanking/></div> */}
            <div className='users-charts'><DoubleChartMonthly /></div>
        </div>

        {/* <div className="charts-card">
            <p className="chart-title">Ordenes Facturadas</p>
            <div className='users-charts'><UsersCountChart orders={orders} users={users}/></div>
        </div> */}
    </div>

   

          
</div>
  )
}
