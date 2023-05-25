import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import Form from 'react-bootstrap/Form';
import { useOrdenes } from "../../context"
import { useEffect, useState } from 'react';
import Cookies from 'universal-cookie'
import './tables.css'


export const OrderTable = () => {
    useEffect(() => {
        const cookies = new Cookies();
        const token = cookies.get("token")
        if(!token){
            alert('No tienes acceso al dashboard de administracion, inicia sesión')
            window.location.href = "./"
        }

    }, [])

    const {searchedUser, onSearchInput, onRefreshSubmit, onSearchSubmit, orders  } = useOrdenes()
    
    const [key, setKey] = useState('all')
    const [contratosArray, setContratosArray] =useState([])
    const [tableOrders, setTableOrders] = useState(orders)

    
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
    
    const selectContratoForm = ({target})=>{
        if(target.value === 'todos'){
            const filter = orders.filter(order=> order.contrato != null && order.categoria === "646d30f6df85d0a4c4958449" )
            setTableOrders(filter)
            
        }else{
            const filter = orders.filter(order=> order.contrato === target.value)
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
    <div className="table-container table-size">
        <table className="table table-bordered table-striped">
        <thead>
            <tr>
            <th scope="col">NUMERO</th>
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
        <tbody id='full-list'>

            {
                tableOrders.map(order=>{  
                    const regex = new RegExp(`^${ordenNumber}`);
                    if (regex.test(order.numero) && (order.categoria === "646d30f6df85d0a4c4958449")) {                      
                        return <tr key={order.numero}>
                        <a href={order.img} target='_blank'><td scope="row">{order.numero}</td></a>  
                        { (ordenNumber === 45) && <td scope="row">{order.contrato}</td>  }   
                        <td>{order.descripcion}</td>
                        <td>{order.nombre}</td>
                        <td>{order.mail}</td>
                        <td>{order.fecha}</td>
                        <td>{order.division}</td>
                        <td>{order.entrega}</td>
                        <td>{order.material}</td>
                        <td>{order.precio}</td>
                        <td>{order.cantidad}</td>
                        <td>{order.precio* order.cantidad}</td>
                    </tr>    
                    }
                    else if(ordenNumber === 'todos'){
                        return <tr key={order.numero}>
                         <a href={order.img} target='_blank'><td scope="row">{order.numero}</td></a>  
                        <td>{order.descripcion}</td>
                        <td>{order.nombre}</td>
                        <td>{order.mail}</td>
                        <td>{order.fecha}</td>
                        <td>{order.division}</td>
                        <td>{order.entrega}</td>
                        <td>{order.material}</td>
                        <td>{order.precio}</td>
                        <td>{order.cantidad}</td>
                        <td>{order.precio* order.cantidad}</td>
                    </tr>    
                    }else if(ordenNumber === 'bhp'){
                        if(order.categoria === '646e2f1943ba97fc705a0276'){
                            return <tr key={order.numero}>
                         <a href={order.img} target='_blank'><td scope="row">{order.numero}</td></a>  
                        <td>{order.descripcion}</td>
                        <td>{order.nombre}</td>
                        <td>{order.mail}</td>
                        <td>{order.contrato}</td>
                        <td>{order.fecha}</td>
                        <td>{order.division}</td>
                        <td>{order.entrega}</td>
                        <td>{order.material}</td>
                        <td>{order.precio}</td>
                        <td>{order.cantidad}</td>
                        <td>{order.precio* order.cantidad}</td>
                    </tr>    
                        }
                    }
                })
            }               
        </tbody>
        </table>
    </div>                
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
