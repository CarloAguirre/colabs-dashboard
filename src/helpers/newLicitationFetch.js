import axios from 'axios'
import Cookies from 'universal-cookie'
import { serverPath } from '../config/serverPath';


export const createLicitation = async (numero = null, fecha = null, division = null, nombre = null, material = null, cantidad = null, precio = null, descripcion = null, sapinfo = {}) => {
    const cookies = new Cookies();
    const token = cookies.get("token");
    // console.log(token);
  
    var data = JSON.stringify({
      "numero": numero,
      "fecha": fecha,
      "division": division,
      "nombre": nombre,
      "material": material,
      "cantidad": cantidad,
      "precio": precio,
      "descripcion": descripcion,
      "sap_info": sapinfo,
    });
  
    var config = {
      method: 'post',
      url: `${serverPath}api/licitaciones/`,
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
  