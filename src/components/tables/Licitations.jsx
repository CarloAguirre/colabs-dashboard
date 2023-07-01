import React, { useEffect, useState } from 'react';
import { useOrdenes } from "../../context";

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
  const { orders, licitations } = useOrdenes();
  const [ordenAscendente, setOrdenAscendente] = useState(true);

  useEffect(() => {
    tokenValidatior();
  }, []);


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
            >
            <Tab eventKey="en curso" title="En curso" style={{backgroundColor: 'transparent'}} >
                    {licitationsTableModel("incomplete", orders, ordenAscendente, setOrdenAscendente, licitations)}
            </Tab>
            <Tab eventKey="completadas" title="Completadas" style={{backgroundColor: 'transparent'}}>
                    {licitationsTableModel("complete", orders, ordenAscendente, setOrdenAscendente, licitations)}
            </Tab>
            
        </Tabs>
        <Button variant="outline-success" onClick={() => exportToExcel()} className="btn-lg">
          Descargar Excel
        </Button>
    </div>
  );
};
