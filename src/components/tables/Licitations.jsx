import React, { useEffect, useState } from 'react';
import { useOrdenes } from "../../context";
import { OnSearch } from '../onSearch/OnSearch';

import { format } from 'date-fns';

import { orderUpdate } from '../../helpers/orderUpdate';
import { tokenValidatior } from '../../helpers/tokenValidator';
import { exportToExcel } from '../../helpers/exportToExcel';

import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import Button from 'react-bootstrap/Button';

import './tables.css';
import '../../App.css';
import { OnSearchLicitations } from '../onSearch/OnSearchLicitation';
import { licitationsTableModel } from '../../helpers/licitationsTableModel';



export const Licitations = () => {
  const { tableLicitations, orders } = useOrdenes();

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
      <Tabs
            id="controlled-tab-example"
            className="my-3"
            onSelect={(k) => {
                setKey(k);
                // setTableOrders(orders); // Restablecer la lista de órdenes al valor original al cambiar de pestaña
              }}
            >
            <Tab eventKey="en curso" title="En curso" style={{backgroundColor: 'transparent'}} >
                    {licitationsTableModel(tableLicitations, "incomplete", orders)}
            </Tab>
            <Tab eventKey="completadas" title="Completadas" style={{backgroundColor: 'transparent'}}>
                    {licitationsTableModel(tableLicitations, "complete", orders)}
            </Tab>
            
        </Tabs>
        <Button variant="outline-success" onClick={() => exportToExcel()} className="btn-lg">
          Descargar Excel
        </Button>
    </div>
  );
};
