
export const infoChart = (invoiceDate, orderPrice )=>{
    return {
        options: {
            chart: {
                // id: 'apexchart-example'
            },
            xaxis: {
                categories:  invoiceDate
            }
            },
            series: [{
                name: 'Precio',
                data: orderPrice
            },
            
        ]
        }
}