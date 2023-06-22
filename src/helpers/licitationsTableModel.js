import Form from 'react-bootstrap/Form';
import { DatePickerComponent } from '../components/DatePickerComponent';
import { handleDateChange } from './handleDateChange';


export const licitationsTableModel = (tableLicitations)=>{

  return (
    <div className="table-container table-size mt-5">
    <table className="table table-bordered table-striped" id='tabla'>
      <thead>
        <tr>
          <th scope="col">N° DE RESPUESTA</th>
          <th scope="col">N° DE LICITACION</th>
          <th scope="col">DESCRIPCIÓN</th>
          <th scope="col">MATERIAL</th>
          <th scope="col">CANTIDAD</th>
          <th scope="col">PRECIO/U</th>
          <th scope="col">TOTAL</th>
        </tr>
      </thead>
      <tbody id='full-list'>
        {(tableLicitations) && tableLicitations.map(licitacion => {
          let price = (Number(licitacion.precio))
          const formattedPrice = price.toLocaleString('en-US', {
              style: 'currency',
              currency: 'USD',
              minimumFractionDigits: 2,
            });
          const formattedPrecioUnitario = (Number(licitacion.precio / Number(licitacion.cantidad))).toLocaleString('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
          });
          return(

            <tr key={licitacion.numero}>
            <td><a href={licitacion.img} target='_blank'>{licitacion.numero}</a></td>
            <td>{licitacion.rfx}</td>
            <td>{licitacion.descripcion}</td>
            <td>{licitacion.material}</td>
            <td>{licitacion.cantidad}</td>
            {(licitacion.material.includes("/") ? <td>{formattedPrice}</td>
              : <td>{formattedPrecioUnitario}</td>)}
            <td>{formattedPrice}</td>             
          </tr>
            )
    })}
      </tbody>
    </table>
  </div>
  )
}
