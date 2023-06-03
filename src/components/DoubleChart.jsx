import React, { useEffect, useRef } from "react";
import ApexCharts from "apexcharts";
import { useOrdenes } from "../context";

export const DoubleChart = () => {
  const chartRef = useRef(null);

  const { orders } = useOrdenes();
  console.log(orders);

  let invoiceDate = [];
  let orderNumber = [];
  let orderCompleted = [];
  let orderInvoiceDate = [];
  let orderPriceMap = {};
  let orderCompletedMap = {};

  const allUsersArray = () => {
    const currentDate = new Date();
    const pastDate = new Date();
    pastDate.setDate(pastDate.getDate() - 60);
  
    orders.forEach((order) => {
      const [day, month, year] = order.entrega.split("/");
      const entregaDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
  
      if (entregaDate >= pastDate && entregaDate <= currentDate) {
        invoiceDate.push(order.entrega);
        if (order.completada === true) {
          if (order.entrega in orderCompletedMap) {
            orderCompletedMap[order.entrega] += Number(order.precio);
          } else {
            orderCompletedMap[order.entrega] = Number(order.precio);
          }
          orderInvoiceDate.push(order.entrega);
        } else {
          if (order.entrega in orderPriceMap) {
            orderPriceMap[order.entrega] += Number(order.precio);
          } else {
            orderPriceMap[order.entrega] = Number(order.precio);
          }
        }
        orderNumber.push(order.numero);
      }
    });
  
    invoiceDate.sort((a, b) => {
      const [dayA, monthA, yearA] = a.split("/");
      const [dayB, monthB, yearB] = b.split("/");
      return new Date(parseInt(yearA), parseInt(monthA) - 1, parseInt(dayA)) - new Date(parseInt(yearB), parseInt(monthB) - 1, parseInt(dayB));
    });
  
    orderInvoiceDate.sort((a, b) => {
      const [dayA, monthA, yearA] = a.split("/");
      const [dayB, monthB, yearB] = b.split("/");
      return new Date(parseInt(yearA), parseInt(monthA) - 1, parseInt(dayA)) - new Date(parseInt(yearB), parseInt(monthB) - 1, parseInt(dayB));
    });
  
    // Calcular los totales de ventas por fecha
    orderInvoiceDate.forEach((date) => {
      orderCompleted.push(orderCompletedMap[date] || 0);
    });
  };
  

  useEffect(() => {
    allUsersArray();
  
    const mergedDates = [...new Set(invoiceDate.concat(orderInvoiceDate))].sort(
      (a, b) => {
        const [dayA, monthA, yearA] = a.split("/");
        const [dayB, monthB, yearB] = b.split("/");
        return (
          new Date(parseInt(yearA), parseInt(monthA) - 1, parseInt(dayA)) -
          new Date(parseInt(yearB), parseInt(monthB) - 1, parseInt(dayB))
        );
      }
    );
  
    const series1Data = mergedDates.map((date) => {
      return orderPriceMap[date] || 0;
    });
    
  
    const series2Data = mergedDates.map((date) => {
      const index = orderInvoiceDate.indexOf(date);
      return index !== -1 ? orderCompleted[index] || 0 : 0;
    });
  
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
          data: series1Data,
        },
        {
          name: "Ventas",
          data: series2Data,
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
        categories: mergedDates,
      },
    };
  
    const chart = new ApexCharts(chartRef.current, options);
    chart.render();
  
    return () => {
      chart.destroy(); // Destruye el gráfico al desmontar el componente
    };
  }, [orders]);
  

  return <div id="chart" ref={chartRef}></div>;
};
