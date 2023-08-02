import React, { useEffect, useRef, useState } from "react";
import ApexCharts from "apexcharts";
import { useOrdenes } from "../context";
import { parse, getMonth, getYear, format } from "date-fns";

export const Tester = () => {
  const chartRef = useRef(null);
  const { orders } = useOrdenes();

  useEffect(() => {
    const chartMaker = () => {
      const currentDate = new Date();
      const currentYear = currentDate.getFullYear();
      const currentMonth = currentDate.getMonth();
    
      const totalsByMonth = {};
    
      orders.forEach((order) => {
        if (order.completada === true) {
          const orderDate = parse(order.invoice_date, "dd/MM/yyyy", new Date());
          const orderMonth = getMonth(orderDate);
          const orderYear = getYear(orderDate);
    
          const yearDiff = currentYear - orderYear;
          const monthDiff = yearDiff * 12 + currentMonth - orderMonth;
    
          if (yearDiff < 2 && monthDiff >= 0 && monthDiff < 12) {
            const monthKey = format(orderDate, "MM/yyyy");
    
            if (!(monthKey in totalsByMonth)) {
              totalsByMonth[monthKey] = {
                total44: 0,
                total45: 0,
              };
            }
    
            if (order.numero.toString().startsWith("44")) {
              totalsByMonth[monthKey].total44 += Number(order.precio);
            } else if (order.numero.toString().startsWith("45")) {
              totalsByMonth[monthKey].total45 += Number(order.precio);
            }
          }
        }
      });
    
      // Formatear los valores total44 y total45 con toFixed(2)
      Object.values(totalsByMonth).forEach((monthData) => {
        monthData.total44 = monthData.total44.toFixed(2);
        monthData.total45 = monthData.total45.toFixed(2);
      });
    
      return totalsByMonth;
    };
    
    const totalsByMonth = chartMaker();

    const categories = Object.keys(totalsByMonth).sort((a, b) => {
      const [monthA, yearA] = a.split("/");
      const [monthB, yearB] = b.split("/");
      return new Date(yearA, monthA - 1) - new Date(yearB, monthB - 1);
    }).slice(-6);

    const series44 = categories.map((category) => totalsByMonth[category].total44);
    const series45 = categories.map((category) => totalsByMonth[category].total45);

    const options = {
      series: [
        {
          name: "#44",
          data: series44,
        },
        {
          name: "#45",
          data: series45,
        },
      ],
      chart: {
        type: "bar",
        height: 420,
        width: 505,
        stacked: true,
        stackType: "%",
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            legend: {
              position: "bottom",
              offsetX: -10,
              offsetY: 0,
            },
          },
        },
      ],
      xaxis: {
        categories: categories,
      },
      yaxis: {
        labels: {
          formatter: function (value) {
            return value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
          },
        },
        
      },
      plotOptions: {
        bar: {
          columnWidth: "90%", // Establecer el ancho de las barras (ajusta este valor según tus necesidades)
          dataLabels: {
            position: "top",
            formatter: function (val, opts) {
              return opts.w.globals.labels[opts.dataPointIndex] + ": " + val.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
            },
          },
        },
      },
      tooltip: {
        y: {
          formatter: function (val) {
            return val.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
          },
        },
      },
      fill: {
        opacity: 1,
      },
      legend: {
        position: "right",
        offsetX: 0,
        offsetY: 50,
      },
    };

    if (chartRef.current) {
      const chart = new ApexCharts(chartRef.current, options);
      chart.render();

      return () => {
        chart.destroy(); // Destruye el gráfico al desmontar el componente
      };
    }
  }, [orders]);

  return <div id="chart" ref={chartRef}></div>;
};
