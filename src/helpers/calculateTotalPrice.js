export const calculateTotalPrice = (month, tableOrders, months) => {
    const completedOrders = [];
    
    tableOrders && tableOrders.forEach((order) => {
      if (order.completada === true) {
        const formattedInvoiceDate = order.invoice_date.replace(/(\d{1,2})\/(\d{1,2})\/(\d{4})/, '$2/$1/$3');
        const invoiceDate = new Date(formattedInvoiceDate);
        const invoiceMonth = invoiceDate.getMonth();
        
        if (months[invoiceMonth] === month) {
          completedOrders.push(order);
        }
      }
    });
    
    let totalPrice = 0;
    
    completedOrders.forEach((order) => {
      totalPrice += Number(order.precio);
    });

    const formattedPrice = totalPrice.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    });
    
    return formattedPrice;
  };
