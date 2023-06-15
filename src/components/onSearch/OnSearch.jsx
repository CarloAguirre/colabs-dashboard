import { useEffect, useState } from "react"
import { useOrdenes } from "../../context"

export const OnSearch = () => {
    const { onSearchInput, searchedOrder, inputValue, setSearchedOrder } = useOrdenes()

    const [placeholder, setPlaceholder] = useState('Buscar')

    useEffect(() => {
      setPlaceholder(inputValue ? inputValue : 'Buscar')
      setSearchedOrder(inputValue)
    }, [inputValue])

    return (
        <div className='search-reset_inputs'>
            <form action="">  
                <input
                    type="text"
                    name='buscarNombre'
                    onChange={onSearchInput}
                    placeholder={placeholder}
                    value={searchedOrder}
                    title="Escribe 'atrasos', 'atrasadas' o 'atrasados' para ver ordenes con atraso."
                />               
            </form>           
        </div>
    )
}
