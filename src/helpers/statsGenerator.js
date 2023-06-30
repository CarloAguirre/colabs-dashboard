export const statsGenerator = (orders, stats, setStats) => {
    let { totalMoney, totalDebt, totalAtrasos, warningOrder } = stats;
    let updatedTotalMoney = totalMoney;
    let updatedTotalDebt = totalDebt;
    let updatedTotalAtrasos = totalAtrasos;
  
    orders.forEach(order => {
      let monto = Number(order.precio);
      if (!order.completada) {
        updatedTotalMoney += monto;
      }
  
      const [day, month, year] = order.entrega.split("/");
      const entregaDate = new Date(Number(year), Number(month) - 1, Number(day));
  
      if (entregaDate < new Date() && !order.completada) {
        updatedTotalDebt += monto;
        updatedTotalAtrasos += 1;
      }
    });
  
    setStats({
      ...stats,
      totalMoney: updatedTotalMoney,
      totalDebt: updatedTotalDebt,
      totalAtrasos: updatedTotalAtrasos
    });
  };
  