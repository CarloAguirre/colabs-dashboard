import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';

export const SpinnerCustom = () => {
  return (
    <div className='d-flex align-items-center justify-content-center'>
  <Button variant="primary" disabled>
    <Spinner
      as="span"
      animation="grow"
      size="sm"
      role="status"
      aria-hidden="true"
      style={{padding: "10px"}}
      />
    Cargando archivo...
  </Button>
      </div>
  )
}
