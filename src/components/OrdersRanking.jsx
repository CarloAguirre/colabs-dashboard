import React, { useEffect, useState } from "react";
import Chart from 'react-apexcharts';
import { infoChart } from "../config/infoCharts";
import { useOrdenes } from "../context";

export const OrdersRanking = () => {
  const { orders } = useOrdenes();
  console.log(orders);

  let invoiceDate = [];
  let orderPrice = [];

  const allUsersArray = () => {
    const currentDate = new Date();

    orders.forEach(order => {
      const [day, month, year] = order.entrega.split("/");
      const entregaDate = new Date(year, month - 1, day);

      if (entregaDate > currentDate) {
        invoiceDate.push(order.entrega);
        orderPrice.push(Number(order.precio));
      }
      console.log(invoiceDate)
    });

    invoiceDate.sort((a, b) => {
      const [dayA, monthA, yearA] = a.split("/");
      const [dayB, monthB, yearB] = b.split("/");
      return new Date(yearA, monthA - 1, dayA) - new Date(yearB, monthB - 1, dayB);
    }); // Ordenar el array invoiceDate por fecha

    invoiceDate = invoiceDate.slice(0, 10); // Limitar el array a 10 fechas
  };

  useEffect(() => {
    allUsersArray();
    setChart(infoChart(invoiceDate, orderPrice));
  }, [orders]);

  const [chart, setChart] = useState(infoChart(invoiceDate, orderPrice));

  return (
    <Chart options={chart.options} series={chart.series} type="bar" width={500} height={320} />
  );
};
