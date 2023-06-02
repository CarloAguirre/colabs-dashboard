export const infoChart = (invoiceDate, orderPrice, orderNumber) => {
    return {
      options: {
        chart: {},
        xaxis: {
          categories: invoiceDate,
        }
      },
      series: [
        {
          name: 'Precio',
          data: orderPrice,
        },
      ],
    };
  };
  