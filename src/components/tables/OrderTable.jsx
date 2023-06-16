import { useEffect, useState } from 'react';
import { useOrdenes } from "../../context"
import { OnSearch } from '../onSearch/OnSearch';
import { format } from 'date-fns';

import { orderUpdate } from '../../helpers/orderUpdate';
import { tokenValidatior } from '../../helpers/tokenValidator';
import { exportToExcel } from '../../helpers/exportToExcel';

import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import Button from 'react-bootstrap/Button';

import './tables.css'
import'../../App.css'

import { tableModel } from '../../helpers/tableModel';


export const OrderTable = ({status}) => {
  const {orders, tableOrders, setTableOrders, contratosArray, setContratosArray, selectContratoForm, setInputValue } = useOrdenes()

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
                setInputValue("")
              }}
            >
            <Tab eventKey="all" title="Ordenes" style={{backgroundColor: 'transparent'}} >
                    {tableModel('todos', selectContratoForm, contratosArray, monthHeaders, tableOrders, status)}
            </Tab>
            <Tab eventKey="44" title="Codelco #44" style={{backgroundColor: 'transparent'}}>
                    {tableModel(44, selectContratoForm, contratosArray, monthHeaders, tableOrders, status)}
            </Tab>
            <Tab eventKey="45" title="Codelco #45" style={{backgroundColor: 'transparent'}}>
                    {tableModel(45, selectContratoForm, contratosArray, monthHeaders, tableOrders, status)}
            </Tab>
            <Tab eventKey="bhp" title="BHP" style={{backgroundColor: 'transparent'}}>
                    {tableModel('bhp', selectContratoForm, contratosArray, monthHeaders, tableOrders, status)}
            </Tab>
        </Tabs>
        <Button variant="outline-success" onClick={()=> exportToExcel()} className="btn-lg">
        Descargar Excel
        </Button>
    </div> 
  )
}