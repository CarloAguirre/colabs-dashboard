import { useOrdenes } from "../../context"


export const OrderTable = () => {

    const {FilteredArray, searchedUser, onSearchInput, onRefreshSubmit, onSearchSubmit, orders  } = useOrdenes()

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
    <table className="table">
            <thead>
                <tr>
                <th scope="col">NUMERO</th>
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
                    orders.map(order=>{  
                    
                    return <tr key={order.numero}>
                            <a href=""> <td scope="row">{order.numero}</td></a>   
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
                    })
                }
                
            </tbody>
            <tbody id='filtered-list'>
                {
                        FilteredArray.map(user=>{  
                        let monto = Number(user.cantidad)
                        return <tr key={user.id}>
                                <th scope="row">{user.id}</th>
                                <td>{user.nombre}</td>
                                <td>${monto.toLocaleString()}</td>
                                <td>{user.correo}</td>
                            </tr>   
                        })
                    }
            </tbody>
            </table>
    </div> 
  )
}
