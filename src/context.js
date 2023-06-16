import { createContext, useState, useEffect, useContext } from "react"

import { cargarImagen } from "./helpers/cargarImagen";
import { createProducto } from "./helpers/newOrderFetch";
import { orderUpdate } from "./helpers/orderUpdate";
import { serverPath } from "./config/serverPath";
import { format, parse } from 'date-fns';
import es from 'date-fns/locale/es';
import { counterOrdersTotalprice } from "./helpers/counter";
import { pdfInfoExtractor } from "./helpers/pdfInfoExtractor";


 const OrdenesContext = createContext({})

 export const OrdenesProvider = ({ children }) =>{

    const [orders, setOrders] = useState([]);
    const [archivo, setArchivo] = useState(null); //imagen de la orden ({path:..., name:...})
    const [tableOrders, setTableOrders] = useState(orders)
    const [invoice, setInvoice] = useState(null)
    const [invoiceDate, setInvoiceDate] = useState()

    const [cliente, setCliente] = useState()

    const [contratosArray, setContratosArray] =useState([])

    const [proyecciones, setProyecciones] = useState([])
    const [ventas, setVentas] = useState([])
     
    const [newOrder, setNewOrder] = useState([])
    const [newOrderData, setNewOrderData] = useState([])
    const [paidOrdersLastYear, setPaidOrdersLastYear] = useState(0);

    const [inputValue, setInputValue] = useState("");


     useEffect(() => {
        const fetchData = async()=>{
            const res =  await fetch(`${serverPath}api/productos?limite=1000&desde=0`)
            const orders = await res.json()
            const {productos } = orders;
            setOrders(productos)    
        }
        fetchData();
    }, [])

    useEffect(() => {
      let counter = counterOrdersTotalprice(orders)
        setPaidOrdersLastYear(counter);
    }, [orders]);    
    
    
    //Generador de informacion para la nueva orden agregada.
     useEffect(() => {    
      pdfInfoExtractor(tableOrders, orders, newOrder, cliente, setInvoiceDate, setInvoice, setNewOrderData)
     }, [newOrder])
     
     
     
     const onInputChange = ({target})=>{
     const {name, value} = target;
     setInputValue({
         ...inputValue,
         [name]: value
     })
     };
        
     const [spinnerSwitch, setSpinnerSwitch] = useState(false)
     const onSubmitHandler = async (event) => {

      setSpinnerSwitch(true)
      event.preventDefault();
      
      const existeProducto = orders.find(order=> order.numero === newOrderData[0])
      if(existeProducto){
        alert(`La Orden N°${newOrderData[0]} ya existe en la base de datos`)
        setSpinnerSwitch(false)
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
          const createOrder = await createProducto(newOrderData[0], formattedDate, newOrderData[2], newOrderData[3], formattedDelivery, newOrderData[5], newOrderData[6], newOrderData[7], newOrderData[8], newOrderData[9], newOrderData[10], categoria, newOrderData[11]);
          
          if (createOrder) {
            await cargarImagen(archivo, null);
          } 
        } catch (error) {
          console.error(error);
          alert("Ha habido un problema, vuelve a intentarlo mas tarde o comunicate con el programador carlo_aguirre@outlook.cl....¿Estas seguro que subiste el formato de orden correcto?")
         setSpinnerSwitch(false)

        }
      }
    };

     
     const [searchedOrder, setSearchedOrder] = useState("");
     const [FilteredArray, setFilteredArray] = useState([]);
 
     const onSearchInput = ({ target }) => {
      const { value } = target;
      if(value === ""){
        setInputValue("")
        setSearchedOrder("")
      }else{
        setSearchedOrder(value);

      }
    }
   
    
    useEffect(() => {
      let filteredOrders = null
      if (searchedOrder.toLowerCase() === "atrasos" || searchedOrder.toLowerCase() === "atrasadas" || searchedOrder.toLowerCase() === "atrasados") {
        const currentDate = new Date();
        filteredOrders = orders.filter(order => {
          const entregaDateParts = order.entrega.split("/");
          const entregaDate = new Date(
            entregaDateParts[2],
            entregaDateParts[1] - 1,
            entregaDateParts[0]
          );
          return !order.completada && entregaDate < currentDate;
        });
      }      
      else{
        filteredOrders = orders.filter(order => {
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
        
      }
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
     let totalDebt = 0;
     let totalAtrasos = 0;
     let warningOrder = "Sin atrasos";
     const [topUser, setTopUser] = useState({
       cantidad: 0,
       nombre: ""
     });
     
     const statsGenerator = () => {
       let oldestOrder = null; // Variable para almacenar la orden más antigua
     
       orders.forEach(order => {
  
         let monto = Number(order.precio);
         if(!order.completada){
           totalMoney += monto;
         }
     
         const [day, month, year] = order.entrega.split("/");
         const entregaDate = new Date(Number(year), Number(month) - 1, Number(day));
     
         if (
           entregaDate < new Date() &&
           order.completada === false
         ) {
          totalDebt += monto
          totalAtrasos += 1
         }
     
         if (monto > topUser.cantidad) {
           setTopUser({
             cantidad: order.precio,
             nombre: order.numero
           });
         }
       });
     };
     
     statsGenerator();
     


     const months = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];


      
      const calculateProjectionPrice = (month) => {
        const projectedOrders = [];
        
        orders.forEach((order) => {
          if (order.completada === false) {
            const formattedDeliveryDate = order.entrega.replace(/(\d{1,2})\/(\d{1,2})\/(\d{4})/, '$2/$1/$3');
          const deliveryDate = new Date(formattedDeliveryDate);
          const deliveryMonth = deliveryDate.getMonth();
          
          const currentYear = new Date().getFullYear();
          const currentDate = new Date();
          const minDeliveryDate = new Date(currentYear, deliveryMonth - 6);
          const maxDeliveryDate = new Date(currentYear, currentDate.getMonth() + 5, currentDate.getDate()); // Máximo 5 meses hacia el futuro
          
          if (months[deliveryMonth] === month && deliveryDate >= minDeliveryDate && deliveryDate <= maxDeliveryDate) {
            projectedOrders.push(order);
          }
        }
      });
      
      let totalPrice = 0;
      
      projectedOrders.forEach((order) => {
        totalPrice += Number(order.precio);
      });
      
      const formattedPrice = totalPrice.toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
      });
      
      return formattedPrice;
    };
    
    const calculateTotalPrice = (month) => {
      const completedOrders = [];
      
      tableOrders.forEach((order) => {
        if (order.completada === true) {
          const formattedInvoiceDate = order.invoice_date.replace(/(\d{1,2})\/(\d{1,2})\/(\d{4})/, '$2/$1/$3');
          const invoiceDate = new Date(formattedInvoiceDate);
          const invoiceMonth = invoiceDate.getMonth();
          
          if (months[invoiceMonth] === month) {
            completedOrders.push(order);
          }
        }
      });
      
      let totalPrice = 0;
      
      completedOrders.forEach((order) => {
        totalPrice += Number(order.precio);
      });

      const formattedPrice = totalPrice.toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
      });
      
      return formattedPrice;
    };

    
    useEffect(() => {
      if (orders && orders.length > 0) {
        const ventasArray = months.map((month) => calculateTotalPrice(month));
        setVentas(ventasArray);
    
        const proyeccionesArray = months.map((month) => calculateProjectionPrice(month));
        setProyecciones(proyeccionesArray);
      }
    }, [orders, tableOrders]);

    let ventasConvertidas = [];
    let proyeccionesConvertidas = [];
    
    if (ventas !== [] && ventas.length > 0 && proyecciones !== [] && proyecciones.length > 0) {
      ventasConvertidas = ventas.map((venta) => {
        const ventaLimpia = parseFloat(venta.replace("$", "").replace(",", ""));
        return ventaLimpia;
      });
    
      proyeccionesConvertidas = proyecciones.map((proyeccion) => {
        const proyeccionLimpia = parseFloat(proyeccion.replace("$", "").replace(",", ""));
        return proyeccionLimpia;
      });
    }
    
    
    const globalState = {
      paidOrdersLastYear,
      setPaidOrdersLastYear,
      inputValue,
      setInputValue,
      statsGenerator,
      onRefreshSubmit,
        onSearchInput,
        onInputChange,
        onSubmitHandler,
        totalMoney,
        totalDebt,
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
        selectReportsForm,
        proyecciones,
        setProyecciones,
        ventas,
        setVentas,
        months,
        calculateProjectionPrice,
        calculateTotalPrice,
        ventasConvertidas,
        proyeccionesConvertidas,
        totalAtrasos,
        spinnerSwitch,
        setSpinnerSwitch
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