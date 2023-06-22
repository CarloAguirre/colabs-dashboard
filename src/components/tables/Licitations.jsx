import React, { useEffect, useState } from 'react';
import { useOrdenes } from "../../context";
import { OnSearch } from '../onSearch/OnSearch';

import { format } from 'date-fns';

import { orderUpdate } from '../../helpers/orderUpdate';
import { tokenValidatior } from '../../helpers/tokenValidator';
import { exportToExcel } from '../../helpers/exportToExcel';

import Button from 'react-bootstrap/Button';

import './tables.css';
import '../../App.css';
import { OnSearchLicitations } from '../onSearch/OnSearchLicitation';



export const Licitations = () => {
  const { tableLicitations } = useOrdenes();

  useEffect(() => {
    tokenValidatior();
  }, []);

  const [key, setKey] = useState('all');

  return (
    <div className="main-container">
      <div className="main-title">
        <p className="font-weight-bold">LICITACIONES</p>
      </div>
      <hr />
      <OnSearchLicitations />
      <div className="table-container table-size mt-5">
        <table className="table table-bordered table-striped" id='tabla'>
          <thead>
            <tr>
              <th scope="col">N° DE RESPUESTA</th>
              <th scope="col">N° DE LICITACION</th>
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
        <Button variant="outline-success" onClick={() => exportToExcel()} className="btn-lg">
          Descargar Excel
        </Button>
    </div>
  );
};
