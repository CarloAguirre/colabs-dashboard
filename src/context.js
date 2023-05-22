import { createContext, useState, useEffect, useContext } from "react"
import { colaboradores } from './config/colaboradores';
import { createProducto } from "./helpers/newOrderFetch";
import { infoFetch } from "./helpers/infoFetch";



 const OrdenesContext = createContext({})

 export const OrdenesProvider = ({ children }) =>{

     // input nuevo colaborado config
     const [users, setUsers] = useState(colaboradores);
     const [orders, setOrders] = useState([]);
     
     const [newOrder, setNewOrder] = useState([])
     const [newOrderData, setNewOrderData] = useState([])
     const [counter, setCounter] = useState(Number(users.length));
 
     const [inputValue, setInputValue] = useState("");


     useEffect(() => {
        const fetchData = async()=>{
            const res =  await fetch(`http://localhost:8080/api/productos?limite=1000&desde=0`)
            const orders = await res.json()
            const {productos } = orders;
            setOrders(productos)    
        }
        fetchData();
    }, [])
    
    
     useEffect(() => { 
        
        const orderData = ()=>{
            const orderArray =[]
            let fecha = null;
            const indiceSAP = newOrder.indexOf('Material');
            const indiceValorNeto = newOrder.indexOf("Valor total neto USD");         
            const regexSAP = /\d+\s(\d+)/g;
            let resultados = [];

            newOrder.map(texto=>{
                //Numero de Orden
                if (texto.includes('ORDEN DE COMPRA Nro:')) {
                    orderArray[0] = Number(texto.match(/\d+/)[0]);
                }

                //Fecha
                const fechaMatch = texto.match(/Fecha de Emisión: (.+)/);
                if (fechaMatch) {
                  const fechaTexto = fechaMatch[1].trim();
                  const fecha = new Date(fechaTexto);
                  if (!isNaN(fecha)) {
                    const fechaFormateada = fecha.toLocaleDateString();
                    orderArray[1] = fechaFormateada;
                  }
                }                
                
                function obtenerMesNumero(mesAbreviatura) {
                  const meses = {
                    'Ene': 1,
                    'Feb': 2,
                    'Mar': 3,
                    'Abr': 4,
                    'May': 5,
                    'Jun': 6,
                    'Jul': 7,
                    'Ago': 8,
                    'Sep': 9,
                    'Oct': 10,
                    'Nov': 11,
                    'Dic': 12
                  };
                  return meses[mesAbreviatura];
                }
                //Contrato:
                const regexContrato = /abierto\s(\d+)/;
                const matchContrato = texto.match(regexContrato);

                if (matchContrato) {
                  orderArray[2] = Number(matchContrato[1]);
                }

                //Division
                let segundaPalabra = null;
                const palabras = texto.split(' ');
                if (palabras.length >= 2 && palabras[0] === 'DIVISIÓN') {
                  if(palabras[2]){
                    segundaPalabra = `${palabras[1]} ${palabras[2]}`;
                    orderArray[3] = segundaPalabra;
                  }else{
                    segundaPalabra = palabras[1];
                    orderArray[3] = segundaPalabra;
                  }

                    }
                
                //Fecha de entrega
                let fechaEntrega = null;
                if (texto.startsWith('FECHA DE ENTREGA:')){                  
                  const indiceDosPuntos = texto.indexOf(':');
                  if (indiceDosPuntos !== -1) {
                    const textoDespuesDosPuntos = texto.substring(indiceDosPuntos + 1).trim();
                    const partesFecha = textoDespuesDosPuntos.split('.');
                    if (partesFecha.length === 3) {
                      const dia = parseInt(partesFecha[0], 10);
                      const mesAbreviatura = partesFecha[1];
                      const anio = parseInt(partesFecha[2], 10);
                      const meses = {
                        Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
                        Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11
                      };
                      if (meses.hasOwnProperty(mesAbreviatura)) {
                        const mes = meses[mesAbreviatura];
                        fechaEntrega = new Date(anio, mes, dia).toLocaleDateString();
                        orderArray[4] = fechaEntrega;
                        
                    }
                  }
                }
              }else if (texto.startsWith('FECHA ENTREGA')){ 
                const indiceString = newOrder.indexOf('FECHA ENTREGA');
                const fecha = newOrder[indiceString + 2]
                const partesFecha = fecha.split('.');
                if (partesFecha.length === 3) {
                  const dia = parseInt(partesFecha[0], 10);
                  const mesAbreviatura = partesFecha[1];
                  const anio = parseInt(partesFecha[2], 10);
                  const meses = {
                    Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
                    Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11
                  };
                  if (meses.hasOwnProperty(mesAbreviatura)) {
                    const mes = meses[mesAbreviatura];
                    fechaEntrega = new Date(anio, mes, dia).toLocaleDateString();
                    orderArray[4] = fechaEntrega;       
                }
              }
              }

                //Nombre Gestor de compra
                let textoDespuesDosPuntosNombre = null;
                if (texto.startsWith('Nombre:')) {
                    textoDespuesDosPuntosNombre = texto.substring(7).trim();
                    orderArray[5] = textoDespuesDosPuntosNombre;
                  }

                //Mail Gestor de compra
                const regex = /(?:E-mail|Email):\s*([^\s]+)/i;
                const match = texto.match(regex);               
                if (match) {
                  const email = match[1];
                  orderArray[6] = email
                }

                //SAP/material
                // orderArray[7] = Number(newOrder[indiceSAP + 12].split(' ')[1]);
                // const regexSAP = /\d+\s(\d+)/g;
                // const matches = texto.match(regexSAP);
                
                // if (matches) {
                //   let resultados = [];
                //   matches.map(match => resultados.push(match.split(' ')[1]));
                //   const numerosAgrupados = resultados.join('/');
                //   orderArray[7] = numerosAgrupados
                // }

                if (regexSAP.test(texto)) {
                  const matches = texto.match(regexSAP);
                  
                  if (matches) {
                    const numeros = matches.map(match => match.split(' ')[1]);
                    resultados = resultados.concat(numeros);
                  }
                }

                
                //Cantidad
                orderArray[8] = Number(newOrder[indiceSAP + 15]);

                //precio unitario
                // if(typeof texto)
                let precioUno = newOrder[indiceSAP + 19]
                const onlyNumbers = /^\d+$/.test(precioUno);
                if(onlyNumbers){
                  let precioString = (newOrder[indiceSAP + 19]);
                  orderArray[9] = parseFloat(precioString.replace(',', ''));
                }else{
                  let precioString = (newOrder[indiceValorNeto + 2]);
                  orderArray[9] = parseFloat(precioString.replace(',', ''));
                }

                //Descripcion
                orderArray[10] = newOrder[indiceSAP + 14];
                

            })
            //Precio parte II
            const numerosAgrupados = resultados.join('/');
            orderArray[7] = numerosAgrupados
            //Cantidad
            orderArray[8] = (Number(newOrder[indiceSAP + 15]) - resultados.length) + 1;
            console.log(orderArray)
            setNewOrderData(orderArray)
            
        }
        orderData()
        console.log(newOrderData)
     }, [newOrder])

    // useEffect(() => {
    //   console.log(newOrderData[11])
    // }, [newOrderData])
    
     
     
     const onInputChange = ({target})=>{
     const {name, value} = target;
     setInputValue({
         ...inputValue,
         [name]: value
     })
     };
        
     const onSubmitHandler = (event)=>{
         event.preventDefault();
         createProducto(newOrderData[0], newOrderData[1], newOrderData[2], newOrderData[3], newOrderData[4], newOrderData[5], newOrderData[6], newOrderData[7], newOrderData[8], newOrderData[9], newOrderData[10] )
         }
     
     // buscador de colaborador config
     const fullList = document.getElementById("full-list");
     const filteredList = document.getElementById("filtered-list");
     const [searchedUser, setSearchedUser] = useState("");
 
     const [FilteredArray, setFilteredArray] = useState([]);
 
     const onSearchInput = ({target})=>{
         const {value} = target;
         setSearchedUser(value);
     }
 
     const onSearchSubmit = (event)=>{
         event.preventDefault();
         if(searchedUser != []){   
             const filterUser = users.filter(user => user.nombre.toLowerCase().includes(searchedUser.toLowerCase()));
             if(filterUser[0]){
                 fullList.style.display="none";
                 filteredList.style.display = ""
                 filterUser.forEach(user =>{               
                     setFilteredArray([{
                         id: user.id,
                         nombre: user.nombre,
                         cantidad: user.cantidad,
                         correo: user.correo
                     }])
                 })
                 setSearchedUser("");
                 }else{
                     alert("No existe ningún usuario con ese nombre");
                     setSearchedUser("");
                 }
         }else{               
             alert("Ingresa un nombre!");
         }
     }
 
     const onRefreshSubmit = (event)=>{
         event.preventDefault()
         fullList.style.display = ""
         filteredList.style.display = "none"
 
     }
         
     // stats configs
     let totalMoney = 0;
     let lastColab = 0;
     const [topUser, setTopUser] = useState({
         cantidad: 0,
         nombre: ""
     })
 
     const statsGenerator = ()=>{  
         users.forEach(user=>{
             let name = user.nombre
             let monto = Number(user.cantidad) 
             totalMoney += monto
             
             if(monto > topUser.cantidad){
                 setTopUser({
                     cantidad: monto,
                     nombre: name
                 })
             }
         })
         let lasUserColab = Number(users[users.length-1].cantidad)
         lastColab += lasUserColab
     }
     statsGenerator();


 
  
    const globalState = {
        users,
        setUsers,
        counter,
        setCounter,
        inputValue,
        setInputValue,
        statsGenerator,
        onRefreshSubmit,
        onSearchInput,
        onInputChange,
        onSubmitHandler,
        onSearchSubmit,
        totalMoney,
        lastColab,
        topUser,
        searchedUser,
        setSearchedUser,
        FilteredArray,
        newOrder,
        setNewOrder,
        orders,
        setOrders
      }
        return (
            <OrdenesContext.Provider
              value={globalState}
            >
              {children}
            </OrdenesContext.Provider>
          );

 }

 export const useOrdenes = ()=> useContext(OrdenesContext)