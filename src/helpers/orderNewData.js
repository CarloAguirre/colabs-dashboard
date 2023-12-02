import axios from 'axios'
import Cookies from 'universal-cookie'
import { serverPath } from '../config/serverPath';

export const orderNewData = async(id, orderData)=>{
    const cookies = new Cookies();
    const token = cookies.get("token");

    let data = JSON.stringify(
        orderData
      );

    let config = {
    method: 'put',
    maxBodyLength: Infinity,
    url: `${serverPath}api/productos/${id}`,
    headers: { 
        'Authorization': token,
        'Content-Type': 'application/json'
    },
    data : data
    };

    axios.request(config)
    .then((response) => {    
            console.log(JSON.stringify(response.data.msg));
            alert("Los datos de la orden han sido actualizados")
            window.location.href = "./orders"
            return
    })
    .catch((error) => {
    console.log(error);
    return false;
    });

    }