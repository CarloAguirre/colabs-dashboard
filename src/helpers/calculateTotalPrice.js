export const calculateTotalPrice = (month, tableOrders, months) => {
  const currentDate = new Date();
  const minDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 6);
  const maxDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 5, currentDate.getDate());

  const completedOrders = tableOrders.filter((order) => {
    if (order.completada === true) {
      const formattedInvoiceDate = order.invoice_date.replace(/(\d{1,2})\/(\d{1,2})\/(\d{4})/, '$2/$1/$3');
      const invoiceDate = new Date(formattedInvoiceDate);
      
      return invoiceDate >= minDate && invoiceDate <= maxDate && months[invoiceDate.getMonth()] === month;
    }
    return false;
  });

  const totalPrice = completedOrders.reduce((acc, order) => acc + Number(order.precio), 0);
  const formattedPrice = totalPrice.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  });

  return formattedPrice;
};
