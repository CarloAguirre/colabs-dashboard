
export const filterOrders = (searchedOrder, orders) => {
    let filteredOrders = null;
  
    if (
      searchedOrder.toLowerCase() === "atrasos" ||
      searchedOrder.toLowerCase() === "atrasadas" ||
      searchedOrder.toLowerCase() === "atrasados"
    ) {
      const currentDate = new Date();
      filteredOrders = orders.filter((order) => {
        const entregaDateParts = order.entrega.split("/");
        const entregaDate = new Date(
          entregaDateParts[2],
          entregaDateParts[1] - 1,
          entregaDateParts[0]
        );
        return !order.completada && entregaDate < currentDate;
      });
    } else {
      filteredOrders = orders.filter((order) => {
        for (let key in order) {
          if (order.hasOwnProperty(key)) {
            const value = order[key];
            const lowercaseValue =
              typeof value === "string" ? value.toLowerCase() : value?.toString().toLowerCase();
            const lowercaseSearch = searchedOrder.toLowerCase();
  
            if (lowercaseValue && lowercaseValue.includes(lowercaseSearch)) {
              return true;
            }
          }
        }
        return false;
      });
    }
  
    return filteredOrders;
  };
  