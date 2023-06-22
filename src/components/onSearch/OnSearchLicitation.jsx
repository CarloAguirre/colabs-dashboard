import { useEffect, useState } from "react"
import { useOrdenes } from "../../context"

export const OnSearchLicitations = () => {
    const { onSearchLicitationsInput, searchedLicitation, inputLicitationsValue, setSearchedLicitation  } = useOrdenes()

    const [placeholder, setPlaceholder] = useState('Buscar')

    useEffect(() => {
        setSearchedLicitation(inputLicitationsValue)
    }, [inputLicitationsValue])

    return (
        <div className='search-reset_inputs'>
            <form action="">  
                <input
                    type="text"
                    name='buscarNombre'
                    onChange={onSearchLicitationsInput}
                    placeholder={placeholder}
                    value={searchedLicitation}
                    // title="Filtra por cualquier palabra o numero (shortcut: 'atrasos', 'atrasadas' o 'atrasados' para ver ordenes con atraso.)"
                />               
            </form>           
        </div>
    )
}
