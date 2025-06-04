import Swal from 'sweetalert2';
import { Redirect } from 'react-router';

export const SET_COURSES = 'COURSES/SET_COURSES';
export const SET_COURSES_ERROR = 'COURSES/SET_COURSES_ERROR'; // Nueva acción para manejar errores


export const getCourses = (accessToken) => {
    console.log("Fetching courses...");
    return (dispatch) => {
        const API_URL = process.env.REACT_APP_API_URL;
        const myHeaders = new Headers();
        myHeaders.append("Accept", "application/json");
        myHeaders.append("Authorization", `Bearer ${accessToken}`);

        return fetch(`${API_URL}/api/classroom`, {
            method: 'GET',
            headers: myHeaders,
        })
            .then((response) => {
                if (!response.ok) {
                    // Manejo de errores en el componente en lugar de aquí
                    throw new Error("Error obteniendo cursos.");
                }
                return response.json();
            })
            .then((data) => {
                dispatch(setCourses(data));
            })
            .catch((error) => {
                // Despachar acción para manejar el error
                dispatch(setCoursesError(error.message));
                Swal.fire({ // Mostrar alerta en el componente
                    title: "Error obteniendo cursos.",
                    text: error.message,
                    icon: "error"
                });
            });
    };
};

export const createCourse = (accessToken, data) => {
    console.log(accessToken, data)
    return (dispatch) => {
        const API_URL = process.env.REACT_APP_API_URL;
        const myHeaders = new Headers();
        myHeaders.append("Accept", "application/json");
        myHeaders.append("Authorization", `Bearer ${accessToken}`);
        console.log(accessToken, data, myHeaders.get('Authorization'))
        
        return fetch(`${API_URL}/api/course`, {
            method: 'POST',
            headers: myHeaders,
            body: JSON.stringify(data)
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Error creando curso.");
                }
                return response.json();
            })
            .then((data) => {
                Redirect('/pages/dashboard/courses')
            })
            .catch((error) => {
                dispatch(setCoursesError(error.message));
                Swal.fire({
                    title: "Error creando entidad.",
                    text: error.message,
                    icon: "error"
                });
            });
    };
};

export const updateCourse = (accessToken, data, id) => {
    return (dispatch) => {
        const API_URL = process.env.REACT_APP_API_URL;
        const myHeaders = new Headers();
        myHeaders.append("Accept", "application/json");
        myHeaders.append("Authorization", `Bearer ${accessToken}`);

        return fetch(`${API_URL}/api/course/${id}`, {
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
                Redirect('/pages/dashboard/courses')
            })
            .catch((error) => {
                dispatch(setCoursesError(error.message));
                Swal.fire({
                    title: "Error actualizando entidad.",
                    text: error.message,
                    icon: "error"
                });
            });
    };
};

export const deleteCourse = (accessToken, id) => {
    return (dispatch) => {
        const API_URL = process.env.REACT_APP_API_URL;
        const myHeaders = new Headers();
        myHeaders.append("Accept", "application/json");
        myHeaders.append("Authorization", `Bearer ${accessToken}`);

        return fetch(`${API_URL}/api/course/${id}`, {
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
                dispatch(setCoursesError(error.message));
                Swal.fire({
                    title: "Error eliminando entidad.",
                    text: error.message,
                    icon: "error"
                });
            });
    };
};



export const setCourses = (courses) => ({
    type: SET_COURSES,
    courses
});

// Nueva acción para manejar el error
export const setCoursesError = (error) => ({
    type: SET_COURSES_ERROR,
    error
});

const initialState = {
    rowData: [],
    error: null,
};

export default function reducer(state = initialState, action = {}) {
    switch (action.type) {
        case SET_COURSES:
            return {
                ...state,
                rowData: action.courses,
                error: null
            };
        case SET_COURSES_ERROR:
            return {
                ...state,
                error: action.error
            };
        default:
            return state;
    }
}