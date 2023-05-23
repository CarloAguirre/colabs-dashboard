import axios from 'axios'
import Cookies from 'universal-cookie'


export const createProducto = async (numero, fecha, contrato = null, division, entrega, nombre, mail, material, cantidad, precio, descripcion, categoria) => {
    const cookies = new Cookies();
    const token = cookies.get("token");
    console.log(token);
  
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
      "categoria": categoria
    });
  
    var config = {
      method: 'post',
      url: `http://localhost:8080/api/productos/`,
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
      console.error(error.response);
      alert(error.response);
      return false; // Devuelve false si ocurre algún error
    }
  };
  