import React, { useEffect, useRef } from "react";
import ApexCharts from "apexcharts";
import { useOrdenes } from "../context";
import { calculateTotalPrice } from "../helpers/calculateTotalPrice";
import { calculateProjectionPrice } from "../helpers/calculateProjectionPrice";

export const DoubleChartMonthly = () => {
  const chartRef = useRef(null);
  const { months, ventas, proyecciones, ventasConvertidas, proyeccionesConvertidas, orders, tableOrders} = useOrdenes();
  
  const currentMonthIndex = new Date().getMonth();
  const startIndex = currentMonthIndex - 6 >= 0 ? currentMonthIndex - 6 : 12 + (currentMonthIndex - 6);

  let monthHeaders = months.slice(startIndex).concat(months.slice(0, startIndex));

  let monthHeadersShort = months
    .slice(startIndex)
    .concat(months.slice(0, startIndex))
    .map((month) => {
      // Obtén la abreviatura del mes
      return month.slice(0, 3); // Esto devuelve las primeras tres letras del mes
    });

  

  let totalVentas = [];
  let totalProyecciones = [];
  monthHeaders.map((month) => {
    let proyeccion = calculateProjectionPrice(month, orders, months);
    let precio = calculateTotalPrice(month, tableOrders, months);
    // Eliminar símbolo de dólar y comas y convertir a número
    proyeccion = parseFloat(proyeccion.replace(/[^\d.]/g, ''));
    precio = parseFloat(precio.replace(/[^\d.]/g, ''));
    totalVentas.push(precio);
    totalProyecciones.push(proyeccion);
  });
  // useEffect(() => {
  // }, [monthHeaders]);


  
  useEffect(() => {
    if (chartRef.current && totalVentas !== [] && totalProyecciones !== [] && monthHeadersShort) {
    if (chartRef.current) {
      const options = {
        chart: {
          height: 420,
          width: 550,
          type: "area",
        },
        dataLabels: {
          enabled: false,
        },
        series: [
          {
            name: "Proyeccion",
            data: totalProyecciones,
          },
          {
            name: "Ventas",
            data: totalVentas,
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
          categories: monthHeadersShort && monthHeadersShort,
        }
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
