import Form from 'react-bootstrap/Form';
import { DatePickerComponent } from '../components/DatePickerComponent';
import { handleDateChange } from './handleDateChange';


export const tableModel = (ordenNumber, selectContratoForm, contratosArray, monthHeaders, tableOrders, status)=>{

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
  </table>

</div>                
  </div>
}