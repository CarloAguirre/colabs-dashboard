import React, { useEffect, useRef } from "react";
import ApexCharts from "apexcharts";
import { useOrdenes } from "../context";

export const DoubleChartMonthly = () => {
  const chartRef = useRef(null);
  const { orders } = useOrdenes();

  const allUsersArray = () => {
    const currentDate = new Date();
    currentDate.setMonth(currentDate.getMonth() + 1);
    const pastDate = new Date();
    pastDate.setMonth(pastDate.getMonth() - 11);

    const invoiceMonthMap = {};
    const orderPriceMap = {};
    const orderCompletedMap = {};

    orders.forEach((order) => {
      const [day, month, year] = order.entrega.split("/");
      const entregaDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));

      if (entregaDate >= pastDate && entregaDate <= currentDate) {
        const monthKey = `${year}-${month}`;
        if (order.completada === true) {
          if (orderCompletedMap[monthKey]) {
            orderCompletedMap[monthKey] += Number(order.precio);
          } else {
            orderCompletedMap[monthKey] = Number(order.precio);
          }
        } else {
          if (orderPriceMap[monthKey]) {
            orderPriceMap[monthKey] += Number(order.precio);
          } else {
            orderPriceMap[monthKey] = Number(order.precio);
          }
        }
        invoiceMonthMap[monthKey] = true;
      }
    });

    const invoiceMonth = Object.keys(invoiceMonthMap).sort();
    const orderPrice = invoiceMonth.map((month) => orderPriceMap[month] || 0);
    const orderInvoiceMonth = Object.keys(orderCompletedMap).sort();
    const orderCompleted = orderInvoiceMonth.map((month) => orderCompletedMap[month] || 0);

    return { invoiceMonth, orderPrice, orderInvoiceMonth, orderCompleted };
  };

  useEffect(() => {
    const { invoiceMonth, orderPrice, orderInvoiceMonth, orderCompleted } = allUsersArray();

    const mergedMonths = [...new Set(invoiceMonth.concat(orderInvoiceMonth))].sort();

    const series1Data = mergedMonths.map((month) => {
      return orderPrice[invoiceMonth.indexOf(month)] || 0;
    });

    const series2Data = mergedMonths.map((month) => {
      return orderCompleted[orderInvoiceMonth.indexOf(month)] || 0;
    });

    const options = {
      chart: {
        height: 420,
        width: 680,
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
        categories: mergedMonths,
      },
    };

    const chart = new ApexCharts(chartRef.current, options);
    chart.render();

    return () => {
      chart.destroy();
    };
  }, [orders]);

  return <div id="chart" ref={chartRef}></div>;
};
