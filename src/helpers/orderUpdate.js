import axios from 'axios'
import Cookies from 'universal-cookie'

export const orderUpdate = async(id, invoiceDate)=>{
    const cookies = new Cookies();
    const token = cookies.get("token");

    let data = JSON.stringify({
    "completada": true,
    "invoice_date": invoiceDate
    });

    let config = {
    method: 'put',
    maxBodyLength: Infinity,
    url: `http://localhost:8080/api/productos/${id}`,
    headers: { 
        'Authorization': token,
        'Content-Type': 'application/json'
    },
    data : data
    };

    axios.request(config)
    .then((response) => {
        console.log(JSON.stringify(response.data.msg));
        alert(response.data.msg)
        return true;
    window.location.href = "./orders"
    })
    .catch((error) => {
    console.log(error);
    return false;
    });

    }