import axios from 'axios'
import Cookies from 'universal-cookie'
import { serverPath } from '../config/serverPath';

export const orderUpdate = async(id, invoiceDate, deliveryDate = null)=>{
    const cookies = new Cookies();
    const token = cookies.get("token");

    let data;
    if(deliveryDate != null){
        data = JSON.stringify({
        "entrega": deliveryDate,
        });
    }else{
        data = JSON.stringify({
        "completada": true,
        "invoice_date": invoiceDate
        });

    }

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
        if(deliveryDate != null){
            console.log(JSON.stringify(response.data.msg));
            alert("La fecha de entrega ha sido actualizada")
            window.location.href = "./orders"
        }
        console.log(JSON.stringify(response.data.msg));
        alert(response.data.msg)
        return true;
    })
    .catch((error) => {
    console.log(error);
    return false;
    });

    }