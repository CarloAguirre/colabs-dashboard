import React, { useEffect, useState } from "react";
import Chart from 'react-apexcharts';
import { infoChart } from "../config/infoCharts";
import { useOrdenes } from "../context";

export const UsersInfoChart = () => {
  const { orders } = useOrdenes();
  console.log(orders);

  let invoiceDate = [];
  let orderPrice = [];
  let orderNumber = []

  const allUsersArray = () => {
    orders.forEach(order => {
      if (order.completada === true) {
        invoiceDate.push(order.invoice_date);
        orderNumber.push(order.numero);;
        orderPrice.push(Number(order.precio));
      }
    });

    invoiceDate.sort((a, b) => {
      const dateA = new Date(a.split("/").reverse().join("/"));
      const dateB = new Date(b.split("/").reverse().join("/"));
      return dateA - dateB;
    }); // Ordenar el array invoiceDate por fecha

    invoiceDate = invoiceDate.slice(0, 10); // Limitar el array a 10 fechas
    orderPrice = orderPrice.slice(0, 10); 
  };

  useEffect(() => {
    allUsersArray();
    setChart(infoChart(invoiceDate, orderPrice));
  }, [orders]);

  const [chart, setChart] = useState(infoChart(invoiceDate, orderPrice));

  const chartOptions = {
    ...chart.options,
    colors: ["#008f39"],
  };

  return (
    <Chart options={chartOptions} series={chart.series} type="bar" width={500} height={320} />
  );
};
