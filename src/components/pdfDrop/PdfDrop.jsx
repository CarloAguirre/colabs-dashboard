import React, { useEffect, useState } from 'react';
import { pdfjs } from 'react-pdf';
import Dropzone from 'react-dropzone';
import './pdfDrop.css'
import { useOrdenes } from '../../context';
import { SpinnerCustom } from '../spinner/SpinnerCustom';



pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;
pdfjs.GlobalWorkerOptions.disableWorker = true; // Deshabilitar el uso de web workers
pdfjs.GlobalWorkerOptions.imageResourcesPath = '/pdfjs/images/'; // Ruta de recursos de imágenes

export const PdfDrop =({cliente})=> {
  //cargar imagen 
  const {setArchivo, setNewOrder, setCliente, spinnerSwitch} = useOrdenes()
    
  const onInputChange = (event)=>{    
      setArchivo(event.target.files[0]);
  }

  const [file, setFile] = useState(null);
  // const [onDropFile, setOnDropFile] = useState('') TODO (GUARDAR EL NUMERO DEL ARCHIVO CARGADO AUN CUANDO SE MINIMINE EL MODAL)

  const onDrop = (acceptedFiles) => {
    const reader = new FileReader();

    reader.onload = () => {
      const typedArray = new Uint8Array(reader.result);
      pdfjs.getDocument(typedArray).promise.then((pdf) => {
        const numPages = Math.min(pdf.numPages, 8); // Leer solo las 5 primeras páginas

        const getPageText = async (pageNum) => {
          const page = await pdf.getPage(pageNum);
          const content = await page.getTextContent();
          const items = content.items.map((item) => item.str);
          return items;
        };

        const extractText = async () => {
          const textItems = [];
          for (let i = 1; i <= numPages; i++) {
            const pageText = await getPageText(i);
            textItems.push(...pageText);
          }
          console.log(textItems)
         setCliente(cliente)
         setNewOrder(textItems);
        };

        extractText();
      });
    };

    reader.readAsArrayBuffer(acceptedFiles[0], 'UTF-8');
    setFile(acceptedFiles[0]);
    
  };
  
  useEffect(() => {
    setArchivo(file)
  }, [file])

  return (
    <div className="App ">
      <h1 className='text-center '>Solo Archivos PDF</h1>
      <Dropzone onDrop={onDrop}>
        {({ getRootProps, getInputProps }) => (
          <div {...getRootProps()} className="dropzone">
            <input type='file' onChange={onInputChange} {...getInputProps()} />
            {(spinnerSwitch === false)?
            (file) ? (        
              <p className='text-center'>Archivo cargado: {file.name}</p>
              ) : (
                <p className='text-center'>Arrastra y suelta un archivo PDF aquí, o haz clic para seleccionar uno.</p>
                )
                :<p className='text-center'><SpinnerCustom/></p>
                }
          </div>
        )}
      </Dropzone>
    </div>
  );
}

