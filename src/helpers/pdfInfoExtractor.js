import { format } from 'date-fns';

export const pdfInfoExtractor = (tableOrders, orders, newOrder, cliente, setInvoiceDate, setInvoice, setNewOrderData, setLicitation, rfxNumber)=>{
    const orderArray =[]
    let mayorNumero = 0;
    let indiceMayorNumero = -1;
    let materialCantidad = {};
    let LicitationNumber = ""
     if(cliente === "codelco"){
       const orderData = ()=>{
         let fecha = null;
         const indiceSAP = newOrder.indexOf('Material');
         const indiceUnidades = newOrder.indexOf('Unidades');
         const indiceDesc = newOrder.indexOf('Descripción del ítem:');
         const indiceValorNeto = newOrder.indexOf("Valor total neto USD");         
         const regexSAP = /(?:^|\D)(\d{7})(?!\d|\w|\D)/g;
        

        let resultados = [];
       
          newOrder.map((texto, index)=>{
              //Numero de Orden
              if (texto.includes('ORDEN DE COMPRA')) {
                  orderArray[0] = Number(texto.match(/\d+/g));
              }

              //Fecha
              const mesNumerico = {
                enero: 0, febrero: 1, marzo: 2, abril: 3, mayo: 4, junio: 5,
                julio: 6, agosto: 7, septiembre: 8, octubre: 9, noviembre: 10, diciembre: 11
              };
              
              const fechaMatch = texto.match(/Fecha de Emisión: (\d{1,2})\.(\w+)\.(\d{4})/);
              if (fechaMatch) {
                const dia = parseInt(fechaMatch[1], 10);
                const mesTexto = fechaMatch[2].toLowerCase();
                const mes = mesNumerico[mesTexto];
                const año = parseInt(fechaMatch[3], 10);
                
                if (!isNaN(dia) && !isNaN(mes) && !isNaN(año)) {
                  const fecha = new Date(año, mes, dia);
                  if (!isNaN(fecha)) {
                    const fechaFormateada = format(fecha, 'dd/MM/yyyy');
                    orderArray[1] = fechaFormateada;
                  }
                }
              }else{
                const fechaMatch = texto.match(/Fecha de Emisión: (.+)/);
                if (fechaMatch) {
                  const fechaTexto = fechaMatch[1].trim();
                  const fecha = new Date(fechaTexto);
                  if (!isNaN(fecha)) {        
                    const fechaFormateada = format(fecha, 'dd/MM/yyyy');
                    orderArray[1] = fechaFormateada;
                  }
                } 
              }

              //Contrato:
              const regexContrato = /abierto\s(\d+)/;
              const matchContrato = texto.match(regexContrato);

              if (matchContrato) {
                orderArray[2] = Number(matchContrato[1]);
              }

              //Division
              let segundaPalabra = null;
              const palabras = texto.split(' ');
              if (palabras.length >= 2 && palabras[0] === 'DIVISIÓN') {
                if(palabras[2]){
                  segundaPalabra = `${palabras[1]} ${palabras[2]}`;
                  orderArray[3] = segundaPalabra;
                }else{
                  segundaPalabra = palabras[1];
                  orderArray[3] = segundaPalabra;
                }

                  }
              
             // Entrega


            let fechaEntrega = null;
            if (texto.startsWith('FECHA DE ENTREGA:')) {
            const indiceDosPuntos = texto.indexOf(':');
            if (indiceDosPuntos !== -1) {
              const textoDespuesDosPuntos = texto.substring(indiceDosPuntos + 1).trim();
              const partesFecha = textoDespuesDosPuntos.split('.');
              if (partesFecha.length === 3) {
                const dia = parseInt(partesFecha[0], 10);
                const mesAbreviatura = partesFecha[1];
                const anio = parseInt(partesFecha[2], 10);
                const meses = {
                  Ene: 0, Feb: 1, Mar: 2, Abr: 3, May: 4, Jun: 5,
                  Jul: 6, Ago: 7, Sep: 8, Oct: 9, Nov: 10, Dic: 11
                };
                if (meses.hasOwnProperty(mesAbreviatura)) {
                  const mes = meses[mesAbreviatura];
                  fechaEntrega = format(new Date(anio, mes, dia), 'dd/MM/yyyy');
                  orderArray[4] = fechaEntrega;
                }
              }
            }
            } else if (texto.startsWith('FECHA ENTREGA')) {
            const indiceString = newOrder.indexOf('FECHA ENTREGA');
            const fecha = newOrder[indiceString + 2];
            const partesFecha = fecha.split('.');
            if (partesFecha.length === 3) {
              const dia = parseInt(partesFecha[0], 10);
              const mesAbreviatura = partesFecha[1];
              const anio = parseInt(partesFecha[2], 10);
              const meses = {
                Ene: 0, Feb: 1, Mar: 2, Abr: 3, May: 4, Jun: 5,
                Jul: 6, Ago: 7, Sep: 8, Oct: 9, Nov: 10, Dic: 11
              };
              if (meses.hasOwnProperty(mesAbreviatura)) {
                const mes = meses[mesAbreviatura];
                fechaEntrega = format(new Date(anio, mes, dia), 'dd/MM/yyyy');
                orderArray[4] = fechaEntrega;
              }
            }
            }


              //Nombre Gestor de compra
              let textoDespuesDosPuntosNombre = null;
              if (texto.startsWith('Nombre:')) {
                  textoDespuesDosPuntosNombre = texto.substring(7).trim();
                  orderArray[5] = textoDespuesDosPuntosNombre;
                }

              //Mail Gestor de compra
              const regex = /(?:E-mail|Email):\s*([^\s]+)/i;
              const match = texto.match(regex);               
              if (match) {
                const email = match[1];
                orderArray[6] = email
              }

              //SAP/material
              if(texto.split( " " ).length < 3){
                  
                const matches = texto.match(regexSAP);
              
                if (matches) {
                  matches.forEach(match => {
                    const material = match.match(/\d{7}/)[0]; // Obtener el número de material
                    resultados.push(material);
                  });
                }
              }
            // }
              //precio unitario
              // if(typeof texto)
              const divisaRegex = /^\d{1,3}([.,]\d{3})*([.,]\d{2})?$/; // Expresión regular para el formato de divisa

              const numero = parseFloat(texto.replace(/[,.]/g, '').replace(',', '.'));
              
              if (divisaRegex.test(texto) && numero > mayorNumero) {
                mayorNumero = numero;
                indiceMayorNumero = index;
              }
              
              if (indiceMayorNumero !== -1) {
                const precioString = newOrder[indiceMayorNumero];
                let precio;
              
                if (divisaRegex.test(precioString)) {
                  // Formato 5.626,04 o Formato 5,626.04
                  if (precioString.indexOf(".") < precioString.indexOf(",")) {
                    precio = parseFloat(precioString.replace(/[,.]/g, '').replace(',', '.')) / 100;
                  } else {
                    precio = parseFloat(precioString.replace(/[,.]/g, '') / 100);
                  }
                } else if (precioString.includes(".")) {
                  // Formato 5,626.04
                  precio = parseFloat(precioString.replace(/[,.]/g, '').replace(',', '.')) / 100;
                } else if (precioString.includes(",")) {
                  // Formato 5.626,04
                  precio = parseFloat(precioString.replace(/[,.]/g, '') / 100);
                } else {
                  // Formato sin separador de miles y decimales
                  precio = parseFloat(precioString) / 100;
                }
              
                orderArray[9] = Number(precio);
              }
              //Descripcion
              if (indiceDesc !== -1) {
                const description = newOrder[indiceDesc + 2];
                const descriptionArray = description.split(" ");
              
                if (descriptionArray.length < 2) {
                  orderArray[10] = `${descriptionArray[0]}`;
                } else if (descriptionArray.length < 3) {
                  orderArray[10] = `${descriptionArray[0]} ${descriptionArray[1]}`;
                } else if (descriptionArray.length < 4) {
                  orderArray[10] = `${descriptionArray[0]} ${descriptionArray[1]} ${descriptionArray[2]} `;
                } else if (descriptionArray.length >= 4) {
                  orderArray[10] = `${descriptionArray[0]} ${descriptionArray[1]} ${descriptionArray[2]} ${descriptionArray[3]} `;
                }
              } else {
                const sapIndex = indiceSAP + 15
                if(!isNaN(parseFloat(newOrder[sapIndex])) && isFinite(newOrder[sapIndex])){
                  orderArray[10] = newOrder[indiceSAP + 14];
                }else if(newOrder[sapIndex] === " "){
                  orderArray[10] = newOrder[indiceSAP + 16];                    
                }else{
                  orderArray[10] = newOrder[indiceSAP + 15];                    

                }
              }
              
             
          //SRM Respuesta a licitacion:
          function capturarNumeroOferta(cadena, index) {
            const patron = /(?:N° Oferta )?SRM: (\d+)/; 
            const coincidencias = cadena.match(patron);
            if (coincidencias) {
              const regex = /\d/;
              let tester = regex.test(coincidencias[0]);
              if(tester === true){
                return coincidencias[1];  // Retorna la primera coincidencia encontrada
              }
            } else {
              const patron = /(?:N° Oferta )?SRM:/; 
              const patronDos = /OFERTA\s+SRM/;
              const patronTres = /(?:N° Oferta )?SRM:(\d+)/; 
              const patronCuatro = /N° Oferta SRM (\d+)/;
              const coincidencias = cadena.match(patron);
              const coincidenciasDos = cadena.match(patronDos);
              const coincidenciasTres = cadena.match(patronTres);
              const coincidenciasCuatro = cadena.match(patronCuatro);
              if (coincidencias || coincidenciasDos || coincidenciasTres || coincidenciasCuatro) {
                if (coincidenciasTres) {
                  return coincidenciasTres[1];
                } else if(coincidenciasCuatro){
                  return coincidenciasCuatro[1]
                }else {
                  return newOrder[index + 2];
                }
              }
            }
            
          }   
            const numeroOferta = capturarNumeroOferta(texto, index);
            if (numeroOferta) {
              orderArray[13] = numeroOferta
            }

          // RFX Licitacion:
          const rfxInlineIndex = texto.includes("RFX:") || texto.includes("Rfx:");
          const patron = /RFX:(\d+)/;
          const patronDos = /Rfx:(\d+)/;
          const coincidencias = texto.match(patron);
          const coincidenciasDos = texto.match(patronDos);

          if (rfxInlineIndex) {
            if(texto === "RFX:" || texto === "Rfx:"){
              orderArray[12] = newOrder[index + 2]

            }else if(coincidencias || coincidenciasDos){
              orderArray[12] = coincidencias[1] || coincidenciasDos[1]

            }else{
              orderArray[12] = texto.split(" ")[1];
            }
          } else if (texto === "RFX" || texto === "Rfx") {
            const rfxNumber = newOrder[index + 2];
            const soloDigitos = rfxNumber.replace(/\D/g, "");
            
            if (soloDigitos !== "") {
              orderArray[12] = soloDigitos;
            } else {
              orderArray[12] = rfxNumber.split(" ")[1];
            }
          }
          


          })

          //SAP parte II
          const numerosAgrupados = resultados.join('/');
          orderArray[7] = numerosAgrupados

          //Cantidad
          const contadorUnidades = newOrder.reduce((contador, texto, index) => {
            if (texto === 'Unidades' || texto === 'Juego') {
              return contador + 1;
            }
            return contador;
          }, 0);

          // Cantidad
          if (contadorUnidades === 1) {
          const indiceUnidades = newOrder.indexOf('Unidades') !== -1 ? newOrder.indexOf('Unidades') : newOrder.indexOf('Juego');
          const material = resultados[0]; // Primer material encontrado
          const cantidad = Number(newOrder[indiceUnidades - 2]);
          const precioString = newOrder[indiceUnidades + 2].replace(/[,\.]/g, ''); // Reemplazar comas y puntos
          const precioNumber = parseFloat(precioString.slice(0, -2) + '.' + precioString.slice(-2)); // Convertir a punto flotante
          materialCantidad[material] = [cantidad, precioNumber];
          orderArray[8] = cantidad; // Guardar cantidad en orderArray[8]
          } else if (contadorUnidades > 1) {
          let cantidadIndex = 0; // Índice para recorrer las cantidades
          let sumaUnidades = 0; // Variable para calcular la suma de las unidades
          newOrder.forEach((texto, index) => {
            if (texto === 'Unidades') {
              const material = resultados[cantidadIndex]; // Material correspondiente a la posición actual
              const valorUnidades = Number(newOrder[index - 2]);
              const precioString = newOrder[index + 2].replace(/[,\.]/g, ''); // Reemplazar comas y puntos
              const precioNumber = parseFloat(precioString.slice(0, -2) + '.' + precioString.slice(-2)); // Convertir a punto flotante
              if (!isNaN(valorUnidades)) {
                if (!materialCantidad[material]) {
                  materialCantidad[material] = [0, 0];
                }
                materialCantidad[material][0] += valorUnidades;
                materialCantidad[material][1] += precioNumber;
                cantidadIndex++;
                sumaUnidades += valorUnidades;
              }
            }
          });
          orderArray[8] = sumaUnidades; // Guardar suma de unidades en orderArray[8]
          } else {
          const material = resultados[0]; // Primer material encontrado
          const cantidad = Number(newOrder[indiceSAP + 15]) - resultados.length + 1;
          const precioString = newOrder[indiceSAP + 19].replace(/[,\.]/g, ''); // Reemplazar comas y puntos
          const precioNumber = parseFloat(precioString.slice(0, -2) + '.' + precioString.slice(-2)); // Convertir a punto flotante
          materialCantidad[material] = [cantidad, precioNumber];
          orderArray[8] = cantidad; // Guardar cantidad en orderArray[8]
          }
          orderArray[11] = materialCantidad;



                 
          }
        orderData()

      //  BHP - ESCONDIDA //

      }else if(cliente === "bhp"){
        const indiceDescripcion = newOrder.indexOf('Description');
        const contactIndex = newOrder.indexOf('Contact Information');
        const locationIndex = newOrder.indexOf('Location Code:');
        let statusIndex = newOrder.indexOf('STATUS')

        let resultados = [];
        newOrder.map((texto, index)=>{
          
          //Numero
          const match = texto.match(/450(\d*)/);
          if (match) {
            orderArray[0] = Number(match[0])
          }

          //Fecha
          const matchFecha = texto.match(/(\d+)\s+([a-zA-Z]+)(?:,\s+)?(\d+)/) || texto.match(/\b(\d{1,2})\s+([a-zA-Z]+)\s+(\d{4})\b/);
          if (matchFecha) {
            const [, day, month, year] = matchFecha;
            let fechaConvertida; 

            if (month.length > 2) {
              // Formato '8 May, 2018'
              const date = new Date(`${month} ${day}, ${year}`);
              const dayFormatted = ('0' + date.getDate()).slice(-2);
              const monthFormatted = ('0' + (date.getMonth() + 1)).slice(-2);
              const yearFormatted = date.getFullYear();
              fechaConvertida = `${dayFormatted}/${monthFormatted}/${yearFormatted}`;
            } else {
              // Formato '7 Jul 2020'
              const date = new Date(`${day} ${month} ${year}`);
              const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
              fechaConvertida = date.toLocaleDateString('en-GB', options).replace(/\//g, '-');
            }
          
            orderArray[1] = fechaConvertida;
          }

          //telefono
          if (texto.includes('Telephone' || 'TELEPHONE')) {
            orderArray[2] = newOrder[index - 1]
            //Division
            orderArray[3] = newOrder[8]

            //Fecha de entrega
            const word = newOrder[indiceDescripcion + 33].replace('.', '/')
            orderArray[4] = word.replace('.', '/')
          }else{
            let telefono = newOrder[contactIndex + 4]
            const telefonoMatch = telefono.match(/\+[\d\s()]+/);

            if (telefonoMatch) {
              orderArray[2] = telefonoMatch[0];              
              orderArray[3] = newOrder[locationIndex + 3]
              let fechaString = newOrder[indiceDescripcion + 23]
                const date = new Date(fechaString);
                const day = date.getDate();
                const month = date.getMonth() + 1; // Los meses en JavaScript comienzan desde 0
                const year = date.getFullYear();
                orderArray[4] = `${day.toString().padStart(2, '0')}/${month.toString().padStart(2, '0')}/${year}`;
            }      
          }


          //Nombre gestor de la compra
          if (texto.includes('Purchasing Contact' || 'PURCHASING CONTACT')) {
            orderArray[5] = newOrder[index - 1]

            //Mail gestor de la compra
            orderArray[6] = newOrder[index + 5]
          }else{
            if (texto.includes("@bhp.com")) {
              const mailPartes = texto.split(' ');
              if (mailPartes[2]) {
                orderArray[6] = mailPartes[2];
              } else {
                orderArray[6] = mailPartes[1];
              }
              orderArray[5] = newOrder[contactIndex + 2]
            }
        }

          //SAP material
          const regexSAP = /\b10\d{6,}\b/g;
          if (regexSAP.test(texto)) {
            const matches = texto.match(regexSAP);
            if (matches) {
              const filteredMatches = matches.filter(match => /^\d+$/.test(match));
              resultados = resultados.concat(filteredMatches);
            }
          }
          
          //cantidad / PRECIO /DESCRIPCION
          const regexDolares = /[\d,]+(?:\.\d+)?/;
          if (newOrder.includes('STATUS')) {
            orderArray[8] = newOrder[statusIndex + 1];           
            const precio = newOrder[statusIndex - 10];
            const matchDolares = precio.match(regexDolares);
            if (matchDolares) {
              const amountNumeric = parseFloat(matchDolares[0].replace(',', ''));
              orderArray[9] = amountNumeric;
            }
            orderArray[10] = newOrder[statusIndex - 1];
          } else {
            orderArray[8] = newOrder[indiceDescripcion + 17];
            const amount = newOrder[indiceDescripcion + 27];
            const amountNumeric = parseFloat(amount.replace(',', ''));
            orderArray[9] = amountNumeric;
            orderArray[10] = newOrder[indiceDescripcion + 23];
          }
        })
        const numerosAgrupados = resultados.join('/');
        orderArray[7] = numerosAgrupados

      }else if(cliente === "invoice"){
        const poNumberIndex = newOrder.indexOf('PO Number')
        
        if(poNumberIndex){
          const paidOrderNumber = Number(newOrder[poNumberIndex + 2])

     
          const paidOrderId = orders.find(order => order.numero === paidOrderNumber)?._id;
            if(paidOrderId){
              let fechaFormatted = null;
              const patronFecha = /\d{2}\/\d{2}\/\d{4}/;
              const coincidencias = newOrder[0].match(patronFecha);
              const fecha = coincidencias[0];
              if(fecha){
                const fechaDate = new Date(fecha)
                  fechaFormatted = format(fechaDate, 'dd/MM/yyyy');
                  
              }
              setInvoiceDate(fechaFormatted)      
              setInvoice(paidOrderId) 
            }else{
              alert(`No existe la orden N°${paidOrderNumber} en la base de datos.`)
            }
        }

      }else if(cliente === "licitacion"){
        //numero
        const bidNumberIndex = newOrder.indexOf('Bid number:')

        if(bidNumberIndex){
          orderArray[0] = newOrder[bidNumberIndex + 2]
        }
        
        let resultados = [];
        newOrder.map((texto, index)=>{

          
          //fecha
          const fecha = new Date;
          
          const fechaFormateada = format(fecha, 'dd/MM/yyyy');
          orderArray[1] = fechaFormateada;

          //Division
          orderArray[2] = "Por definir"
          
          //Nombre de contacto
          orderArray[3] = "Por definir"
          
          //material
          const regexSAP = /(?:^|\D)(\d{7})(?!\d|\w|\D)/g;
          if (regexSAP.test(texto)) {
            const matches = texto.match(regexSAP);
            if (matches) {
              const filteredMatches = matches.filter(match => /^\d+$/.test(match));
              resultados = resultados.concat(filteredMatches);
            }
          }
          const numerosAgrupados = resultados.join('/');
          orderArray[4] = numerosAgrupados


          

        })
         //Cantidad
         const contadorUnidades = newOrder.reduce((contador, texto, index) => {
          if (texto === 'Quantity' || texto === 'Quantity') {
            return contador + 1;
          }
          return contador;
        }, 0);

        // Cantidad
        if (contadorUnidades === 1) {
        const indiceUnidades = newOrder.indexOf('Quantity') !== -1 ? newOrder.indexOf('Quantity') : newOrder.indexOf('Quantity');
        const material = resultados[0]; // Primer material encontrado
        let cantidad = Number(newOrder[indiceUnidades + 14]);
        if(cantidad < 1 || cantidad === " "){
          cantidad = Number(newOrder[indiceUnidades + 15]);
        }
        let precioStringComplete =  newOrder[indiceUnidades + 18]
        if(precioStringComplete === NaN || precioStringComplete === 0 || precioStringComplete === " "){
          precioStringComplete = newOrder[indiceUnidades + 19]
        }
        const partes = precioStringComplete.split(" ");
        const precioString = partes[0].replace(/[,\.]/g, ''); // Reemplazar comas y puntos
        const precioNumber = parseFloat(precioString.slice(0, -2) + '.' + precioString.slice(-2)); // Convertir a punto flotante
        materialCantidad[material] = [cantidad, precioNumber];
        orderArray[5] = cantidad; // Guardar cantidad en orderArray[8]
        } else if (contadorUnidades > 1) {
        let cantidadIndex = 0; // Índice para recorrer las cantidades
        let sumaUnidades = 0; // Variable para calcular la suma de las unidades
        newOrder.forEach((texto, index) => {
          if (texto === 'Quantity') {
            const material = resultados[cantidadIndex]; // Material correspondiente a la posición actual
            const valorUnidades = Number(newOrder[index + 14]);
            let precioStringComplete = newOrder[index + 18]
            const partes = precioStringComplete.split(" ");
            const precioString = partes[0].replace(/[,\.]/g, ''); // Reemplazar comas y puntos
            const precioNumber = parseFloat(precioString.slice(0, -2) + '.' + precioString.slice(-2)); // Convertir a punto flotante
            if (!isNaN(valorUnidades)) {
              if (!materialCantidad[material]) {
                materialCantidad[material] = [0, 0];
              }
              materialCantidad[material][0] += valorUnidades;
              materialCantidad[material][1] += precioNumber;
              cantidadIndex++;
              sumaUnidades += valorUnidades;
            }
          }
        });
        orderArray[5] = sumaUnidades; // Guardar suma de unidades en orderArray[8]
        } 
        orderArray[8] = materialCantidad

        
        setLicitation(LicitationNumber)

        //precio
        let totalPrecios = 0;

        for (let llaveMaterial in materialCantidad) {
          const precio = materialCantidad[llaveMaterial][1];
          const cantidad = materialCantidad[llaveMaterial][0];
          totalPrecios += Number(precio)* Number(cantidad);
        }
        orderArray[6] = totalPrecios

        //descripcion
        const descIndex = newOrder.indexOf("Description:")
        orderArray[7] = newOrder[descIndex + 2]

        //Rfx Number
        orderArray[9] = rfxNumber      
        }

      setNewOrderData(orderArray)
}