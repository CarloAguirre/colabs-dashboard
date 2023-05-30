import axios from 'axios'
import { useOrdenes } from '../context';
import Cookies from 'universal-cookie'
import { serverPath } from '../config/serverPath';

export const infoFetch =()=>{

    let data = '';
    let orders = [];
    const cookies = new Cookies();
    
    let config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: `${serverPath}api/productos?limite=1000&desde=0`,
      headers: { },
      data : data
    };
    
    axios.request(config)
    .then(({data}) => {
        cookies.set('uid', data.usuario.uid, {"path": "/"});
        cookies.set('token', data.token, {"path": "/"});
        const {productos} = data;
        orders.push(productos)
        console.log(orders)
    })
    .catch((error) => {
        console.log(error);
    });
    
    return orders;
}