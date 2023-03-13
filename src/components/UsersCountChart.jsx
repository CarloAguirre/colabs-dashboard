import React, { useState } from "react"
import Chart from 'react-apexcharts'

export const UsersCountChart = () => {
    const [chart, setChart] = useState({       

    options: {
        plotOptions: {
            radialBar: {
            startAngle: -135,
            endAngle: 225,
            hollow: {
                margin: 0,
                size: "70%",
                background: "#fff",
                image: undefined,
                imageOffsetX: 0,
                imageOffsetY: 0,
                position: "front",
                dropShadow: {
                enabled: true,
                top: 3,
                left: 0,
                blur: 4,
                opacity: 0.24
                }
            },
            track: {
                background: "#fff",
                strokeWidth: "67%",
                margin: 0, // margin is in pixels
                dropShadow: {
                enabled: true,
                top: -3,
                left: 0,
                blur: 4,
                opacity: 0.35
                }
            },

            dataLabels: {
                showOn: "always",
                name: {
                offsetY: -20,
                show: true,
                color: "#888",
                fontSize: "13px"
                },
                value: {
                formatter: function (val) {
                    return val;
                },
                color: "#111",
                fontSize: "30px",
                show: true
                }
            }
            }
        },
        fill: {
            type: "gradient",
            gradient: {
            shade: "dark",
            type: "horizontal",
            shadeIntensity: 0.5,
            gradientToColors: ["#ABE5A1"],
            inverseColors: true,
            opacityFrom: 1,
            opacityTo: 1,
            stops: [0, 100]
            }
        },
        stroke: {
            lineCap: "round"
        },
        labels: ["Percent"]
        },
        series: [4],
        optionsBar: {
        chart: {
            stacked: true,
            stackType: "100%",
            toolbar: {
            show: false
            }
        },
        plotOptions: {
            bar: {
            horizontal: true
            }
        },
        dataLabels: {
            dropShadow: {
            enabled: true
            }
        },
        stroke: {
            width: 0
        },
        xaxis: {
            categories: ["Fav Color"],
            labels: {
            show: false
            },
            axisBorder: {
            show: false
            },
            axisTicks: {
            show: false
            }
        },
        fill: {
            opacity: 1,
            type: "gradient",
            gradient: {
            shade: "dark",
            type: "vertical",
            shadeIntensity: 0.35,
            gradientToColors: undefined,
            inverseColors: false,
            opacityFrom: 0.85,
            opacityTo: 0.85,
            stops: [90, 0, 100]
            }
        },

        legend: {
            position: "bottom",
            horizontalAlign: "right"
        }
        }

    })
return (
    <Chart options={chart.options} series={chart.series} type="radialBar" width={500} height={320} />
)
}
