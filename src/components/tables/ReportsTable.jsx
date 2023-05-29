import { Form } from "react-bootstrap";
import { useOrdenes } from "../../context";
import './tables.css';

export const ReportsTable = () => {
  const { selectReportsForm, contratosArray, tableOrders } = useOrdenes();

  const months = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  const currentMonthIndex = new Date().getMonth(); // Índice del mes actual
  const startIndex = currentMonthIndex - 6 >= 0 ? currentMonthIndex - 6 : 12 + (currentMonthIndex - 6); // Índice de inicio (6 meses atrás desde la fecha actual)

  const monthHeaders = months.slice(startIndex).concat(months.slice(0, startIndex));

  const calculateTotalPrice = (month) => {
    const completedOrders = []; // Array para almacenar las órdenes completadas

    tableOrders.forEach((order) => {
      if (order.completada === true) {
        const formattedInvoiceDate = order.invoice_date.replace(/(\d{1,2})\/(\d{1,2})\/(\d{4})/, '$2/$1/$3');
        const invoiceDate = new Date(formattedInvoiceDate);
        const invoiceMonth = invoiceDate.getMonth();

        if (months[invoiceMonth] === month) {
          completedOrders.push(order); // Almacena las órdenes completadas en el nuevo array
        }
      }
    });

    let totalPrice = 0;

    completedOrders.forEach((order) => {
      totalPrice += (Number(order.precio) * Number(order.cantidad));
    });

    const formattedPrice = totalPrice.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    });

    return formattedPrice;
  };

  return (
    <>
      <div className="main-container">
        <div className="mt-4 shadow-lg p3 mb-5 bg-body rounded">
          <Form.Select aria-label="Default select example" onChange={selectReportsForm}>
            <option value='todos'>Todas las ordenes</option>
            {contratosArray.map(contrato => {
              return <option value={contrato} key={contrato}>contrato: {contrato}</option>
            })}
          </Form.Select>
          <div className="table-container table-size">
            <table className="table table-bordered table-striped">
              <thead>
                <tr>
                  <th scope="col">NUMERO</th>
                  <th scope="col">DESCRIPCIÓN</th>
                  <th scope="col">ENTREGA</th>
                  <th scope="col">CANTIDAD</th>
                  {monthHeaders.map((month, index) => (
                    <th key={index} scope="col">{month}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tableOrders.map((order, index) => {
                  let formattedDeliveryDate = "";

                  if (order.completada) {
                    formattedDeliveryDate = order.invoice_date.replace(/(\d{1,2})\/(\d{1,2})\/(\d{4})/, '$2/$1/$3');
                  } else {
                    formattedDeliveryDate = order.entrega.replace(/(\d{1,2})\/(\d{1,2})\/(\d{4})/, '$2/$1/$3');
                  }

                  const deliveryDate = new Date(formattedDeliveryDate);
                  const isPastDue = deliveryDate < new Date();
                  const deliveryMonth = deliveryDate.getMonth();
                  const deliveryColumn = monthHeaders.findIndex(month => month === months[deliveryMonth]);
                  let dateClassName = '';

                  if (order.completada === false) {
                    dateClassName = isPastDue ? 'text-white bg-danger' : 'text-white bg-success';
                  } else if (order.completada === true && isPastDue) {
                    dateClassName = 'text-black bg-warning';
                  } else {
                    dateClassName = 'text-black';
                  }

                  let price = (Number(order.cantidad) * order.precio);
                  const formattedPrice = price.toLocaleString('en-US', {
                    style: 'currency',
                    currency: 'USD',
                    minimumFractionDigits: 2,
                  });

                  return (
                    <tr key={index}>
                      <td><a href={order.img} target='_blank'>{order.numero}</a></td>
                      <td>{order.descripcion}</td>
                      <td>{order.entrega}</td>
                      <td>{order.cantidad}</td>
                      {Array(deliveryColumn).fill().map((_, index) => (
                        <td key={index}></td>
                      ))}
                      {(order.completada === true)? <td className={dateClassName} title={order.invoice_date}>{formattedPrice}</td>
                        : <td className={dateClassName} title={order.entrega}>{formattedPrice}</td>}
                      
                      {Array(12 - deliveryColumn).fill().map((_, index) => (
                        <td key={index}></td>
                      ))}
                    </tr>
                  );
                })}
                <tr style={{ background: 'yellow', color: 'black' }} >
                  <td>TOTAL</td>
                  <td></td>
                  <td></td>
                  <td></td>
                  {monthHeaders.map((month, index) => (
                    <td key={index}>{calculateTotalPrice(month)}</td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};
