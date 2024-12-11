import Swal from 'sweetalert2';

export const SET_ROBCODE_SERVICE = 'ROBCODE_SERVICE/SET_ROBCODE_SERVICE';
export const SET_API_URL = 'ROBCODE_SERVICE/SET_API_URL';
export const SET_ACCESS_TOKEN = 'ROBCODE_SERVICE/SET_ACCESS_TOKEN';
export const LOGOUT = 'ROBCODE_SERVICE/LOGOUT';

export const setApiUrl = (apiUrl) => ({
    type: SET_API_URL,
    apiUrl
});

export const logout = () => {
    return (dispatch) => {
        localStorage.removeItem('token'); // Limpia el token del almacenamiento local
        dispatch({ type: LOGOUT }); // Despacha la acción de logout
        Swal.fire({
            title: "Has cerrado sesión.",
            icon: "success"
        });
    };
};

export const login = (email, password) => {
    return (dispatch) => {
        const API_URL = process.env.REACT_APP_API_URL;
        const myHeaders = new Headers();
        myHeaders.append("Accept", "application/json");
        myHeaders.append("Content-Type", "application/json");

        return fetch(`${API_URL}/api/login`, {
            method: 'POST',
            headers: myHeaders,
            body: JSON.stringify({ email, password })
        })
            .then((response) => {
                if (!response.ok) {
                    Swal.fire({
                        title: "Error en la autenticación, valida las credenciales."
                    });
                    throw new Error('Error en la autenticación');
                }
                return response.json();
            })
            .then((data) => {
                if (data.access_token) {
                    const json = JSON.stringify(data);
                    localStorage.setItem('token', json);
                    dispatch(setAccessToken(json)); // Despacha la acción para establecer el token
                    return data;
                }
                throw new Error(data.message || 'Error desconocido');
            });
    };
};

export const setAccessToken = (accessToken) => ({
    type: SET_ACCESS_TOKEN,
    accessToken
});

const initialState = {
    API_URL: process.env.REACT_APP_API_URL,
    accessToken: localStorage.getItem('token'),
    logout
};

export default function reducer(state = initialState, action = {}) {
    switch (action.type) {
        case SET_ROBCODE_SERVICE:
            return {
                ...state,
                robcodeService: action.robcodeService
            };
        case SET_API_URL:
            return {
                ...state,
                API_URL: action.apiUrl
            };
        case SET_ACCESS_TOKEN:
            return {
                ...state,
                accessToken: action.accessToken
            };
        case LOGOUT:
            return {
                ...state,
                accessToken: null
            };
        default:
            return state; // Retorna el estado por defecto
    }
}