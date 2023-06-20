export async function onSubmit(event, setSpinnerSwitch, invoiceDate, invoice, archivo, newOrderData, es, parse, format, orderUpdate, cargarImagen, createProducto, orders) {
  setSpinnerSwitch(true);
  event.preventDefault();

  const existeProducto = orders && orders.find((order) => order.numero === newOrderData[0]);
  if (existeProducto) {
    alert(`La Orden N°${newOrderData[0]} ya existe en la base de datos`);
    setSpinnerSwitch(false);
    return;
  }

  const categoria = event.target.name;

  if (categoria === 'invoice') {
    try {
      const invoiceDateString = parse(invoiceDate, 'dd/MM/yyyy', new Date(), { locale: es });
      const formattedInvoiceDate = format(invoiceDateString, 'dd/MM/yyyy');
      await orderUpdate(invoice, formattedInvoiceDate);
      await cargarImagen(archivo, invoice);
    } catch (error) {
      console.log(error);
    }
  } else if(categoria === "licitacion"){
    console.log("es licitacion!!")
  }else {
    try {
      const dateString = parse(newOrderData[1], 'dd/MM/yyyy', new Date(), { locale: es });
      const deliveryDateString = parse(newOrderData[4], 'dd/MM/yyyy', new Date(), { locale: es });

      const formattedDate = format(dateString, 'dd/MM/yyyy');
      const formattedDelivery = format(deliveryDateString, 'dd/MM/yyyy');
      const createOrder = await createProducto(
        newOrderData[0],
        formattedDate,
        newOrderData[2],
        newOrderData[3],
        formattedDelivery,
        newOrderData[5],
        newOrderData[6],
        newOrderData[7],
        newOrderData[8],
        newOrderData[9],
        newOrderData[10],
        categoria,
        newOrderData[11],
        newOrderData[12],
        newOrderData[13]
      );

      if (createOrder) {
        await cargarImagen(archivo, null);
      }
    } catch (error) {
      console.error(error);
      alert('Ha habido un problema, vuelve a intentarlo más tarde o comunícate con el programador carlo_aguirre@outlook.cl....¿Estás seguro que subiste el formato de orden correcto?');
      setSpinnerSwitch(false);
    }
  }
}
