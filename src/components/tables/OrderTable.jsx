import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import Form from 'react-bootstrap/Form';
import { useOrdenes } from "../../context"
import { useEffect, useState } from 'react';
import Cookies from 'universal-cookie'
import './tables.css'
import'../../App.css'
import { OnSearch } from '../onSearch/OnSearch';

import { DatePickerComponent } from '../DatePickerComponent';
import { format } from 'date-fns';
import { orderUpdate } from '../../helpers/orderUpdate';
import { tokenValidatior } from '../../helpers/tokenValidator';

import { writeFile, saveAs } from "file-saver";
import * as XLSX from "xlsx";
import Button from 'react-bootstrap/Button';
// import ExcelJS from 'exceljs';
import ExcelJS from "exceljs";




export const OrderTable = ({status}) => {
  const {orders, tableOrders, setTableOrders, contratosArray, setContratosArray, selectContratoForm,searchedOrder  } = useOrdenes()

  const months = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  const currentMonthIndex = new Date().getMonth(); // Índice del mes actual
  const startIndex = currentMonthIndex - 6 >= 0 ? currentMonthIndex - 6 : 12 + (currentMonthIndex - 6); // Índice de inicio (6 meses atrás desde la fecha actual)

  const monthHeaders = months.slice(startIndex).concat(months.slice(0, startIndex)).map((month, index) => (
    <th key={index} scope="col">{month}</th>
  ));
  
    useEffect(() => {
        tokenValidatior();
    }, [])

    
    const [key, setKey] = useState('all')
    


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
              cell.numFmt = "dd/mm/yyyy"; // Establecer el formato de fecha como "dd/mm/yyyy"
            } else {
              // Escribir el valor de la celda
              sheet.getCell(rowIndex + 2, cellIndex + 1).value = cellValue;
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
    
    
    
    useEffect(() => {
        
        const contratosList =()=>{
            let array = [];
            orders.map(orden=>{
                if(orden.contrato != null && !array.includes(orden.contrato) && orden.categoria === "646d30f6df85d0a4c4958449")
                array.push(orden.contrato)
            })
            setContratosArray(array)
        }
        contratosList();

    }, [orders])
    

    const handleDateChange = async(orderNumber, newDate) => {

      const dateParts = newDate.split("/"); // Divide la cadena en partes separadas por "/"
      const day = parseInt(dateParts[0], 10); // Obtiene el día y lo convierte en un número entero
      const month = parseInt(dateParts[1], 10) - 1; // Obtiene el mes (restamos 1 porque los meses en JavaScript son indexados desde 0)
      const year = parseInt(dateParts[2], 10); // Obtiene el año

      const date = new Date(year, month, day);

      const fechaFormateada = format(date, 'dd/MM/yyyy');

      // eslint-disable-next-line no-restricted-globals
      const result = confirm(`Estas seguro que deseas cambiar la fecha a ${fechaFormateada}?`);
        if (result === true) {
          try {
            await orderUpdate(orderNumber, null, fechaFormateada)
            
          } catch (error) {
            alert('Se produjo un error, por favor comunicate con el administrador del sitio.')
          }
        } else {
        }
    };

    const tableModel = (ordenNumber)=>{
        return <div className="mt-4 shadow-lg p3 mb-5 bg-body rounded">
            {(ordenNumber === 45) &&
             <Form.Select aria-label="Default select example" onChange={selectContratoForm} >
             <option value='todos'>Contratos #45</option>
             {contratosArray.map(contrato=>{
                return <option value={contrato} key={contrato}>{contrato}</option>              
             })}
           </Form.Select>
            }   
    <div className="table-container table-size">

        <table className="table table-bordered table-striped" id='tabla'>
          {(ordenNumber === "reports") ?
          <thead>
            <tr>
              <th scope="col">NUMERO</th>
              <th scope="col">DESCRIPCIÓN</th>                  
              <th scope="col">FECHA</th>
              <th scope="col">CANTIDAD</th> 
              {monthHeaders}
            </tr>
          </thead> 
          :
          <thead>
            <tr>
            <th scope="col">NUMERO</th>
            { (status === 'paids' ) && <th scope="col">INVOICE</th>   }   
            { (ordenNumber === 45 ) && <th scope="col">CONTRATO</th>   }   
            <th scope="col">DESCRIPCIÓN</th>                  
            {/* <th scope="col">NOMBRE</th>
            <th scope="col">MAIL</th> */}
            { (ordenNumber === 'bhp' ) && <th scope="col">TELEFONO</th>   }   
            <th scope="col">FECHA</th>
            <th scope="col">DIVISION</th>
            <th scope="col">ENTREGA</th> 
            <th scope="col">SAP</th>
            <th scope="col">PRECIO/U</th>
            <th scope="col">CANTIDAD</th> 
            <th scope="col">TOTAL</th>
            </tr>
        </thead>
        }

        <tbody id='full-list'>
    {(status === 'paids') ? 
    
      (tableOrders.map(order => {  
        let price = (Number(order.precio))
        const formattedPrice = price.toLocaleString('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
          });
        const formattedPrecioUnitario = (Number(order.precio / Number(order.cantidad))).toLocaleString('en-US', {
          style: 'currency',
          currency: 'USD',
          minimumFractionDigits: 2,
        });
        if (order.completada === true) {
          const regex = new RegExp(`^${ordenNumber}`);
          if (regex.test(order.numero) && (order.categoria === "646d30f6df85d0a4c4958449")) {                      
            return (
              <tr key={order.numero}>
                <td><a href={order.img} target='_blank'>{order.numero}</a></td>
                <td><a href={order.invoice} target='_blank'>VER FACTURA</a></td>
                {(ordenNumber === 45) && <td>{order.contrato}</td>}
                <td className='text-left'>{order.descripcion}</td>
                {/* <td>{order.nombre}</td>
                <td>{order.mail}</td> */}
                <td>{order.fecha}</td>
                <td>{order.division}</td>
                <td>{order.entrega}</td>
                <td>{order.material}</td>
                {(order.material.includes("/") ? <td>{formattedPrice}</td>
                : <td>{formattedPrecioUnitario}</td>)}
                <td>{order.cantidad}</td>
                <td>{formattedPrice}</td>
              </tr>
            );
          }
          else if (ordenNumber === 'todos') {
         
            let price = (Number(order.precio))
            const formattedPrice = price.toLocaleString('en-US', {
                style: 'currency',
                currency: 'USD',
                minimumFractionDigits: 2,
              });
            const formattedPrecioUnitario = (Number(order.precio / Number(order.cantidad))).toLocaleString('en-US', {
              style: 'currency',
              currency: 'USD',
              minimumFractionDigits: 2,
            });  
            return (
              <tr key={order.numero}>
                <td><a href={order.img} target='_blank'>{order.numero}</a></td>
                <td><a href={order.invoice} target='_blank'>VER FACTURA</a></td>
                <td className='text-left'>{order.descripcion}</td>
                {/* <td>{order.nombre}</td>
                <td>{order.mail}</td> */}
                <td>{order.fecha}</td>
                <td>{order.division}</td>
                <td>{order.entrega}</td>
                <td>{order.material}</td>
                {(order.material.includes("/") ? <td>{formattedPrice}</td>
                : <td>{formattedPrecioUnitario}</td>)}
                <td>{order.cantidad}</td>
                <td>{formattedPrice}</td>
              </tr>
            );
          }
          else if (ordenNumber === 'bhp') {
            let price = (Number(order.precio))
            const formattedPrice = price.toLocaleString('en-US', {
                style: 'currency',
                currency: 'USD',
                minimumFractionDigits: 2,
              });
            if (order.categoria === '646e2f1943ba97fc705a0276') {
              return (
                <tr key={order.numero}>
                  <td><a href={order.img} target='_blank'>{order.numero}</a></td>
                  <td><a href={order.invoice} target='_blank'>VER FACTURA</a></td>
                  <td className='text-left'>{order.descripcion}</td>
                  {/* <td>{order.nombre}</td>
                  <td>{order.mail}</td> */}
                  <td>{order.contrato}</td>
                  <td>{order.fecha}</td>
                  <td>{order.division}</td>
                  <td>{order.entrega}</td>
                  <td>{order.material}</td>
                  {(order.material.includes("/") ? <td>{formattedPrice}</td>
                : <td>{formattedPrecioUnitario}</td>)}
                  <td>{order.cantidad}</td>
                  <td>{formattedPrice}</td>
                </tr>
              );
            }
          }
        }
      }))
      :
      (tableOrders.map((order, index) => {  
        if (order.completada === false) {
          let price = (Number(order.precio))
          const formattedPrice = price.toLocaleString('en-US', {
              style: 'currency',
              currency: 'USD',
              minimumFractionDigits: 2,
            });
            const formattedPrecioUnitario = (Number(order.precio / Number(order.cantidad))).toLocaleString('en-US', {
              style: 'currency',
              currency: 'USD',
              minimumFractionDigits: 2,
            });
        const regex = new RegExp(`^${ordenNumber}`);
        if (regex.test(order.numero) && (order.categoria === "646d30f6df85d0a4c4958449")) {                      
          return (
            <tr key={order.numero}>
              <td><a href={order.img} target='_blank'>{order.numero}</a></td>
              {(ordenNumber === 45) && <td>{order.contrato}</td>}
              <td className='text-left'>{order.descripcion}</td>
              {/* <td>{order.nombre}</td>
              <td>{order.mail}</td> */}
              <td>{order.fecha}</td>
              <td>{order.division}</td>
              <td className = 'datePicker-td text-center'>
              <DatePickerComponent
              className = 'datePicker'
                 orderNumber={order._id}
                  deliveryDate={order.entrega} 
                  onDateChange={handleDateChange}
              /><span style={{ display: 'none' }}>{order.entrega}</span></td>
              <td>{order.material}</td>
              {(order.material.includes("/") ? <td>{formattedPrice}</td>
                : <td>{formattedPrecioUnitario}</td>)}
              <td>{order.cantidad}</td>
              <td>{formattedPrice}</td>
            </tr>
          );
        }
        else if (ordenNumber === 'todos') {

          return (
            <tr key={order.numero}>
              <td><a href={order.img} target='_blank'>{order.numero}</a></td>
              <td className='text-left'>{order.descripcion}</td>
              {/* <td>{order.nombre}</td>
              <td>{order.mail}</td> */}
              <td>{order.fecha}</td>
              <td>{order.division}</td>
              <td className = 'datePicker-td text-center'>
              <DatePickerComponent
              className = 'datePicker'
                 orderNumber={order._id}
                  deliveryDate={order.entrega} 
                  onDateChange={handleDateChange}
              /><span style={{ display: 'none' }}>{order.entrega}</span></td>
              <td>{order.material}</td>
              {(order.material.includes("/") ? <td>{formattedPrice}</td>
                : <td>{formattedPrecioUnitario}</td>)}
              <td>{order.cantidad}</td>
              <td>{formattedPrice}</td>
            </tr>
          );
        }
        else if (ordenNumber === 'bhp') {
          if (order.categoria === '646e2f1943ba97fc705a0276') {
            return (
              <tr key={order.numero}>
                <td><a href={order.img} target='_blank'>{order.numero}</a></td>
                <td className='text-left'>{order.descripcion}</td>
                {/* <td>{order.nombre}</td>
                <td>{order.mail}</td> */}
                <td>{order.contrato}</td>
                <td>{order.fecha}</td>
                <td>{order.division}</td>
                <td className = 'datePicker-td text-center'>
              <DatePickerComponent
              className = 'datePicker'
                 orderNumber={order._id}
                  deliveryDate={order.entrega} 
                  onDateChange={handleDateChange}
              /><span style={{ display: 'none' }}>{order.entrega}</span></td>
                <td>{order.material}</td>
                {(order.material.includes("/") ? <td>{formattedPrice}</td>
                : <td>{formattedPrecioUnitario}</td>)}
                <td>{order.cantidad}</td>
                <td>{formattedPrice}</td>
              </tr>
            );
          }
        }

      }}))
    }
  </tbody>
  <div>
  </div>
        </table>

    </div>                
        </div>
    }
  return (
    <div className="main-container">
      {(status === "paids") ?      <div className="main-title">
                                      <p className="font-weight-bold">ORDENES FACTURADAS</p>
                                  </div>
      :      <div className="main-title">
                <p className="font-weight-bold">ORDENES ABIERTAS</p>
            </div>}
      <hr />
        <OnSearch />
         <Tabs
            id="controlled-tab-example"
            className="my-3"
            onSelect={(k) => {
                setKey(k);
                setTableOrders(orders); // Restablecer la lista de órdenes al valor original al cambiar de pestaña
              }}
            >
            <Tab eventKey="all" title="Ordenes" style={{backgroundColor: 'transparent'}} >
                    {tableModel('todos')}
            </Tab>
            <Tab eventKey="44" title="Codelco #44" style={{backgroundColor: 'transparent'}}>
                    {tableModel(44)}
            </Tab>
            <Tab eventKey="45" title="Codelco #45" style={{backgroundColor: 'transparent'}}>
                    {tableModel(45)}
            </Tab>
            <Tab eventKey="bhp" title="BHP" style={{backgroundColor: 'transparent'}}>
                    {tableModel('bhp')}
            </Tab>
        </Tabs>
        <Button variant="outline-success" onClick={exportToExcel} className="btn-lg">
        Descargar Excel
        </Button>
    </div> 
  )
}
