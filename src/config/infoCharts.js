
export const infoChart = (usersName, orderPrice)=>{
    return {
        options: {
            chart: {
                // id: 'apexchart-example'
            },
            xaxis: {
                categories:  usersName
            }
            },
            series: [{
            name: 'Monto',
            data: orderPrice
            }]
        }
}