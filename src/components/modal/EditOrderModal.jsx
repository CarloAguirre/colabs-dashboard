import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import { orderNewData } from '../../helpers/orderNewData';

export const EditOrderModal = ({ order }) => {
 
  const [show, setShow] = useState(false);
  const [orderData, setOrderData] = useState({
    "numero": order.numero,
    "fecha": order.fecha,
    "division": order.division,
    "entrega": order.entrega,
    "material": order.material,
    "cantidad": order.cantidad,
    "precio": order.precio,
    "descripcion": order.descripcion,
  })

  const {numero, fecha, division, entrega, material, cantidad, precio, descripcion} = orderData

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const onInputChange = async({target})=>{
      const {name, value, type } = target
    
    if(type === "number"){
      await setOrderData({...orderData, 
        [name]: Number(value)
    })
    }else{
      await setOrderData({...orderData, 
        [name]: value
    })
    }
      console.log(orderData)
  }

  const onSubmit = async()=>{
    await orderNewData(order._id, orderData)
  }

  return (
    <>
      <Button variant="white" onClick={handleShow}>
      <span class="material-icons" style={{background: "transparent", color: "black"}}>
          drive_file_rename_outline
        </span>
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Editar Orden N° {order.numero}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <>
          <FloatingLabel
            controlId="floatingInput"
            label="Numero"
            className="mb-3"
            
          >
            <Form.Control type="number" placeholder={numero}
            value={numero}
            name="numero"
            onChange={onInputChange} />
          </FloatingLabel>

          <FloatingLabel
            controlId="floatingInput"
            label="Descripción"
            className="mb-3"
            
          >
            <Form.Control type="text" placeholder={descripcion}
            value={descripcion}
            name="descripcion"
            onChange={onInputChange} />
          </FloatingLabel>

          <FloatingLabel
            controlId="floatingInput"
            label="Fecha"
            className="mb-3"
 
          >
          <Form.Control type="text" placeholder={fecha}
            value={fecha}
            name="fecha"
            onChange={onInputChange} />
          </FloatingLabel>

          <FloatingLabel
            controlId="floatingInput"
            label="División"
            className="mb-3"

          >
          <Form.Control type="text" placeholder={division}
            value={division}
            name="division"
            onChange={onInputChange} />
          </FloatingLabel>

          <FloatingLabel
            controlId="floatingInput"
            label="Entrega"
            className="mb-3"

          >
          <Form.Control type="text" placeholder={entrega}
            value={entrega}
            name="entrega"
            onChange={onInputChange} />
          </FloatingLabel>

          <FloatingLabel
            controlId="floatingInput"
            label="Material"
            className="mb-3"
          >
          <Form.Control type="text" placeholder={material}
            value={material}
            name="material"
            onChange={onInputChange} />
          </FloatingLabel>

          <FloatingLabel
            controlId="floatingInput"
            label="Precio"
            className="mb-3"
          >
          <Form.Control type="number" placeholder={precio}
            value={precio}
            name="precio"
            onChange={onInputChange} />
          </FloatingLabel>

          <FloatingLabel
            controlId="floatingInput"
            label="Cantidad"
            className="mb-3"
          >
          <Form.Control type="number" placeholder={cantidad}
            value={cantidad}
            name="cantidad"
            onChange={onInputChange} />
          </FloatingLabel>   
          
          
        </>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cerrar
          </Button>
          <Button variant="primary" onClick={onSubmit}>
            Guardar Cambios
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}