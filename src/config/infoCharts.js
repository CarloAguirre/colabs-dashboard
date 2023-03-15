
export const infoChart = (usersName, usersColab)=>{
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
            name: 'series-1',
            data: usersColab
            }]
        }
}