import FormData from 'form-data'
import Cookies from 'universal-cookie'

export const cargarImagen = async(archivo)=>{

    const { name } = archivo;
    const cookies = new Cookies();
    const id = cookies.get("id")
    const extensionesValidas = ['pdf', 'Pdf', 'PDF']

        // validar la extension del archivo
        const nombreSplit = name.split('.')
        const extension = nombreSplit[nombreSplit.length-1]

        if(!extensionesValidas.includes(extension)){
            return alert(`Los formatos de archivo permitidos son: ${extensionesValidas}`)
        }else{
            alert("el formato es valido!")
        }

    var formdata = new FormData();
    formdata.append("archivo", archivo, "/path/to/file");
    var requestOptions = {
    method: 'PUT',
    body: formdata,
    redirect: 'follow',
   };

    await fetch(`http://localhost:8080/api/uploads/productos/${id}`, requestOptions)
    .then(response => {
        response.text()
        console.log(response)

        alert('Orden añadida con exito')
        window.location.href = "./orders"
    })
    .catch(error => console.log( error));
                 
    }

