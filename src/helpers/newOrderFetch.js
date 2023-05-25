import axios from 'axios'
import Cookies from 'universal-cookie'


export const createProducto = async (numero = null, fecha = null, contrato = null, division = null, entrega = null, nombre = null, mail = null, material = null, cantidad = null, precio = null, descripcion = null, categoria = null) => {
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
    
      if(error.response.data.msg){

        alert(error.response.data.msg);
        window.location.href = "./"
      }
      return false; // Devuelve false si ocurre algún error
    }
  };
  