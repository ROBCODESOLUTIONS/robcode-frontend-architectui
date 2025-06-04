import Swal from 'sweetalert2';
import { Redirect } from 'react-router';

export const SET_STUDENTS = 'STUDENTS/SET_STUDENTS';
export const SET_STUDENTS_ERROR = 'STUDENTS/SET_STUDENTS_ERROR'; // Nueva acción para manejar errores


export const getStudents = (accessToken) => {
    console.log("Fetching students...");
    return (dispatch) => {
        const API_URL = process.env.REACT_APP_API_URL;
        const myHeaders = new Headers();
        myHeaders.append("Accept", "application/json");
        myHeaders.append("Authorization", `Bearer ${accessToken}`);

        return fetch(`${API_URL}/api/student`, {
            method: 'GET',
            headers: myHeaders,
        })
            .then((response) => {
                if (!response.ok) {
                    // Manejo de errores en el componente en lugar de aquí
                    throw new Error("Error obteniendo estudiantes.");
                }
                return response.json();
            })
            .then((data) => {
                dispatch(setStudents(data));
            })
            .catch((error) => {
                // Despachar acción para manejar el error
                dispatch(setStudentsError(error.message));
                Swal.fire({ // Mostrar alerta en el componente
                    title: "Error obteniendo estudiantes.",
                    text: error.message,
                    icon: "error"
                });
            });
    };
};

export const createStudent = (accessToken, data) => {
    console.log(accessToken, data)
    return (dispatch) => {
        const API_URL = process.env.REACT_APP_API_URL;
        const myHeaders = new Headers();
        myHeaders.append("Accept", "application/json");
        myHeaders.append("Authorization", `Bearer ${accessToken}`);
        console.log(accessToken, data, myHeaders.get('Authorization'))
        
        return fetch(`${API_URL}/api/student`, {
            method: 'POST',
            headers: myHeaders,
            body: JSON.stringify(data)
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Error creando estudiante.");
                }
                return response.json();
            })
            .then((data) => {
                Redirect('/pages/dashboard/students')
            })
            .catch((error) => {
                dispatch(setStudentsError(error.message));
                Swal.fire({
                    title: "Error creando estudiante.",
                    text: error.message,
                    icon: "error"
                });
            });
    };
};

export const updateStudent = (accessToken, data, id) => {
    return (dispatch) => {
        const API_URL = process.env.REACT_APP_API_URL;
        const myHeaders = new Headers();
        myHeaders.append("Accept", "application/json");
        myHeaders.append("Authorization", `Bearer ${accessToken}`);

        return fetch(`${API_URL}/api/student/${id}`, {
            method: 'PUT',
            headers: myHeaders,
            body: JSON.stringify(data)
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Error actualizando estudiante.");
                }
                return response.json();
            })
            .then((data) => {
                Redirect('/pages/dashboard/students')
            })
            .catch((error) => {
                dispatch(setStudentsError(error.message));
                Swal.fire({
                    title: "Error actualizando estudiante.",
                    text: error.message,
                    icon: "error"
                });
            });
    };
};

export const deleteStudent = (accessToken, id) => {
    return (dispatch) => {
        const API_URL = process.env.REACT_APP_API_URL;
        const myHeaders = new Headers();
        myHeaders.append("Accept", "application/json");
        myHeaders.append("Authorization", `Bearer ${accessToken}`);

        return fetch(`${API_URL}/api/student/${id}`, {
            method: 'DELETE',
            headers: myHeaders,
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Error eliminando estudiante.");
                }
                return response.json();
            })
            .then((data) => {
                console.table(data)
            })
            .catch((error) => {
                dispatch(setStudentsError(error.message));
                Swal.fire({
                    title: "Error eliminando estudiante.",
                    text: error.message,
                    icon: "error"
                });
            });
    };
};



export const setStudents = (students) => ({
    type: SET_STUDENTS,
    students
});

// Nueva acción para manejar el error
export const setStudentsError = (error) => ({
    type: SET_STUDENTS_ERROR,
    error
});

const initialState = {
    rowData: [],
    error: null,
};

export default function reducer(state = initialState, action = {}) {
    switch (action.type) {
        case SET_STUDENTS:
            return {
                ...state,
                rowData: action.students,
                error: null
            };
        case SET_STUDENTS_ERROR:
            return {
                ...state,
                error: action.error
            };
        default:
            return state;
    }
}