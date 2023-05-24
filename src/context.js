import { createContext, useState, useEffect, useContext } from "react"
import { colaboradores } from './config/colaboradores';

import { cargarImagen } from "./helpers/cargarImagen";
import { createProducto } from "./helpers/newOrderFetch";




 const OrdenesContext = createContext({})

 export const OrdenesProvider = ({ children }) =>{

     // input nuevo colaborado config
     const [users, setUsers] = useState(colaboradores);
     const [orders, setOrders] = useState([]);
     const [archivo, setArchivo] = useState(null); //imagen de la orden ({path:..., name:...})

     const [cliente, setCliente] = useState()
     
     const [newOrder, setNewOrder] = useState([])
     const [newOrderData, setNewOrderData] = useState([])
     const [counter, setCounter] = useState(Number(users.length));
 
     const [inputValue, setInputValue] = useState("");


     useEffect(() => {
        const fetchData = async()=>{
            const res =  await fetch(`http://localhost:8080/api/productos?limite=1000&desde=0`)
            const orders = await res.json()
            const {productos } = orders;
            console.log(productos)
            setOrders(productos)    
        }
        fetchData();
    }, [])
    
    
     useEffect(() => { 
       
       const orderArray =[]
       
       if(cliente === "codelco"){
         const orderData = ()=>{
           let fecha = null;
           const indiceSAP = newOrder.indexOf('Material');
           const indiceValorNeto = newOrder.indexOf("Valor total neto USD");         
           const regexSAP = /\d+\s(\d+)/g;
          let resultados = [];
         
            newOrder.map((texto, index)=>{
                //Numero de Orden
                if (texto.includes('ORDEN DE COMPRA')) {
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
                        Ene: 0, Feb: 1, Mar: 2, Abr: 3, May: 4, Jun: 5,
                        Jul: 6, Ago: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11
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
                    Ene: 0, Feb: 1, Mar: 2, Abr: 3, May: 4, Jun: 5,
                    Jul: 6, Ago: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11
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
                let precioUno = newOrder[indiceSAP + 19];
                const onlyNumbersAndSymbols = /^[\d,.]+$/.test(precioUno);
                if (onlyNumbersAndSymbols) {
                  let precioString = newOrder[indiceSAP + 19];
                  orderArray[9] = parseFloat(precioString.replace(',', ''));
                } else {
                  let precioString = newOrder[indiceValorNeto + 2];
                  orderArray[9] = parseFloat(precioString.replace(',', ''));
                }

                //Descripcion
                orderArray[10] = newOrder[indiceSAP + 14];

            })
            //SAP parte II
            const numerosAgrupados = resultados.join('/');
            orderArray[7] = numerosAgrupados
            //Cantidad
            orderArray[8] = (Number(newOrder[indiceSAP + 15]) - resultados.length) + 1;
            
          }
          orderData()


        //  BHP - ESCONDIDA //

        }else if(cliente === "bhp"){
          const regexSAP = /\d+\s(\d+)/g;
          const indiceDescripcion = newOrder.indexOf('Description');
          const contactIndex = newOrder.indexOf('Contact Information');
          const locationIndex = newOrder.indexOf('Location Code:');
          let statusIndex = newOrder.indexOf('STATUS')

          let resultados = [];
          newOrder.map((texto, index)=>{
            
            //Numero
            const match = texto.match(/450(\d*)/);
            if (match) {
              orderArray[0] = Number(match[0])
            }

            //Fecha
            const matchFecha = texto.match(/(\d+)\s+([a-zA-Z]+)(?:,\s+)?(\d+)/) || texto.match(/\b(\d{1,2})\s+([a-zA-Z]+)\s+(\d{4})\b/);
            if (matchFecha) {
              const [, day, month, year] = matchFecha;
              let fechaConvertida;
            
              if (month.length > 2) {
                // Formato '8 May, 2018'
                const date = new Date(`${month} ${day}, ${year}`);
                const dayFormatted = ('0' + date.getDate()).slice(-2);
                const monthFormatted = ('0' + (date.getMonth() + 1)).slice(-2);
                const yearFormatted = date.getFullYear();
                fechaConvertida = `${dayFormatted}/${monthFormatted}/${yearFormatted}`;
              } else {
                // Formato '7 Jul 2020'
                const date = new Date(`${day} ${month} ${year}`);
                const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
                fechaConvertida = date.toLocaleDateString('en-GB', options).replace(/\//g, '-');
              }
            
              orderArray[1] = fechaConvertida;
            }

            //telefono
            if (texto.includes('Telephone' || 'TELEPHONE')) {
              orderArray[2] = newOrder[index - 1]
              //Division
              orderArray[3] = newOrder[8]
  
              //Fecha de entrega
              const word = newOrder[indiceDescripcion + 33].replace('.', '/')
              orderArray[4] = word.replace('.', '/')
            }else{
              let telefono = newOrder[contactIndex + 4]
              const telefonoMatch = telefono.match(/\+[\d\s()]+/);

              if (telefonoMatch) {
                orderArray[2] = telefonoMatch[0];              
                orderArray[3] = newOrder[locationIndex + 3]
                let fechaString = newOrder[indiceDescripcion + 23]
                  const date = new Date(fechaString);
                  const day = date.getDate();
                  const month = date.getMonth() + 1; // Los meses en JavaScript comienzan desde 0
                  const year = date.getFullYear();
                  orderArray[4] = `${day.toString().padStart(2, '0')}/${month.toString().padStart(2, '0')}/${year}`;
              }      
            }


            //Nombre gestor de la compra
            if (texto.includes('Purchasing Contact' || 'PURCHASING CONTACT')) {
              orderArray[5] = newOrder[index - 1]

              //Mail gestor de la compra
              orderArray[6] = newOrder[index + 5]
            }else{
              if (texto.includes("@bhp.com")) {
                const mailPartes = texto.split(' ');
                if (mailPartes[2]) {
                  orderArray[6] = mailPartes[2];
                } else {
                  orderArray[6] = mailPartes[1];
                }
                orderArray[5] = newOrder[contactIndex + 2]
              }
          }

            //SAP material
            const regexSAP = /\b10\d{6,}\b/g;
            if (regexSAP.test(texto)) {
              const matches = texto.match(regexSAP);
              if (matches) {
                const filteredMatches = matches.filter(match => /^\d+$/.test(match));
                resultados = resultados.concat(filteredMatches);
              }
            }
            
            //cantidad / PRECIO /DESCRIPCION
            if(newOrder.includes('STATUS')){              
                orderArray[8] = newOrder[statusIndex + 1]  
                
                const precio = newOrder[statusIndex -10 ] 
                const regexDolares = /[\d,]+(?:\.\d+)?/;
                const matchDolares = precio.match(regexDolares);
                if (matchDolares) {
                  const numeroDolares = matchDolares[0].replace(/,/g, ''); // Remover las comas si están presentes
                  orderArray[9] = numeroDolares         
                }    
                orderArray[10] = newOrder[statusIndex - 1]  

            }else{
              orderArray[8] = newOrder[indiceDescripcion + 17]
              orderArray[9] = newOrder[indiceDescripcion + 27]
              orderArray[10] = newOrder[indiceDescripcion + 23]
            }


            //Descripcion:
            





          })
          const numerosAgrupados = resultados.join('/');
          orderArray[7] = numerosAgrupados
        }
        setNewOrderData(orderArray)
        console.log(orderArray)
     }, [newOrder])
     
     
     const onInputChange = ({target})=>{
     const {name, value} = target;
     setInputValue({
         ...inputValue,
         [name]: value
     })
     };
        
     const onSubmitHandler = async (event) => {
      event.preventDefault();

      const categoria = event.target.name
      
      try {
        const createOrder = await createProducto(newOrderData[0], newOrderData[1], newOrderData[2], newOrderData[3], newOrderData[4], newOrderData[5], newOrderData[6], newOrderData[7], newOrderData[8], newOrderData[9], newOrderData[10], categoria);
    
        if (createOrder) {
          await cargarImagen(archivo);
        } else {
          alert('No has cargado ninguna orden');
        }
      } catch (error) {
        console.error(error);
      }
    };

        useEffect(() => {
          console.log(archivo)
        }, [archivo])

     
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
        setOrders,
        archivo,
        setArchivo,
        cliente, 
        setCliente
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