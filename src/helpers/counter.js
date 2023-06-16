export const counterOrdersTotalprice = (orders)=>{
    let counter = 0;
    
      orders.map(order => {
        if (order.completada === true) {
          const orderDateParts = order.fecha.split('/');
          const orderDay = parseInt(orderDateParts[0]);
          const orderMonth = parseInt(orderDateParts[1]) - 1; // Restamos 1 ya que los meses en JavaScript son indexados desde 0 (enero = 0)
          const orderYear = parseInt(orderDateParts[2]);
    
          const orderDate = new Date(orderYear, orderMonth, orderDay);
          const currentDate = new Date();
          const oneMonthAgo = new Date();
          oneMonthAgo.setMonth(currentDate.getMonth() - 12);
    
          if (orderDate <= currentDate && orderDate >= oneMonthAgo) {
            counter += order.precio;
          }
        }
    });
    return counter;
}