import React, { useEffect, useState } from "react"
import Chart from 'react-apexcharts'
import { counterCharts } from "../config/counterCharts"

export const UsersCountChart = ({orders}) => {

    const [facturadas, setFacturadas] = useState(0)
    useEffect(() => {
        let counter = 0
        orders.map(order=>{
          if(order.completada === true){
            counter += 1
          }
          setFacturadas(counter)
        })
      }, [orders])
    
    useEffect(() => {
        setChart({
            ...chart,
            series: [facturadas]
        })
      }, [facturadas])

    const [chart, setChart] = useState(counterCharts(facturadas))

    
return (
    <Chart options={chart.options} series={chart.series} type="radialBar" width={500} height={320} />
)
}
