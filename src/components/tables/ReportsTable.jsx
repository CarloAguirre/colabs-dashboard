import { Form } from "react-bootstrap";
import { useOrdenes } from "../../context";
import './tables.css';
import '../../App.css';
import { OnSearch } from '../onSearch/OnSearch';
import { useEffect, useState } from "react";
import { tokenValidatior } from "../../helpers/tokenValidator";

import { writeFile, saveAs } from "file-saver";
import * as XLSX from "xlsx";
import Button from 'react-bootstrap/Button';
import ExcelJS from "exceljs";

export const ReportsTable = () => {
  const { selectReportsForm, contratosArray, tableOrders, setProyecciones, setVentas, months, calculateProjectionPrice, calculateTotalPrice } = useOrdenes();


  useEffect(() => {
    tokenValidatior();
  }, []);


  const exportToExcel = async () => {
    const table = document.getElementById("tabla");
  
    // Crear un nuevo libro de Excel
    const workbook = new ExcelJS.Workbook();
  
    // Agregar una nueva hoja al libro de Excel
    const sheet = workbook.addWorksheet("Hoja1");
  
    // Establecer el formato de fecha general para todas las celdas
    sheet.eachRow((row) => {
      row.eachCell((cell) => {
        cell.numFmt = "General";
      });
    });
  
    // Obtener los encabezados de columna de la tabla
    const headerRow = table.querySelector("thead tr");
    const headerCells = Array.from(headerRow.querySelectorAll("th"));
  
    // Escribir los encabezados de columna en el libro de Excel
    headerCells.forEach((headerCell, cellIndex) => {
      sheet.getCell(1, cellIndex + 1).value = headerCell.textContent;
    });
  
    // Obtener las filas de datos de la tabla
    const dataRows = Array.from(table.querySelectorAll("tbody tr"));
  
    // Recorrer las filas de datos y obtener los valores de las celdas
    dataRows.forEach((dataRow, rowIndex) => {
      const dataCells = Array.from(dataRow.querySelectorAll("td"));
  
      // Escribir los valores de las celdas en el libro de Excel
      dataCells.forEach((dataCell, cellIndex) => {
        const cellValue = dataCell.textContent;
  
        // Verificar si el valor de la celda es un enlace
        if (dataCell.querySelector("a")) {
          const linkElement = dataCell.querySelector("a");
          const href = linkElement.getAttribute("href");
          const text = linkElement.textContent;
  
          // Agregar un hipervínculo a la celda
          const cell = sheet.getCell(rowIndex + 2, cellIndex + 1);
          cell.value = { text, hyperlink: href };
        } else {
          // Verificar si el valor de la celda es una fecha
          const dateRegex = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/;
          if (dateRegex.test(cellValue)) {
            // Obtener los componentes de la fecha
            const [, day, month, year] = dateRegex.exec(cellValue);
  
            // Crear la fecha en el formato "dd/mm/yyyy"
            const formattedDate = new Date(`${month}/${day}/${year}`);
  
            // Escribir la fecha en la celda
            const cell = sheet.getCell(rowIndex + 2, cellIndex + 1);
            cell.value = formattedDate;
            // cell.numFmt = "mm/dd/yyyy"; // Establecer el formato de fecha como "mm/dd/yyyy"
          } else {
            // Verificar si el valor de la celda contiene el signo "$"
            if (cellValue.includes("$")) {
              // Eliminar el signo de peso y las comas del valor
              const numericValue = cellValue.replace(/\$|,/g, "");
  
              // Verificar si el valor es un número
              if (!isNaN(parseFloat(numericValue))) {
                // Convertir el valor a número y escribirlo en la celda
                const numericCellValue = parseFloat(numericValue);
                const cell = sheet.getCell(rowIndex + 2, cellIndex + 1);
                cell.value = numericCellValue;
  
                // Establecer el formato de número en la celda
                cell.numFmt = "#,##0.00";
              } else {
                // Escribir el valor de la celda sin modificar
                sheet.getCell(rowIndex + 2, cellIndex + 1).value = cellValue;
              }
            } else {
              // Escribir el valor de la celda sin modificar
              sheet.getCell(rowIndex + 2, cellIndex + 1).value = cellValue;
            }
          }
        }
      });
    });
  
    // Generar un búfer de Excel en memoria
    const excelBuffer = await workbook.xlsx.writeBuffer();
  
    // Crear un objeto Blob a partir del búfer de Excel
    const data = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
  
    // Descargar el archivo de Excel
    saveAs(data, `Informe_ordenes.xlsx`);
  };

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
            <table className="table table-bordered table_report" id="tabla">
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
          <Button variant="outline-success" onClick={exportToExcel} className="btn-lg">
        Descargar Excel
        </Button>
        <div className="info-labels mt-4">
          <span className="text-white label" style={{ backgroundColor: '#4eb466' }}>A tiempo</span>
          <span className="text-white label" style={{ backgroundColor: '#f9c835' }}>Facturadas</span>
          <span className="text-white label" style={{ backgroundColor: '#f46b5b' }}>Atrasadas</span>
        </div>
      </div>
    </>
  );
};
