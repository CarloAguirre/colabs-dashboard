import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { PdfDrop } from '../pdfDrop/PdfDrop';
import { useOrdenes } from '../../context';


export const ModalPdfDrop =({cliente})=> {
  const {onSubmitHandler} = useOrdenes()
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
    {
      cliente === "invoice" || cliente === "licitacion" ? (
        <Button variant="outline-info" onClick={handleShow} className="btn-lg">
          Añadir {cliente.toUpperCase()}
        </Button>
      ) : (
        <Button variant="outline-primary" onClick={handleShow}>
          Añadir orden {cliente.toUpperCase()}
        </Button>
      )
    }


      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          {(cliente === 'codelco' || cliente === 'bhp') && <Modal.Title>Agregar Orden</Modal.Title>}
          {(cliente === 'invoice') && <Modal.Title>Añadir Invoice</Modal.Title> }
          {(cliente === 'licitacion') && <Modal.Title>Añadir Licitación</Modal.Title> }
        </Modal.Header>
        <Modal.Body>
          <PdfDrop cliente={cliente} />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cerrar
          </Button>
          {(cliente === "codelco") &&
          <Button variant="primary" onClick={onSubmitHandler} name='646d30f6df85d0a4c4958449'>Agregar</Button>}
         {(cliente === "bhp") &&
          <Button variant="primary" onClick={onSubmitHandler} name='646e2f1943ba97fc705a0276'>Agregar</Button>}
          {(cliente === "invoice" || cliente === "licitacion") &&
          <Button variant="primary" onClick={onSubmitHandler} name={cliente}>Agregar</Button>}
        </Modal.Footer>
      </Modal>
    </>
  );
}
