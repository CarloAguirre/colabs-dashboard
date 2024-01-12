export const counterOrdersTotalprice = (orders, year) => {
  let counter = 0;
  if (!year || year === "all") {
    // Si year no está presente o es "all", sumar todos los precios de las órdenes
    orders.forEach((order) => {
      if (order.completada === true) {
        counter += order.precio;
      }
    });
  } else {
    // Filtrar las órdenes basándose en el año seleccionado (septiembre a septiembre)
    const selectedYear = parseInt(year);
    const startYear = selectedYear;
    const endYear = selectedYear + 1;
    const startDate = new Date(`${startYear}-09-01`);
    const endDate = new Date(`${endYear}-09-01`);

    orders.forEach((order) => {
      if (order.completada === true) {
        const orderDateParts = order.invoice_date.split('/');
        const orderDay = parseInt(orderDateParts[0]);
        const orderMonth = parseInt(orderDateParts[1]) - 1;
        const orderYear = parseInt(orderDateParts[2]);

        const orderDate = new Date(orderYear, orderMonth, orderDay);
        if (orderDate >= startDate && orderDate < endDate) {
          console.log(order)
          counter += order.precio;
        }
      }
    });
  }
  return counter;
};
