import React, { useEffect, useState } from "react"
import Chart from 'react-apexcharts'



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
        setChart({
            options: {
                chart: {
                    // id: 'apexchart-example'
                },
                xaxis: {
                    categories:  usersName
                }
                },
                series: [{
                name: 'series-1',
                data: usersColab
                }]
            })  
          
    }, [users])

    const [chart, setChart] = useState({       
       
        options: {
        chart: {
            // id: 'apexchart-example'
        },
        xaxis: {
            categories: usersName
        }
        },
        series: [{
        name: 'series-1',
        data: usersColab
        }]

        
    
    })

    
return (
    <Chart options={chart.options} series={chart.series} type="bar" width={500} height={320} />
)
}
  