import axios from 'axios'
import Cookies from 'universal-cookie'
import { serverPath } from '../config/serverPath';


export const createProducto = async (numero = null, fecha = null, contrato = null, division = null, entrega = null, nombre = null, mail = null, material = null, cantidad = null, precio = null, descripcion = null, categoria = null, sapinfo = {}, rfx = null, srm = null) => {
    const cookies = new Cookies();
    const token = cookies.get("token");
  
    var data = JSON.stringify({
      "numero": numero,
      "fecha": fecha,
      "contrato": contrato,
      "division": division,
      "entrega": entrega,
      "nombre": nombre,
      "mail": mail,
      "material": material,
      "cantidad": cantidad,
      "precio": precio,
      "descripcion": descripcion,
      "categoria": categoria,
      "sap_info": sapinfo,
      "rfx": rfx,
      "srm": srm
    });
  
    var config = {
      method: 'post',
      url: `${serverPath}api/productos/`,
      headers: {
        'Authorization': token,
        'Content-Type': 'application/json'
      },
      data: data
    };


  
    try {
      const response = await axios(config); // Agregar esta línea para obtener la respuesta de la solicitud
      cookies.set('id', response.data._id, { "path": "/" });
  
      return true; // Devuelve true si la solicitud se completa sin errores
    } catch (error) {
      const {msg} = error.response.data;

      alert(msg)
      window.location.href = "./"
      return false; // Devuelve false si ocurre algún error
    }
  };
  