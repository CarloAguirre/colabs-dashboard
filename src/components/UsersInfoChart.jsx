import React, { useEffect, useState } from "react"
import Chart from 'react-apexcharts'
import { infoChart } from "../config/infoCharts"



export const UsersInfoChart = ({users})=> {

    let usersName = []
    let usersColab = []

    const allUsersArray = ()=>{
        users.forEach(user => {
            usersName.push(user.nombre)
            usersColab.push(user.cantidad)
        })    
    }

    
    useEffect(() => {    
        allUsersArray()  
        setChart(infoChart(usersName, usersColab))  
          
    }, [users])

    const [chart, setChart] = useState(infoChart(usersName, usersColab))

    
return (
    <Chart options={chart.options} series={chart.series} type="bar" width={500} height={320} />
)
}
  