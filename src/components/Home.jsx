import Form from 'react-bootstrap/Form';
import { useEffect } from "react"
import { useOrdenes } from "../context"
import { tokenValidatior } from "../helpers/tokenValidator"
import { DoubleChart } from "./DoubleChart"
import { DoubleChartMonthly } from "./DoubleChartMonthly"
import { useNavigate } from "react-router-dom"

import './tables/tables.css'
import { Tester } from "./Tester"
import { YearSelector } from './YearSelector';



export const Home = () => {
    useEffect(() => {
        tokenValidatior();
    }, [])
    
    const {totalDebt, totalMoney, totalNoCompletadas, paidOrdersLastYear, totalAtrasos, setInputValue, totalLicitationsMoney, totalLicitations, totalCompletadas, completadasSuma} = useOrdenes()

    const navigate = useNavigate()
    const onAtrasosHandler = ()=>{
        setInputValue("atrasos")
        navigate('/orders')
    }

    const onMontoAtrasosHandler = ()=>{   
        setInputValue("atrasos")
        navigate('/reports')
    }
    const onProyeccionHandler = ()=>{   
        setInputValue("")
        navigate('/orders')
    }
    const onFacturadoHandler = ()=>{   
        setInputValue("")
        navigate('/paids')
    }
    const onLicitationHandler = ()=>{   
        setInputValue("")
        navigate('/licitations')
    }
   
  return (
    <div className="main-container">
    <div className="main-title" style={{justifyContent:'space-between'}}>
        <p className="font-weight-bold">DASHBOARD</p>
    </div>

    <div className="main-cards">

       
    <div className="card" onClick={()=> onLicitationHandler()}>
            <div className="card-inner">
                <p className="text-primary">TOTAL LICITACIONES</p>
                <span className="material-icons-outlined text-orange">
                info
                </span>
            </div>
            <p className="text-primary font-weight-bold"># {totalLicitations}</p>
            <span className="text-primary font-weight-bold">${totalLicitationsMoney.toLocaleString()}</span>
        </div>

        <div className="card" onClick={()=> onProyeccionHandler()}>
            <div className="card-inner">
                <p className="text-primary">ORDENES EN CURSO</p>
                <span className="material-icons-outlined text-blue">
                insights
                </span>
            </div>
            <p className="text-primary font-weight-bold"># {totalNoCompletadas} </p>
            <span className="text-primary font-weight-bold">${totalMoney.toLocaleString()}</span>
        </div>

        {/* <div className="card" onClick={()=> onFacturadoHandler()}> */}
        <div className="card">
            <div className="card-inner" onClick={()=> onFacturadoHandler()}>
                <p className="text-primary">FACTURADO</p>
                <span className="material-icons-outlined text-green">
                    attach_money
                </span>
            </div>
            <p className="text-primary font-weight-bold" onClick={()=> onFacturadoHandler()}># {completadasSuma}</p>
            <div className='d-flex align-items-center'>
                <span className="text-primary font-weight-bold me-2" onClick={()=> onFacturadoHandler()}>${paidOrdersLastYear.toLocaleString()}</span>
              <YearSelector />
            </div>
        </div>


        <div className="card" onClick={()=> onAtrasosHandler()}>
            <div className="card-inner">
                <p className="text-primary">TOTAL ATRASOS</p>
                <span className="material-icons-outlined text-red">
                    notifications
                </span>
                
            </div>
            <p className="text-primary font-weight-bold"># {totalAtrasos}</p>
            <span className="text-primary font-weight-bold">${totalDebt.toLocaleString()}</span>
        </div>

    </div>

    <div className="charts">

        <div className="charts-card">
            <p className="chart-title">Últimos 6 meses</p>
            <div className='users-charts'><DoubleChart/></div>

        </div>
        <div className="charts-card">
            <p className="chart-title">Visión General</p>
            <div className='users-charts'><DoubleChartMonthly /></div>
        </div>
    </div>

   

          
</div>
  )
}
