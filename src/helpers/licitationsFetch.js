import axios from 'axios'
import { useOrdenes } from '../context';
import Cookies from 'universal-cookie'
import { serverPath } from '../config/serverPath';

export const onLicitacionesFetch =()=>{

    let data = '';
    let licitations = [];
    const cookies = new Cookies();
    
    let config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: `${serverPath}api/licitaciones?limite=1000&desde=0`,
      headers: { },
      data : data
    };
    
    axios.request(config)
    .then(({data}) => {
        cookies.set('token', data.token, {"path": "/"});
        const {licitaciones} = data;
        licitations.push(licitaciones)
    })
    .catch((error) => {
        console.log(error);
    });
    
    return licitations;
}