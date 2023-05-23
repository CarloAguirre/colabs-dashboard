import React, { useEffect, useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import Dropzone from 'react-dropzone';
import './pdfDrop.css'
import { useOrdenes } from '../../context';


pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

export const PdfDrop =()=> {
  //cargar imagen 
  const {setArchivo, setNewOrder, archivo} = useOrdenes()
    
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
        const numPages = Math.min(pdf.numPages, 2); // Leer solo las dos primeras páginas

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
          // console.log(textItems)
         setNewOrder(textItems);
        };

        extractText();
      });
    };

    reader.readAsArrayBuffer(acceptedFiles[0]);
    setFile(acceptedFiles[0]);
    
  };
  
  useEffect(() => {
    setArchivo(file)
  }, [file])

  return (
    <div className="App">
      <h1 className='text-center'>Solo Archivos PDF</h1>
      <Dropzone onDrop={onDrop}>
        {({ getRootProps, getInputProps }) => (
          <div {...getRootProps()} className="dropzone">
            <input type='file' onChange={onInputChange} {...getInputProps()} />
            {file ? (        
              <p className='text-center'>Archivo cargado: {file.name}</p>
            ) : (
              <p className='text-center'>Arrastra y suelta un archivo PDF aquí, o haz clic para seleccionar uno.</p>
            )}
          </div>
        )}
      </Dropzone>
    </div>
  );
}

