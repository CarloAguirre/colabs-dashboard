import { useOrdenes } from "../../context"


export const OnSearch = () => {
    const {onSearchInput, searchedOrder} = useOrdenes()
  return (
    <div className='search-reset_inputs'>
        <form action="">  
            <input type="text" name='buscarNombre' onChange={onSearchInput} placeholder='Buscar' value={searchedOrder}></input>               
        </form>           
    </div>
  )
}
