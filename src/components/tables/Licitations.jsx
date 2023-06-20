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



export const Licitations = () => {
  const { orders, tableOrders, setTableOrders, contratosArray, setContratosArray, selectContratoForm, setInputValue } = useOrdenes();

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
      <OnSearch />
      <div className="table-container table-size mt-5">
        <table className="table table-bordered table-striped" id='tabla'>
          <thead>
            <tr>
              <th scope="col">NUMERO</th>
              <th scope="col">DESCRIPCIÓN</th>
              <th scope="col">FECHA</th>
              <th scope="col">CANTIDAD</th>
            </tr>
          </thead>
          <tbody id='full-list'>
            <tr>
              <td>ALGO</td>
              <td>ALGO</td>
              <td>ALGO</td>
              <td>ALGO</td>
            </tr>
          </tbody>
        </table>
      </div>
        <Button variant="outline-success" onClick={() => exportToExcel()} className="btn-lg">
          Descargar Excel
        </Button>
    </div>
  );
};
