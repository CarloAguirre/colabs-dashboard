import React, { useEffect, useState } from "react"
import Chart from 'react-apexcharts'



export const UsersInfoChart = ({users})=> {

    console.log(users)

    const [chart, setChart] = useState({       
       
        options: {
        chart: {
            // id: 'apexchart-example'
        },
        xaxis: {
            categories: [1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999]
        }
        },
        series: [{
        name: 'series-1',
        data: [30, 40, 35, 50, 49, 60, 70, 91, 125]
        }]

        
    
    })
    
return (
    <Chart options={chart.options} series={chart.series} type="bar" width={500} height={320} />
)
}
  