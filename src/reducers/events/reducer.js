import Swal from 'sweetalert2';

export const SET_EVENTS = 'EVENTS/SET_EVENTS';
export const SET_EVENTS_ERROR = 'EVENTS/SET_EVENTS_ERROR'; // Nueva acción para manejar errores

export const getEvents = (accessToken) => {
    return (dispatch) => {
        const API_URL = process.env.REACT_APP_API_URL;
        const myHeaders = new Headers();
        myHeaders.append("Accept", "application/json");
        myHeaders.append("Authorization", `Bearer ${accessToken}`);

        return fetch(`${API_URL}/api/events`, {
            method: 'GET',
            headers: myHeaders,
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Error obteniendo eventos.");
                }
                return response.json();
            })
            .then((data) => {
                dispatch(setEvents(data));
            })
            .catch((error) => {
                dispatch(setEventsError(error.message));
                Swal.fire({
                    title: "Error obteniendo eventos.",
                    text: error.message,
                    icon: "error"
                });
            });
    };
};

export const createEvent = (accessToken, data) => {
    return (dispatch) => {
        const API_URL = process.env.REACT_APP_API_URL;
        const myHeaders = new Headers();
        myHeaders.append("Accept", "application/json");
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", `Bearer ${accessToken}`);

        return fetch(`${API_URL}/api/events`, {
            method: 'POST',
            headers: myHeaders,
            body: JSON.stringify(data)
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Error creando evento.");
                }
                return response.json();
            })
            .catch((error) => {
                dispatch(setEventsError(error.message));
                Swal.fire({
                    title: "Error creando evento.",
                    text: error.message,
                    icon: "error"
                });
                throw error;
            });
    };
};

export const updateEvent = (accessToken, id, data) => {
    return (dispatch) => {
        const API_URL = process.env.REACT_APP_API_URL;
        const myHeaders = new Headers();
        myHeaders.append("Accept", "application/json");
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", `Bearer ${accessToken}`);

        return fetch(`${API_URL}/api/events/${id}`, {
            method: 'PUT',
            headers: myHeaders,
            body: JSON.stringify(data)
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Error actualizando evento.");
                }
                return response.json();
            })
            .catch((error) => {
                dispatch(setEventsError(error.message));
                Swal.fire({
                    title: "Error actualizando evento.",
                    text: error.message,
                    icon: "error"
                });
                throw error;
            });
    };
};

export const deleteEvent = (accessToken, id) => {
    return (dispatch) => {
        const API_URL = process.env.REACT_APP_API_URL;
        const myHeaders = new Headers();
        myHeaders.append("Accept", "application/json");
        myHeaders.append("Authorization", `Bearer ${accessToken}`);

        return fetch(`${API_URL}/api/events/${id}`, {
            method: 'DELETE',
            headers: myHeaders,
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Error eliminando evento.");
                }
                return response.json();
            })
            .then((data) => {
                console.table(data)
            })
            .catch((error) => {
                dispatch(setEventsError(error.message));
                Swal.fire({
                    title: "Error eliminando evento.",
                    text: error.message,
                    icon: "error"
                });
            });
    };
};

export const setEvents = (events) => ({
    type: SET_EVENTS,
    events
});

// Nueva acción para manejar el error
export const setEventsError = (error) => ({
    type: SET_EVENTS_ERROR,
    error
});

const initialState = {
    events: [],
    error: null,
};

export default function reducer(state = initialState, action = {}) {
    switch (action.type) {
        case SET_EVENTS:
            return {
                ...state,
                events: action.events,
                error: null
            };
        case SET_EVENTS_ERROR:
            return {
                ...state,
                error: action.error
            };
        default:
            return state;
    }
}