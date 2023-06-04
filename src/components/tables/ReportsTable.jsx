import { Form } from "react-bootstrap";
import { useOrdenes } from "../../context";
import './tables.css';
import '../../App.css';
import { OnSearch } from '../onSearch/OnSearch';
import { useEffect, useState } from "react";
import { tokenValidatior } from "../../helpers/tokenValidator";

export const ReportsTable = () => {
  const { selectReportsForm, contratosArray, tableOrders, setProyecciones, setVentas, months, calculateProjectionPrice, calculateTotalPrice } = useOrdenes();


  useEffect(() => {
    tokenValidatior();
  }, []);




  const currentMonthIndex = new Date().getMonth();
  const startIndex = currentMonthIndex - 6 >= 0 ? currentMonthIndex - 6 : 12 + (currentMonthIndex - 6);

  const monthHeaders = months.slice(startIndex).concat(months.slice(0, startIndex));


  

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
                  {monthHeaders.map((month, index) => {
                   return <td key={index}>{calculateProjectionPrice(month)}</td>
                })}
                </tr>
                <tr style={{ background: 'rgb(249, 200, 53)', color: 'black' }}>
                  <td>TOTAL</td>
                  <td></td>
                  {monthHeaders.map((month, index) => {
                    
                     return <td key={index}>{calculateTotalPrice(month)}</td>
                })}
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
