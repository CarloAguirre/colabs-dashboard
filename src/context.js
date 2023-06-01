import { createContext, useState, useEffect, useContext } from "react"
import { colaboradores } from './config/colaboradores';

import { cargarImagen } from "./helpers/cargarImagen";
import { createProducto } from "./helpers/newOrderFetch";
import { orderUpdate } from "./helpers/orderUpdate";
import { serverPath } from "./config/serverPath";
import { format, parse } from 'date-fns';
import es from 'date-fns/locale/es';




 const OrdenesContext = createContext({})

 export const OrdenesProvider = ({ children }) =>{

     // input nuevo colaborado config
    //  const [users, setUsers] = useState(colaboradores);
     const [orders, setOrders] = useState([]);
     const [archivo, setArchivo] = useState(null); //imagen de la orden ({path:..., name:...})
     const [tableOrders, setTableOrders] = useState(orders)
     const [invoice, setInvoice] = useState(null)
     const [invoiceDate, setInvoiceDate] = useState()

     const [cliente, setCliente] = useState()

    const [contratosArray, setContratosArray] =useState([])
     
     const [newOrder, setNewOrder] = useState([])
     const [newOrderData, setNewOrderData] = useState([])
     const [counter, setCounter] = useState(0);
 
     const [inputValue, setInputValue] = useState("");

     useEffect(() => {
       console.log(newOrder)
     }, [newOrder])
     
    //  useEffect(() => {
    //   const payOrderFetch = ()=>{
    //     payOrder(invoice, invoiceDate)
    //   }
    //   payOrderFetch()
    //  }, [invoiceDate])
     

     useEffect(() => {
        const fetchData = async()=>{
            const res =  await fetch(`${serverPath}api/productos?limite=1000&desde=0`)
            const orders = await res.json()
            const {productos } = orders;
            console.log(productos)
            setOrders(productos)    
        }
        fetchData();
    }, [])

    useEffect(() => {
      let counter = 0
      orders.map(order=>{
        if(order.completada === false){
          counter += 1
        }
        setCounter(counter)
      })
    }, [orders])
    
    
    
     useEffect(() => { 
       
       const orderArray =[]
       let mayorNumero = 0;
      let indiceMayorNumero = -1;
       if(cliente === "codelco"){
         const orderData = ()=>{
           let fecha = null;
           const indiceSAP = newOrder.indexOf('Material');
           const indiceUnidades = newOrder.indexOf('Unidades');
           const indiceDesc = newOrder.indexOf('Descripción del ítem:');
           const indiceValorNeto = newOrder.indexOf("Valor total neto USD");         
           const regexSAP = /(?:^|\D)(\d{7})(?!\d|\w|\D)/g;
          


          let resultados = [];
         
            newOrder.map((texto, index)=>{
                //Numero de Orden
                if (texto.includes('ORDEN DE COMPRA')) {
                    orderArray[0] = Number(texto.match(/\d+/g));
                }

                //Fecha
                const fechaMatch = texto.match(/Fecha de Emisión: (.+)/);
                if (fechaMatch) {
                  const fechaTexto = fechaMatch[1].trim();
                  const fecha = new Date(fechaTexto);
                  if (!isNaN(fecha)) {        
                    const fechaFormateada = format(fecha, 'dd/MM/yyyy');
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
                
               // Entrega


              let fechaEntrega = null;
              if (texto.startsWith('FECHA DE ENTREGA:')) {
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
                    fechaEntrega = format(new Date(anio, mes, dia), 'dd/MM/yyyy');
                    orderArray[4] = fechaEntrega;
                  }
                }
              }
              } else if (texto.startsWith('FECHA ENTREGA')) {
              const indiceString = newOrder.indexOf('FECHA ENTREGA');
              const fecha = newOrder[indiceString + 2];
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
                  fechaEntrega = format(new Date(anio, mes, dia), 'dd/MM/yyyy');
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
                if(texto.split( " " ).length < 3){
                    
                  const matches = texto.match(regexSAP);
                
                  if (matches) {
                    matches.forEach(match => {
                      const numeros = match.match(/\d{7}/g); // Obtener solo los números de 7 dígitos
                      resultados = resultados.concat(numeros);
                    });
                  }
                }
              // }
                //precio unitario
                // if(typeof texto)
                const divisaRegex = /^\d{1,3}([.,]\d{3})*([.,]\d{2})?$/; // Expresión regular para el formato de divisa

                const numero = parseFloat(texto.replace(/[,.]/g, '').replace(',', '.'));
                
                if (divisaRegex.test(texto) && numero > mayorNumero) {
                  mayorNumero = numero;
                  indiceMayorNumero = index;
                }
                
                if (indiceMayorNumero !== -1) {
                  const precioString = newOrder[indiceMayorNumero];
                  let precio;
                
                  if (divisaRegex.test(precioString)) {
                    // Formato 5.626,04 o Formato 5,626.04
                    if (precioString.indexOf(".") < precioString.indexOf(",")) {
                      precio = parseFloat(precioString.replace(/[,.]/g, '').replace(',', '.')) / 100;
                    } else {
                      precio = parseFloat(precioString.replace(/[,.]/g, '') / 100);
                    }
                  } else if (precioString.includes(".")) {
                    // Formato 5,626.04
                    precio = parseFloat(precioString.replace(/[,.]/g, '').replace(',', '.')) / 100;
                  } else if (precioString.includes(",")) {
                    // Formato 5.626,04
                    precio = parseFloat(precioString.replace(/[,.]/g, '') / 100);
                  } else {
                    // Formato sin separador de miles y decimales
                    precio = parseFloat(precioString) / 100;
                  }
                
                  orderArray[9] = Number(precio);
                }
                //Descripcion
                if (indiceDesc !== -1) {
                  const description = newOrder[indiceDesc + 2];
                  const descriptionArray = description.split(" ");
                
                  if (descriptionArray.length < 2) {
                    orderArray[10] = `${descriptionArray[0]}`;
                  } else if (descriptionArray.length < 3) {
                    orderArray[10] = `${descriptionArray[0]} ${descriptionArray[1]}`;
                  } else if (descriptionArray.length < 4) {
                    orderArray[10] = `${descriptionArray[0]} ${descriptionArray[1]} ${descriptionArray[2]} `;
                  } else if (descriptionArray.length >= 4) {
                    orderArray[10] = `${descriptionArray[0]} ${descriptionArray[1]} ${descriptionArray[2]} ${descriptionArray[3]} `;
                  }
                } else {
                  orderArray[10] = newOrder[indiceSAP + 14];
                }
                
                

            })
            //SAP parte II
            const numerosAgrupados = resultados.join('/');
            orderArray[7] = numerosAgrupados

            //Cantidad
            const contadorUnidades = newOrder.reduce((contador, texto, index) => {
              if (texto === 'Unidades') {
                return contador + 1;
              }
              return contador;
            }, 0);
            
           // Cantidad
            if (contadorUnidades === 1) {
              const indiceUnidades = newOrder.indexOf('Unidades');
              orderArray[8] = Number(newOrder[indiceUnidades - 2]);
            } else if (contadorUnidades > 1) {
              const sumaUnidades = newOrder.reduce((suma, texto, index) => {
                if (texto === 'Unidades') {
                  const valorUnidades = Number(newOrder[index - 2]);
                  if (!isNaN(valorUnidades)) {
                    return suma + valorUnidades;
                  }
                }
                return suma;
              }, 0);
              orderArray[8] = sumaUnidades;
            } else {
              orderArray[8] = Number(newOrder[indiceSAP + 15]) - resultados.length + 1;
            }        
            }
          orderData()

        //  BHP - ESCONDIDA //

        }else if(cliente === "bhp"){
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
            const regexDolares = /[\d,]+(?:\.\d+)?/;
            if (newOrder.includes('STATUS')) {
              orderArray[8] = newOrder[statusIndex + 1];           
              const precio = newOrder[statusIndex - 10];
              const matchDolares = precio.match(regexDolares);
              if (matchDolares) {
                const amountNumeric = parseFloat(matchDolares[0].replace(',', ''));
                orderArray[9] = amountNumeric;
              }
              orderArray[10] = newOrder[statusIndex - 1];
            } else {
              orderArray[8] = newOrder[indiceDescripcion + 17];
              const amount = newOrder[indiceDescripcion + 27];
              const amountNumeric = parseFloat(amount.replace(',', ''));
              orderArray[9] = amountNumeric;
              orderArray[10] = newOrder[indiceDescripcion + 23];
            }
          })
          const numerosAgrupados = resultados.join('/');
          orderArray[7] = numerosAgrupados

        }else if(cliente === "invoice"){
          const poNumberIndex = newOrder.indexOf('PO Number')
          
          if(poNumberIndex){
            const paidOrderNumber = Number(newOrder[poNumberIndex + 2])
            console.log(paidOrderNumber)
            console.log(orders[0].numero)
       
            const paidOrderId = orders.find(order => order.numero === paidOrderNumber)?._id;
              if(paidOrderId){
                //Fecha invoice
                let fechaFormatted = null;
                const patronFecha = /\d{2}\/\d{2}\/\d{4}/;
                const coincidencias = newOrder[0].match(patronFecha);
                const fecha = coincidencias[0];
                if(fecha){
                  const fechaDate = new Date(fecha)
                    fechaFormatted = format(fechaDate, 'dd/MM/yyyy');
                    
                }
                setInvoiceDate(fechaFormatted)      
                setInvoice(paidOrderId) 
              }else{
                alert(`No existe la orden N°${paidOrderNumber} en la base de datos.`)
              }
          }

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
      
      const existeProducto = orders.find(order=> order.numero === newOrderData[0])
      if(existeProducto){
        alert(`La Orden N°${newOrderData[0]} ya existe en la base de datos`)
        return
      }
       
      const categoria = event.target.name
      
      if(categoria === 'invoice'){
        try {   
          // const invoiceString = parse(invoice, 'dd/MM/yyyy', new Date(), { locale: es });
          const invoiceDateString = parse(invoiceDate, 'dd/MM/yyyy', new Date(), { locale: es });
          
          // const formattedInvoice = format(invoiceString, 'dd/MM/yyyy');
          const formattedInvoiceDate = format(invoiceDateString, 'dd/MM/yyyy');
          await orderUpdate(invoice, formattedInvoiceDate)
          await cargarImagen(archivo, invoice);
        } catch (error) {
          console.log(error)
        }       
      }else{ 
        try {
          const dateString = parse(newOrderData[1], 'dd/MM/yyyy', new Date(), { locale: es });
          const deliveryDateString = parse(newOrderData[4], 'dd/MM/yyyy', new Date(), { locale: es });

          const formattedDate = format(dateString, 'dd/MM/yyyy');
          const formattedDelivery = format(deliveryDateString, 'dd/MM/yyyy');
          const createOrder = await createProducto(newOrderData[0], formattedDate, newOrderData[2], newOrderData[3], formattedDelivery, newOrderData[5], newOrderData[6], newOrderData[7], newOrderData[8], newOrderData[9], newOrderData[10], categoria);
          
          if (createOrder) {
            await cargarImagen(archivo, null);
          } 
        } catch (error) {
          console.error(error);
        }
      }
    };

        useEffect(() => {
          console.log(archivo)
        }, [archivo])

     
     // buscador de colaborador config
     const fullList = document.getElementById("full-list");
     const filteredList = document.getElementById("filtered-list");
     
     const [searchedOrder, setSearchedOrder] = useState("");
     const [FilteredArray, setFilteredArray] = useState([]);
 
     const onSearchInput = ({ target }) => {
      const { value } = target;
      setSearchedOrder(value);
    }
    
    useEffect(() => {
      const filteredOrders = orders.filter(order => {
        for (let key in order) {
          if (order.hasOwnProperty(key)) {
            const value = order[key];
            const lowercaseValue = typeof value === 'string' ? value.toLowerCase() : value?.toString().toLowerCase();
            const lowercaseSearch = searchedOrder.toLowerCase();
    
            if (lowercaseValue && lowercaseValue.includes(lowercaseSearch)) {
              return true;
            }
          }
        }
        return false;
      });
    
      setTableOrders(filteredOrders);
    }, [searchedOrder, orders]);
    
     const onRefreshSubmit = (event)=>{
         event.preventDefault()
         setTableOrders(orders)
     }

     const selectContratoForm = ({target})=>{
      if(target.value === 'todos'){
          const filter = orders.filter(order=> order.contrato != null && order.categoria === "646d30f6df85d0a4c4958449" )
          setTableOrders(filter)
          
      }else{
          const filter = orders.filter(order=> order.contrato === target.value)
          setTableOrders(filter)
      }
  }

  const selectReportsForm = ({target})=>{
    if(target.value === 'todos'){
        setTableOrders(orders)
        
    }else{
        const filter = orders.filter(order=> order.contrato === target.value)
        setTableOrders(filter)
    }
}
         
     // stats configs
     let totalMoney = 0;
     let warningOrder = "Sin atrasos";
     const [topUser, setTopUser] = useState({
       cantidad: 0,
       nombre: ""
     });
     
     const statsGenerator = () => {
       let oldestOrder = null; // Variable para almacenar la orden más antigua
     
       orders.forEach(order => {
         let monto = Number(order.precio);
         totalMoney += monto;
     
         const [day, month, year] = order.entrega.split("/");
         const entregaDate = new Date(Number(year), Number(month) - 1, Number(day));
     
         if (
           entregaDate < new Date() &&
           order.completada === false
         ) {
           if (!oldestOrder || entregaDate < oldestOrder.entregaDate) {
             oldestOrder = {
               entregaDate,
               numero: order.numero
             };
           }
         }
     
         if (monto > topUser.cantidad) {
           setTopUser({
             cantidad: order.precio,
             nombre: order.numero
           });
         }
       });
     
       if (oldestOrder) {
         warningOrder = oldestOrder.numero;
       }
     };
     
     statsGenerator();
     


 
  
    const globalState = {
        counter,
        setCounter,
        inputValue,
        setInputValue,
        statsGenerator,
        onRefreshSubmit,
        onSearchInput,
        onInputChange,
        onSubmitHandler,
        totalMoney,
        warningOrder,
        topUser,
        searchedOrder,
        setSearchedOrder,
        FilteredArray,
        newOrder,
        setNewOrder,
        orders,
        setOrders,
        archivo,
        setArchivo,
        cliente, 
        setCliente,
        tableOrders,
        setTableOrders,
        contratosArray,
        setContratosArray,
        selectContratoForm,
        selectReportsForm
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