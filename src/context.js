import { createContext, useState, useEffect, useContext } from "react"

import es from 'date-fns/locale/es';
import { cargarImagen } from "./helpers/cargarImagen";
import { createProducto } from "./helpers/newOrderFetch";
import { orderUpdate } from "./helpers/orderUpdate";
import { serverPath } from "./config/serverPath";
import { format, parse, isBefore, isAfter } from 'date-fns';
import { counterOrdersTotalprice } from "./helpers/counter";
import { pdfInfoExtractor } from "./helpers/pdfInfoExtractor";
import { onSubmit } from "./helpers/newOrderSubmit";
import { filterOrders } from "./helpers/filterOrder";
import { createLicitation } from "./helpers/newLicitationFetch";
import { filterLicitations } from "./helpers/filterLicitations";
import { calculateTotalPrice } from "./helpers/calculateTotalPrice";
import { calculateProjectionPrice } from "./helpers/calculateProjectionPrice";


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
    const [year, setYear] = useState();
    const [licitationDivision, setLicitationDivision] = useState("");

    const months = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];


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
      let counter = counterOrdersTotalprice(orders, year)
        setPaidOrdersLastYear(counter);
        setTableOrders(orders)
    }, [orders, year]);    
    
    
    //Generador de informacion para la nueva orden agregada.
     useEffect(() => {    
      pdfInfoExtractor(tableOrders, orders, newOrder, cliente, setInvoiceDate, setInvoice, setNewOrderData, setLicitation, rfxNumber, licitationDivision )
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
      const filteredOrders = filterOrders(searchedOrder, orders, contrato);
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
    onSubmit(event, setSpinnerSwitch, invoiceDate, invoice, archivo, newOrderData, es, parse, format, orderUpdate, cargarImagen, createProducto, orders, createLicitation, licitation, licitations);
    };

    const [contrato, setContrato] = useState("")
    
    //Configuración de formularios de "Filtro por contrato"
    const selectContratoForm = ({ target }) => {
      if (target.value !== 'todos') {
        let filteredOrders = [];
    
        if (
          searchedOrder.toLowerCase() === "atrasos" ||
          searchedOrder.toLowerCase() === "atrasadas" ||
          searchedOrder.toLowerCase() === "atrasados"
        ) {
          const currentDate = new Date();
          filteredOrders = orders.filter(order => {
            if (order.contrato === target.value) {
              const entregaDateParts = order.entrega.split("/");
              const entregaDate = new Date(
                entregaDateParts[2],
                entregaDateParts[1] - 1,
                entregaDateParts[0]
              );
              return !order.completada && entregaDate < currentDate;
            }
            return false;
          });
        } else {
          filteredOrders = orders.filter(order => {
            if (order.contrato === target.value) {
              for (let key in order) {
                if (order.hasOwnProperty(key)) {
                  const value = order[key];
                  const lowercaseValue = typeof value === "string" ? value.toLowerCase() : value?.toString().toLowerCase();
                  const lowercaseSearch = searchedOrder.toLowerCase();
                  
                  if (lowercaseValue && lowercaseValue.includes(lowercaseSearch)) {
                    return true;
                  }
                }
              }
            }
            return false;
          });
        }
    
        setTableOrders(filteredOrders);
        setContrato(target.value);
      } else {
        setSearchedOrder("");
        setTableOrders(orders);
        setContrato("");
      }
    };

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
     let totalNoCompletadas = 0;
     let totalCompletadas = 0
     let warningOrder = "Sin atrasos";

     let totalLicitations = 0;
     let totalLicitationsMoney = 0;

     
     const statsGenerator = () => {     
       tableOrders.forEach(order => {
  
         let monto = Number(order.precio);
         if(!order.completada){
           totalMoney += monto;
           totalNoCompletadas ++
         }else if(order.completada){
            totalCompletadas ++         
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
       });

       tableLicitations.forEach(licitation =>{
        let monto = licitation.precio
          totalLicitations ++
          totalLicitationsMoney += monto;
       })
     };
     
     statsGenerator();
     
     useEffect(() => {
      if (orders && orders.length > 0) {
        const ventasArray = months.map((month) => calculateTotalPrice(month, tableOrders, months));
        setVentas(ventasArray);
    
        const proyeccionesArray = months.map((month) => calculateProjectionPrice(month, tableOrders, months));
        setProyecciones(proyeccionesArray);
      }
    }, [orders, tableOrders]);

    let ventasConvertidas = [];
    let proyeccionesConvertidas = [];
    
    // if (ventas !== [] && ventas.length > 0 && proyecciones !== [] && proyecciones.length > 0) {
      if (ventas.length > 0 && proyecciones.length > 0) {
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

    useEffect(() => {
      if (year === "all") {
        // Si se selecciona "Todos los periodos", mostrar todas las orders y licitations
        setTableOrders(orders);
        setTableLicitations(licitations);
      } else {
        // Filtrar las orders y licitations según el año seleccionado (septiembre a septiembre)
        const selectedYear = parseInt(year);
        const startYear = selectedYear; // Año anterior al seleccionado
        const endYear = selectedYear + 1;
        const startDate = new Date(`${startYear}-09-01`);
        const endDate = new Date(`${endYear}-09-01`);
        const filteredOrders = orders.filter((order) => isAfter(parse(order.fecha, 'dd/MM/yyyy', new Date()), startDate) && isBefore(parse(order.fecha, 'dd/MM/yyyy', new Date()), endDate));
        const filteredLicitations = licitations.filter((licitation) => isAfter(parse(licitation.fecha, 'dd/MM/yyyy', new Date()), startDate) && isBefore(parse(licitation.fecha, 'dd/MM/yyyy', new Date()), endDate));
        setTableOrders(filteredOrders);
        setTableLicitations(filteredLicitations);
      }
    }, [year]);
    
    
 
    const globalState = {
        paidOrdersLastYear,
        setPaidOrdersLastYear,
        inputValue,
        setInputValue,
        statsGenerator,
        onSearchInput,
        onSubmitHandler,
        totalMoney,
        totalNoCompletadas,
        totalDebt,
        warningOrder,
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
        tableLicitations,
        totalLicitationsMoney,
        totalLicitations,
        totalCompletadas,
        year,
        setYear,
        setLicitationDivision
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