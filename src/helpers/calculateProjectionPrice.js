export const calculateProjectionPrice = (month, orders, months) => {
    const projectedOrders = [];
    
    orders && orders.forEach((order) => {
      if (order.completada === false) {
        const formattedDeliveryDate = order.entrega.replace(/(\d{1,2})\/(\d{1,2})\/(\d{4})/, '$2/$1/$3');
      const deliveryDate = new Date(formattedDeliveryDate);
      const deliveryMonth = deliveryDate.getMonth();
      
      const currentYear = new Date().getFullYear();
      const currentDate = new Date();
      const minDeliveryDate = new Date(currentYear, deliveryMonth - 6);
      const maxDeliveryDate = new Date(currentYear, currentDate.getMonth() + 5, currentDate.getDate()); // Máximo 5 meses hacia el futuro
      
      if (months[deliveryMonth] === month && deliveryDate >= minDeliveryDate && deliveryDate <= maxDeliveryDate) {
        projectedOrders.push(order);
      }
    }
  });
  
  let totalPrice = 0;
  
  projectedOrders.forEach((order) => {
    totalPrice += Number(order.precio);
  });
  
  const formattedPrice = totalPrice.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  });
  
  return formattedPrice;
};