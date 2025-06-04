import Swal from 'sweetalert2';
import { Redirect } from 'react-router';

export const SET_TEACHERS = 'STUDENTS/SET_TEACHERS';
export const SET_TEACHERS_ERROR = 'STUDENTS/SET_TEACHERS_ERROR'; // Nueva acción para manejar errores


export const getTeachers = (accessToken) => {
    console.log("Fetching teachers...");
    return (dispatch) => {
        const API_URL = process.env.REACT_APP_API_URL;
        const myHeaders = new Headers();
        myHeaders.append("Accept", "application/json");
        myHeaders.append("Authorization", `Bearer ${accessToken}`);

        return fetch(`${API_URL}/api/teacher`, {
            method: 'GET',
            headers: myHeaders,
        })
            .then((response) => {
                if (!response.ok) {
                    // Manejo de errores en el componente en lugar de aquí
                    throw new Error("Error obteniendo profesores.");
                }
                return response.json();
            })
            .then((data) => {
                dispatch(setTeachers(data));
            })
            .catch((error) => {
                // Despachar acción para manejar el error
                dispatch(setTeachersError(error.message));
                Swal.fire({ // Mostrar alerta en el componente
                    title: "Error obteniendo profesores.",
                    text: error.message,
                    icon: "error"
                });
            });
    };
};

export const createTeacher = (accessToken, data) => {
    console.log(accessToken, data)
    return (dispatch) => {
        const API_URL = process.env.REACT_APP_API_URL;
        const myHeaders = new Headers();
        myHeaders.append("Accept", "application/json");
        myHeaders.append("Authorization", `Bearer ${accessToken}`);
        console.log(accessToken, data, myHeaders.get('Authorization'))
        
        return fetch(`${API_URL}/api/teacher`, {
            method: 'POST',
            headers: myHeaders,
            body: JSON.stringify(data)
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Error creando profesor.");
                }
                return response.json();
            })
            .then((data) => {
                Redirect('/pages/dashboard/teachers')
            })
            .catch((error) => {
                dispatch(setTeachersError(error.message));
                Swal.fire({
                    title: "Error creando profesor.",
                    text: error.message,
                    icon: "error"
                });
            });
    };
};

export const updateTeacher = (accessToken, data, id) => {
    return (dispatch) => {
        const API_URL = process.env.REACT_APP_API_URL;
        const myHeaders = new Headers();
        myHeaders.append("Accept", "application/json");
        myHeaders.append("Authorization", `Bearer ${accessToken}`);

        return fetch(`${API_URL}/api/teacher/${id}`, {
            method: 'PUT',
            headers: myHeaders,
            body: JSON.stringify(data)
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Error actualizando profesor.");
                }
                return response.json();
            })
            .then((data) => {
                Redirect('/pages/dashboard/teachers')
            })
            .catch((error) => {
                dispatch(setTeachersError(error.message));
                Swal.fire({
                    title: "Error actualizando profesor.",
                    text: error.message,
                    icon: "error"
                });
            });
    };
};

export const deleteTeacher = (accessToken, id) => {
    return (dispatch) => {
        const API_URL = process.env.REACT_APP_API_URL;
        const myHeaders = new Headers();
        myHeaders.append("Accept", "application/json");
        myHeaders.append("Authorization", `Bearer ${accessToken}`);

        return fetch(`${API_URL}/api/teacher/${id}`, {
            method: 'DELETE',
            headers: myHeaders,
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Error eliminando profesor.");
                }
                return response.json();
            })
            .then((data) => {
                console.table(data)
            })
            .catch((error) => {
                dispatch(setTeachersError(error.message));
                Swal.fire({
                    title: "Error eliminando profesor.",
                    text: error.message,
                    icon: "error"
                });
            });
    };
};



export const setTeachers = (teachers) => ({
    type: SET_TEACHERS,
    teachers
});

// Nueva acción para manejar el error
export const setTeachersError = (error) => ({
    type: SET_TEACHERS_ERROR,
    error
});

const initialState = {
    rowData: [],
    error: null,
};

export default function reducer(state = initialState, action = {}) {
    switch (action.type) {
        case SET_TEACHERS:
            return {
                ...state,
                rowData: action.teachers,
                error: null
            };
        case SET_TEACHERS_ERROR:
            return {
                ...state,
                error: action.error
            };
        default:
            return state;
    }
}