import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import Form from 'react-bootstrap/Form';
import { useOrdenes } from "../../context"
import { useEffect, useState } from 'react';
import Cookies from 'universal-cookie'
import './tables.css'
import'../../App.css'
import { OnSearch } from '../onSearch/OnSearch';


export const OrderTable = ({status}) => {
  const {orders, tableOrders, setTableOrders, contratosArray, setContratosArray, selectContratoForm  } = useOrdenes()

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
        const cookies = new Cookies();
        const token = cookies.get("token")
        if(!token){
            alert('No tienes acceso al dashboard de administracion, inicia sesión')
            window.location.href = "./"
        }

    }, [])

    
    const [key, setKey] = useState('all')
    
    
    // console.log(orders)
    console.log(tableOrders)

    useEffect(() => {
      setTableOrders(orders)
    }, [orders])
    
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
        <table className="table table-bordered table-striped">
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
            <th scope="col">NOMBRE</th>
            <th scope="col">MAIL</th>
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
                <td>{order.descripcion}</td>
                <td>{order.nombre}</td>
                <td>{order.mail}</td>
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
                <td>{order.descripcion}</td>
                <td>{order.nombre}</td>
                <td>{order.mail}</td>
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
                  <td>{order.descripcion}</td>
                  <td>{order.nombre}</td>
                  <td>{order.mail}</td>
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
              <td>{order.descripcion}</td>
              <td>{order.nombre}</td>
              <td>{order.mail}</td>
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
          return (
            <tr key={order.numero}>
              <td><a href={order.img} target='_blank'>{order.numero}</a></td>
              <td>{order.descripcion}</td>
              <td>{order.nombre}</td>
              <td>{order.mail}</td>
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
          if (order.categoria === '646e2f1943ba97fc705a0276') {
            return (
              <tr key={order.numero}>
                <td><a href={order.img} target='_blank'>{order.numero}</a></td>
                <td>{order.descripcion}</td>
                <td>{order.nombre}</td>
                <td>{order.mail}</td>
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

      }}))
    }
  </tbody>
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
    
    </div> 
  )
}
