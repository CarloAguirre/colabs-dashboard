import React, { useEffect, useState } from "react"
import Chart from 'react-apexcharts'
import { counterCharts } from "../config/counterCharts"

export const UsersCountChart = ({counter}) => {

    useEffect(() => {
        setChart({
            ...chart,
            series: [counter]
        })
      }, [counter])

    const [chart, setChart] = useState(counterCharts(counter))

    
return (
    <Chart options={chart.options} series={chart.series} type="radialBar" width={500} height={320} />
)
}
