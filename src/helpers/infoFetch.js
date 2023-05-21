import axios from 'axios'
import { useOrdenes } from '../context';

export const infoFetch =()=>{

    let data = '';
    let orders = [];
    
    let config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: 'http://localhost:8080/api/productos?limite=1000&desde=0',
      headers: { },
      data : data
    };
    
    axios.request(config)
    .then(({data}) => {

        const {productos} = data;
        orders.push(productos)
    })
    .catch((error) => {
        console.log(error);
    });
    
    return orders;
}