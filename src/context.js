import { createContext, useState, useEffect, useContext } from "react"

import { cargarImagen } from "./helpers/cargarImagen";
import { createProducto } from "./helpers/newOrderFetch";
import { orderUpdate } from "./helpers/orderUpdate";
import { serverPath } from "./config/serverPath";
import { format, parse } from 'date-fns';
import es from 'date-fns/locale/es';
import { counterOrdersTotalprice } from "./helpers/counter";
import { pdfInfoExtractor } from "./helpers/pdfInfoExtractor";
import { onSubmit } from "./helpers/newOrderSubmit";
import { filterOrders } from "./helpers/filterOrder";
import { createLicitation } from "./helpers/newLicitationFetch";
import { onLicitacionesFetch } from "./helpers/licitationsFetch";
import { filterLicitations } from "./helpers/filterLicitations";


 const OrdenesContext = createContext({})

 export const OrdenesProvider = ({ children }) =>{

    const [orders, setOrders] = useState([]);
    const [archivo, setArchivo] = useState(null); //imagen de la orden ({path:..., name:...})
    const [tableOrders, setTableOrders] = useState(orders)
    const [invoice, setInvoice] = useState(null)
    const [licitation, setLicitation] = useState(null)
    const [invoiceDate, setInvoiceDate] = useState()
    const [cliente, setCliente] = useState()
    const [contratosArray, setContratosArray] =useState([])
    const [proyecciones, setProyecciones] = useState([])
    const [ventas, setVentas] = useState([])   
    const [newOrder, setNewOrder] = useState([])
    const [newOrderData, setNewOrderData] = useState([])
    const [paidOrdersLastYear, setPaidOrdersLastYear] = useState(0);
    const [inputValue, setInputValue] = useState(""); 
    const [searchedOrder, setSearchedOrder] = useState("");
    const [FilteredArray, setFilteredArray] = useState([]);
    const [rfxNumber, setRfxNumber] = useState('');
    const [licitations, setLicitations] = useState([]);
    const [tableLicitations, setTableLicitations] = useState(licitations)
    const [searchedLicitation, setSearchedLicitation] = useState("");
    const [inputLicitationsValue, setInputLicitationsValue] = useState(""); 
    



    // Generador de toda la data de la aplicacion
    useEffect(() => {
      const fetchData = async()=>{
          const res =  await fetch(`${serverPath}api/productos?limite=1000&desde=0`)
          const orders = await res.json()
          const { productos } = orders;
          setOrders(productos)    
      }
      fetchData();
    }, [])

    //Generador de lo facturado en los ultimos 12 meses
    useEffect(() => {
      let counter = counterOrdersTotalprice(orders)
        setPaidOrdersLastYear(counter);
    }, [orders]);    
    
    
    //Generador de informacion para la nueva orden agregada.
     useEffect(() => {    
      pdfInfoExtractor(tableOrders, orders, newOrder, cliente, setInvoiceDate, setInvoice, setNewOrderData, setLicitation, rfxNumber)
     }, [newOrder])
     
     const onSearchInput = ({ target }) => {
      const { value } = target;
      if(value === ""){
        setInputValue("")
        setSearchedOrder("")
      }else{
        setSearchedOrder(value);

      }
    }

    const onSearchLicitationsInput = ({ target }) => {
      const { value } = target;
      if(value === ""){
        setInputLicitationsValue("")
        setSearchedLicitation("")
      }else{
        setSearchedLicitation(value);
      }
    }


    //Configuración de "Filtrar orden"
    useEffect(() => {
      const filteredOrders = filterOrders(searchedOrder, orders);
      setTableOrders(filteredOrders);
    }, [searchedOrder, orders]);

    useEffect(() => {
      const filteredLicitations = filterLicitations(searchedLicitation, licitations);
      setTableLicitations(filteredLicitations);
    }, [searchedLicitation, licitations]);

    useEffect(() => {
      setTableLicitations(licitations)
    }, [licitations]);

    //Configuración de "Subir orden"
    const [spinnerSwitch, setSpinnerSwitch] = useState(false)

    const onSubmitHandler = async (event) => {
    onSubmit(event, setSpinnerSwitch, invoiceDate, invoice, archivo, newOrderData, es, parse, format, orderUpdate, cargarImagen, createProducto, orders, createLicitation, licitation);
    };

    
    //Configuración de formularios de "Filtro por contrato"
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
    
    useEffect(() => {

      const fetchLicitationsData = async()=>{
        const res =  await fetch(`${serverPath}api/licitaciones?limite=1000&desde=0`)
        const licitations = await res.json()
        const { licitaciones } = licitations;
        setLicitations(licitaciones)    
    }
    fetchLicitationsData();

    }, [])
    
    
    
    const globalState = {
      paidOrdersLastYear,
      setPaidOrdersLastYear,
      inputValue,
      setInputValue,
      statsGenerator,
        onSearchInput,
        // onInputChange,
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
        setSpinnerSwitch,
        licitation,
        setLicitation,
        rfxNumber,
        setRfxNumber,
        licitations,
        setLicitations,
        onSearchLicitationsInput,
        searchedLicitation,
        setSearchedLicitation,
        inputLicitationsValue,
        setInputLicitationsValue,
        tableLicitations
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