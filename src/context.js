import { createContext, useState, useEffect, useContext } from "react"
import { colaboradores } from './config/colaboradores';



 const OrdenesContext = createContext({})

 export const OrdenesProvider = ({ children }) =>{

     // input nuevo colaborado config
     const [users, setUsers] = useState(colaboradores);
  
     const [counter, setCounter] = useState(Number(users.length));
 
     const [inputValue, setInputValue] = useState("");
 
     
     const onInputChange = ({target})=>{
     const {name, value} = target;
     setInputValue({
         ...inputValue,
         [name]: value
     })
     };
        
     const onSubmitHandler = (event)=>{
         event.preventDefault();
         const {nombre, cantidad, correo} = inputValue;
 
         if(inputValue !=[] && nombre){
             let idUser = Number(users[users.length-1].id) + 1;
             if(cantidad){
                 setUsers([ ...users,      
                     {
                         id: idUser,
                         nombre,
                         cantidad,
                         correo
                     }])
                     
                     setCounter(counter + 1);    
             }else{
                 alert("Ingresa el monto de la colaboracion!")
             }
         }else{
             alert("Ingresa todos los datos del nuevo colaborador!")
         } 
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
        FilteredArray
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