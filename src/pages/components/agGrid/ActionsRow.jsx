import { Link } from "react-router-dom";

const emitEvent = (eventName, eventListeners) => {
  if (eventListeners[eventName]) {
    eventListeners[eventName].forEach((listener) => listener());
  }
};

/**
 *
 * @param value argument passed to dispathcer function
 * @param eventName name of event to be emmited in bus
 * @param deleteDispatcher custom function to be called on delete event
 * @param authToken Authentication Object to use in deleteDispatcher
 * @param eventListeners bus reference to update parent component list
 * @returns
 */
const ActionsRow = ({
  value,
  eventName,
  deleteDispatcher,
  authToken,
  eventListeners,
  editUrl,
}) => {
  const handleDeleteDispatcher = (token, value) => {
    deleteDispatcher(token, value)
      .then((data) => {
        console.log(data);
        emitEvent(eventName, eventListeners); // Emitir evento de actualización al componente padre
      })
      .catch((error) => console.error("Error deleting object ", error));
  };

  return (
    value && (
      <>
        <Link className="btn btn-primary" to={editUrl}>
          Editar
        </Link>
        <a
          className="btn btn-danger"
          onClick={() => handleDeleteDispatcher(authToken.access_token, value)}
        >
          Eliminar
        </a>
      </>
    )
  );
};

export default ActionsRow;
