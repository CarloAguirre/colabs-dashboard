import { Form } from "react-bootstrap";
import { useOrdenes } from "../../context";
import './tables.css';
import '../../App.css';
import { OnSearch } from '../onSearch/OnSearch';
import { useEffect } from "react";
import { tokenValidatior } from "../../helpers/tokenValidator";

export const ReportsTable = () => {
  const { selectReportsForm, contratosArray, tableOrders } = useOrdenes();

  useEffect(() => {
    tokenValidatior();
  }, []);

  const currentDate = new Date();

  const months = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  const currentMonthIndex = new Date().getMonth();
  const startIndex = currentMonthIndex - 6 >= 0 ? currentMonthIndex - 6 : 12 + (currentMonthIndex - 6);

  const monthHeaders = months.slice(startIndex).concat(months.slice(0, startIndex));

  const calculateTotalPrice = (month) => {
    const completedOrders = [];

    tableOrders.forEach((order) => {
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

  const calculateProjectionPrice = (month) => {
    const projectedOrders = [];
  
    tableOrders.forEach((order) => {
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
  

  const calculateDeliveryColumn = (deliveryMonth) => {
    const deliveryIndex = (deliveryMonth + 12 - startIndex) % 12;
    return deliveryIndex;
  };

  const sixMonthsAhead = new Date();
  sixMonthsAhead.setMonth(sixMonthsAhead.getMonth() + 6);

  return (
    <>
      <div className="main-container">
        <div className="main-title">
          <p className="font-weight-bold">ESTADO DE ORDENES</p>
        </div>
        <hr />
        <OnSearch />
        <div className="mt-4 shadow-lg p3 mb-5 bg-body rounded">
          <Form.Select aria-label="Default select example" onChange={selectReportsForm}>
            <option value='todos'>Todas las ordenes</option>
            {contratosArray.map(contrato => {
              return <option value={contrato} key={contrato}>contrato: {contrato}</option>
            })}
          </Form.Select>
          <div className="table-container table-size">
            <table className="table table-bordered table_report">
              <thead>
                <tr>
                  <th scope="col">NUMERO</th>
                  <th scope="col">DESCRIPCIÓN</th>
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
                  const deliveryColumn = calculateDeliveryColumn(deliveryMonth);

                  let dateClassName = '';

                  if (order.completada === false) {
                    dateClassName = isPastDue ? 'text-white bg-danger' : 'text-white bg-success';
                  } else if (order.completada === true && isPastDue) {
                    dateClassName = 'text-black bg-warning';
                  } else {
                    dateClassName = 'text-black';
                  }

                  let price = Number(order.precio);
                  const formattedPrice = price.toLocaleString('en-US', {
                    style: 'currency',
                    currency: 'USD',
                    minimumFractionDigits: 2,
                  });

                  if (deliveryDate <= sixMonthsAhead) {
                    return (
                      <tr key={index}>
                        <td><a href={order.img} target='_blank'>{order.numero}</a></td>
                        <td className='text-left'>{order.descripcion}</td>
                        {monthHeaders.map((month, index) => {
                          if (index === deliveryColumn) {
                            return (
                              <td key={index} className={dateClassName} title={formattedDeliveryDate}>{formattedPrice}</td>
                            );
                          } else {
                            return (
                              <td key={index}></td>
                            );
                          }
                        })}
                      </tr>
                    );
                  } else {
                    return null;
                  }
                })}
                <tr style={{ background: 'green', color: 'white' }}>
                  <td>PROYECCIÓNES</td>
                  <td></td>
                  {monthHeaders.map((month, index) => (
                    <td key={index}>{calculateProjectionPrice(month)}</td>
                  ))}
                </tr>
                <tr style={{ background: 'rgb(249, 200, 53)', color: 'black' }}>
                  <td>TOTAL</td>
                  <td></td>
                  {monthHeaders.map((month, index) => (
                    <td key={index}>{calculateTotalPrice(month)}</td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div className="info-labels mt-4">
          <span className="text-white label" style={{ backgroundColor: '#4eb466' }}>A tiempo</span>
          <span className="text-white label" style={{ backgroundColor: '#f9c835' }}>Facturadas</span>
          <span className="text-white label" style={{ backgroundColor: '#f46b5b' }}>Atrasadas</span>
        </div>
      </div>
    </>
  );
};
