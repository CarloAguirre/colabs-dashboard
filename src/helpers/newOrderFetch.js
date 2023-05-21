import axios from 'axios'
import Cookies from 'universal-cookie'


export const createProducto = async(numero, fecha, contrato=null , division, entrega, nombre ,mail, material, cantidad, precio, descripcion)=>{
    const cookies = new Cookies();
    const token = cookies.get("token")
    console.log(token)

    
    var data = JSON.stringify({
        "numero":numero,
        "fecha":fecha,
        "contrato":contrato,
        "division":division,
        "entrega":entrega,
        "nombre":nombre,
        "mail":mail,
        "material":material,
        "cantidad":cantidad,
        "precio":precio,
        "descripcion":descripcion    

    });

    var config = {
        method: 'post',
        url: `http://localhost:8080/api/productos/`,
        headers: { 
            'Authorization': token, 
            'Content-Type': 'application/json'
        },
        data : data
    };

    await axios(config)
    .then(function (response) {
        const {nombre} = response.data
        
        // console.log(response.data._id)
        cookies.set('id', response.data._id, {"path": "/"})

        alert('Orden añadida con exito')
        window.location.href = "./orders"
    })
    .catch(function ({response}) {
        console.log(response)

        // if(response.data.msg){
        //     let msg1 = response.data.msg;
        //     document.getElementById('errorMsg').innerHTML = `
        //     <p>
        //         ${msg1}
        //     </p>` 
        //     return;
        // }

        // let msg2 =response.data.errors[0].msg        

        
        // document.getElementById('errorMsg').innerHTML = `
        // <p>
        //     ${msg2}
        // </p>`   
    
    });
}