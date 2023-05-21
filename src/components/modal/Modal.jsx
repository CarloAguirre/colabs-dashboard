import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { PdfDrop } from '../pdfDrop/PdfDrop';
import { useOrdenes } from '../../context';


export const ModalPdfDrop =()=> {
  const {onSubmitHandler} = useOrdenes()
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <Button variant="primary" onClick={handleShow}>
        Añadir nueva Orden
      </Button>

      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Agregar Nueva Orden</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <PdfDrop />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cerrar
          </Button>
          <Button variant="primary" onClick={onSubmitHandler}>Agregar</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
