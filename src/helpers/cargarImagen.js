import FormData from 'form-data'
import Cookies from 'universal-cookie'
import { serverPath } from '../config/serverPath';

export const cargarImagen = async(archivo, invoice = null, licitationNumber = null)=>{

    const { name } = archivo;
    const cookies = new Cookies();
    let id = ""
    if(invoice){
        id = invoice
    }else if(licitationNumber){
        id = licitationNumber
    }else{
        id = cookies.get("id")
    }
    const extensionesValidas = ['pdf', 'Pdf', 'PDF']

        // validar la extension del archivo
        const nombreSplit = name.split('.')
        const extension = nombreSplit[nombreSplit.length-1]

        if(!extensionesValidas.includes(extension)){
            return alert(`Los formatos de archivo permitidos son: ${extensionesValidas}`)
        }

    var formdata = new FormData();
    formdata.append("archivo", archivo, "/path/to/file");
    var requestOptions = {
    method: 'PUT',
    body: formdata,
    redirect: 'follow',
   };
   if(licitationNumber != null){
    await fetch(`${serverPath}api/uploads/licitaciones/${id}`, requestOptions)
    .then(response => {

        response.text()

     
             alert('Licitación añadida con exito')
             window.location.href = "./licitations"
         
     })
     .catch(error => console.log( error));
   }else{

       await fetch(`${serverPath}api/uploads/productos/${id}`, requestOptions)
       .then(response => {
           response.text()
           if(invoice){
                window.location.href = "./orders" 
                return true;
                 
            }else{
                alert('Orden añadida con exito')
                window.location.href = "./orders"
                return true;
            }
        })
        .catch(error => console.log( error));
        
    }
}
