import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import Form from 'react-bootstrap/Form';
import { useOrdenes } from "../../context"
import { useEffect, useState } from 'react';


export const OrderTable = () => {

    const {FilteredArray, searchedUser, onSearchInput, onRefreshSubmit, onSearchSubmit, orders  } = useOrdenes()
    
    const [key, setKey] = useState('home')
    const [contratosArray, setContratosArray] =useState([])
    const [tableOrders, setTableOrders] = useState(orders)

    console.log(orders)
    console.log(tableOrders)

    useEffect(() => {
      setTableOrders(orders)
    }, [orders])
    
    useEffect(() => {
        
        const contratosList =()=>{
            let array = [];
            orders.map(orden=>{
                if(orden.contrato != null && !array.includes(orden.contrato))
                array.push(orden.contrato)
            })
            setContratosArray(array)
        }
        contratosList();

    }, [orders])
    
    const selectContratoForm = ({target})=>{
        if(target.value === 'todos'){
            const filter = orders.filter(order=> order.contrato != null)
            setTableOrders(filter)
            
        }else{
            const filter = orders.filter(order=> order.contrato === Number(target.value))
            setTableOrders(filter)
        }       
    }

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
        <table className="table table-bordered table-striped">
        <thead>
            <tr>
            <th scope="col">NUMERO</th>
            { (ordenNumber === 45) && <th scope="col">CONTRATO</th>   }   
            <th scope="col">DESCRIPCIÓN</th>                  
            <th scope="col">NOMBRE</th>
            <th scope="col">MAIL</th>
            <th scope="col">FECHA</th>
            <th scope="col">DIVISION</th>
            <th scope="col">ENTREGA</th> 
            <th scope="col">SAP</th>
            <th scope="col">PRECIO/U</th>
            <th scope="col">CANTIDAD</th> 
            <th scope="col">TOTAL</th>
            </tr>
        </thead>
        <tbody id='full-list'>

            {
                tableOrders.map(order=>{  
                    const regex = new RegExp(`^${ordenNumber}`);
                    if (regex.test(order.numero)) {                      
                        return <tr key={order.numero}>
                        <td scope="row">{order.numero}</td>  
                        { (ordenNumber === 45) && <td scope="row">{order.contrato}</td>  }   
                        <th scope="row">{order.descripcion}</th>
                        <td scope="row">{order.nombre}</td>
                        <td scope="row">{order.mail}</td>
                        <td scope="row">{order.fecha}</td>
                        <td scope="row">{order.division}</td>
                        <td scope="row">{order.entrega}</td>
                        <td scope="row">{order.material}</td>
                        <td scope="row">{order.precio}</td>
                        <td scope="row">{order.cantidad}</td>
                        <td scope="row">{order.precio* order.cantidad}</td>
                    </tr>    
                    }
                })
            }               
        </tbody>
        </table>
        </div>
    }
  return (
    <div className="main-container">
         <div className='search-reset_inputs'>
            <form action="" onSubmit={onSearchSubmit}>  
                <input type="text" name='buscarNombre' onChange={onSearchInput} placeholder='Buscar' value={searchedUser}></input>
                <button type='submit'><span className="material-icons-outlined">                           
                    search   
                </span></button>
            </form>
            <form action="" onSubmit={onRefreshSubmit}>
                <button type='submit'><span className="material-icons-outlined">                           
                    refresh  
                </span></button>
            </form>
        </div>
         <Tabs
            id="controlled-tab-example"
            activeKey={key}
            onSelect={(k) => setKey(k)}
            className="my-3"
            >
            <Tab eventKey="home" title="#44" style={{backgroundColor: 'transparent'}}>
                {tableModel(44)}
            </Tab>
            <Tab eventKey="profile" title="#45" style={{backgroundColor: 'transparent'}}>
                {tableModel(45)}
            </Tab>
            <Tab eventKey="contact" title="Contact" disabled>
                Tab content for Contact
            </Tab>
        </Tabs>
    
    </div> 
  )
}
