import { compararFechas } from "./compararFechas";

export const licitationsTableModel = (estado, orders, licitationsAscendente, setOrdenAscendente, licitations) => {

  function handleClick() {
    // Invertir el orden actual
    setOrdenAscendente(!licitationsAscendente);
  }


  const licitationsDateSort = licitations.map(order => order)
  .sort((a, b) => {
    if (licitationsAscendente) {
      return compararFechas(a.fecha, b.fecha);
    } else {
      return compararFechas(b.fecha, a.fecha);
    }
  });

  return (
    <div className="table-container table-size mt-5">
      <table className="table table-bordered table-striped" id="tabla">
        <thead>
          <tr>
            <th scope="col">N° DE LICITACION</th>
            <th scope="col">N° DE RESPUESTA</th>
            {estado === "complete" && <th scope="col">ORDEN</th>}
            <th scope="col">DESCRIPCIÓN</th>
            <th scope="col">FECHA<button onClick={handleClick}><span class="material-icons-outlined">
            restart_alt
            </span></button></th>
            <th scope="col">MATERIAL</th>
            <th scope="col">CANTIDAD</th>
            <th scope="col">PRECIO/U</th>
            <th scope="col">TOTAL</th>
          </tr>
        </thead>
        <tbody id="full-list">
          {licitationsDateSort &&
            licitationsDateSort.map((licitacion) => {
              let price = Number(licitacion.precio);
              const formattedPrice = price.toLocaleString("en-US", {
                style: "currency",
                currency: "USD",
                minimumFractionDigits: 2,
              });
              const formattedPrecioUnitario = (
                Number(licitacion.precio / Number(licitacion.cantidad))
              ).toLocaleString("en-US", {
                style: "currency",
                currency: "USD",
                minimumFractionDigits: 2,
              });

              const matchingOrder = orders.find(
                (order) => licitacion.rfx === order.rfx
              );

              if (estado === "complete" && matchingOrder) {
                return (
                  <tr key={licitacion.numero}>
                    <td>{licitacion.rfx}</td>
                    <td>
                      <a href={licitacion.img} target="_blank" rel="noreferrer">
                        {licitacion.numero}
                      </a>
                    </td>
                    <td><a href={matchingOrder.img} target='_blank' rel="noreferrer">{matchingOrder.numero}</a></td>
                    <td>{licitacion.descripcion}</td>
                    <td>{licitacion.fecha}</td>
                    <td>{licitacion.material}</td>
                    <td>{licitacion.cantidad}</td>
                    {licitacion.material.includes("/") ? (
                      <td>{formattedPrice}</td>
                    ) : (
                      <td>{formattedPrecioUnitario}</td>
                    )}
                    <td>{formattedPrice}</td>
                  </tr>
                );
              } else if (estado === "incomplete" && !matchingOrder) {
                return (
                  <tr key={licitacion.numero}>
                    <td>{licitacion.rfx}</td>
                    <td>
                      <a href={licitacion.img} target="_blank" rel="noreferrer">
                        {licitacion.numero}
                      </a>
                    </td>
                    <td>{licitacion.descripcion}</td>
                    <td>{licitacion.fecha}</td>
                    <td>{licitacion.material}</td>
                    <td>{licitacion.cantidad}</td>
                    {licitacion.material.includes("/") ? (
                      <td>{formattedPrice}</td>
                    ) : (
                      <td>{formattedPrecioUnitario}</td>
                    )}
                    <td>{formattedPrice}</td>
                  </tr>
                );
              }
              return null; // Si no cumple ninguna condición, no se renderiza ninguna fila
            })}
        </tbody>
      </table>
    </div>
  );
};
