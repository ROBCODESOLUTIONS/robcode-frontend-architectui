import Swal from 'sweetalert2';
import { Redirect } from 'react-router';

export const SET_ENTITIES = 'ENTITIES/SET_ENTITIES';
export const SET_ENTITIES_ERROR = 'ENTITIES/SET_ENTITIES_ERROR'; // Nueva acción para manejar errores


export const getEntities = (accessToken) => {
    return (dispatch) => {
        const API_URL = process.env.REACT_APP_API_URL;
        const myHeaders = new Headers();
        myHeaders.append("Accept", "application/json");
        myHeaders.append("Authorization", `Bearer ${accessToken}`);

        return fetch(`${API_URL}/api/entity`, {
            method: 'GET',
            headers: myHeaders,
        })
            .then((response) => {
                if (!response.ok) {
                    // Manejo de errores en el componente en lugar de aquí
                    throw new Error("Error obteniendo entidades.");
                }
                return response.json();
            })
            .then((data) => {
                dispatch(setEntities(data));
            })
            .catch((error) => {
                // Despachar acción para manejar el error
                dispatch(setEntitiesError(error.message));
                Swal.fire({ // Mostrar alerta en el componente
                    title: "Error obteniendo entidades.",
                    text: error.message,
                    icon: "error"
                });
            });
    };
};

export const createEntity = (accessToken, data) => {
    console.log(accessToken, data)
    return (dispatch) => {
        const API_URL = process.env.REACT_APP_API_URL;
        const myHeaders = new Headers();
        myHeaders.append("Accept", "application/json");
        myHeaders.append("Authorization", `Bearer ${accessToken}`);
        console.log(accessToken, data, myHeaders.get('Authorization'))
        
        return fetch(`${API_URL}/api/entity`, {
            method: 'POST',
            headers: myHeaders,
            body: JSON.stringify(data)
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Error creando entidad.");
                }
                return response.json();
            })
            .then((data) => {
                Redirect('/pages/dashboard/entities')
            })
            .catch((error) => {
                dispatch(setEntitiesError(error.message));
                Swal.fire({
                    title: "Error creando entidad.",
                    text: error.message,
                    icon: "error"
                });
            });
    };
};

export const updateEntity = (accessToken, data, id) => {
    return (dispatch) => {
        const API_URL = process.env.REACT_APP_API_URL;
        const myHeaders = new Headers();
        myHeaders.append("Accept", "application/json");
        myHeaders.append("Authorization", `Bearer ${accessToken}`);

        return fetch(`${API_URL}/api/entity/${id}`, {
            method: 'PUT',
            headers: myHeaders,
            body: JSON.stringify(data)
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Error actualizando entidad.");
                }
                return response.json();
            })
            .then((data) => {
                Redirect('/pages/dashboard/entities')
            })
            .catch((error) => {
                dispatch(setEntitiesError(error.message));
                Swal.fire({
                    title: "Error actualizando entidad.",
                    text: error.message,
                    icon: "error"
                });
            });
    };
};

export const deleteEntity = (accessToken, id) => {
    return (dispatch) => {
        const API_URL = process.env.REACT_APP_API_URL;
        const myHeaders = new Headers();
        myHeaders.append("Accept", "application/json");
        myHeaders.append("Authorization", `Bearer ${accessToken}`);

        return fetch(`${API_URL}/api/entity/${id}`, {
            method: 'DELETE',
            headers: myHeaders,
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Error eliminando entidad.");
                }
                return response.json();
            })
            .then((data) => {
                console.table(data)
            })
            .catch((error) => {
                dispatch(setEntitiesError(error.message));
                Swal.fire({
                    title: "Error eliminando entidad.",
                    text: error.message,
                    icon: "error"
                });
            });
    };
};



export const setEntities = (entities) => ({
    type: SET_ENTITIES,
    entities
});

// Nueva acción para manejar el error
export const setEntitiesError = (error) => ({
    type: SET_ENTITIES_ERROR,
    error
});

const initialState = {
    entities: [],
    error: null,
};

export default function reducer(state = initialState, action = {}) {
    switch (action.type) {
        case SET_ENTITIES:
            return {
                ...state,
                entities: action.entities,
                error: null
            };
        case SET_ENTITIES_ERROR:
            return {
                ...state,
                error: action.error
            };
        default:
            return state;
    }
}