import React, { useEffect, useState } from "react";
import Chart from 'react-apexcharts';
import { infoChart } from "../config/infoCharts";
import { useOrdenes } from "../context";

export const OrdersRanking = () => {
  const { orders } = useOrdenes();
  console.log(orders);

  let invoiceDate = [];
  let orderPrice = [];
  let orderNumber = [];

  const allUsersArray = () => {
    const currentDate = new Date();

    orders.forEach(order => {
      const [day, month, year] = order.entrega.split("/");
      const entregaDate = new Date(year, month - 1, day);

      if (entregaDate > currentDate) {
        invoiceDate.push(order.entrega);
        orderNumber.push(order.numero);
        orderPrice.push(Number(order.precio));
      }
    });

    invoiceDate.sort((a, b) => {
      const [dayA, monthA, yearA] = a.split("/");
      const [dayB, monthB, yearB] = b.split("/");
      return new Date(yearA, monthA - 1, dayA) - new Date(yearB, monthB - 1, dayB);
    });

    invoiceDate = invoiceDate.slice(0, 5);
    orderPrice = orderPrice.slice(0, 5);
  };

  useEffect(() => {
    allUsersArray();
    const updatedChart = infoChart(invoiceDate, orderPrice);
    updatedChart.options.tooltip = {
      ...updatedChart.options.tooltip,
      formatter: function (val) {
        const orderIndex = val.dataPointIndex;
        const orderNum = orderNumber[orderIndex];
        return `Order Number: ${orderNum}`;
      }
    };
    setChart(updatedChart);
  }, [orders]);

  const [chart, setChart] = useState(infoChart(invoiceDate, orderPrice));

  return (
    <Chart options={chart.options} series={chart.series} type="bar" width={500} height={320} />
  );
};
