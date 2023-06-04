import React, { useEffect, useRef } from "react";
import ApexCharts from "apexcharts";
import { useOrdenes } from "../context";

export const DoubleChartMonthly = () => {
  const chartRef = useRef(null);
  const { months, ventas, proyecciones, ventasConvertidas, proyeccionesConvertidas} = useOrdenes();
  
  
  useEffect(() => {
    if (chartRef.current && ventasConvertidas !== [] && proyeccionesConvertidas !== []) {
      console.log(ventasConvertidas)
      console.log(ventas)
    if (chartRef.current) {
      const options = {
        chart: {
          height: 420,
          width: 633,
          type: "area",
        },
        dataLabels: {
          enabled: false,
        },
        series: [
          {
            name: "Proyeccion",
            data: proyeccionesConvertidas,
          },
          {
            name: "Ventas",
            data: ventasConvertidas,
          },
        ],
        fill: {
          type: "gradient",
          gradient: {
            shadeIntensity: 1,
            opacityFrom: 0.7,
            opacityTo: 0.9,
            stops: [0, 90, 100],
          },
        },
        xaxis: {
          categories: months,
        },
      };

      const chart = new ApexCharts(chartRef.current, options);
      chart.render();

      return () => {
        chart.destroy();
      };
    }
  }
  }, [chartRef, months, ventas, proyecciones, ventasConvertidas, proyeccionesConvertidas]);



  return <div id="chart" ref={chartRef}></div>;
};
