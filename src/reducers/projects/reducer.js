import Swal from 'sweetalert2';

export const SET_PROJECTS = 'PROJECTS/SET_PROJECTS';
export const SET_PROJECTS_ERROR = 'PROJECTS/SET_PROJECTS_ERROR'; // Nueva acción para manejar errores

export const getProjects = (accessToken) => {
    return (dispatch) => {
        const API_URL = process.env.REACT_APP_API_URL;
        const myHeaders = new Headers();
        myHeaders.append("Accept", "application/json");
        myHeaders.append("Authorization", `Bearer ${accessToken}`);

        return fetch(`${API_URL}/api/content/projects`, {
            method: 'POST',
            headers: myHeaders,
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Error obteniendo proyectos."); 
                }
                return response.json();
            })
            .then((data) => {
                dispatch(setProjects(data));
            })
            .catch((error) => {
                dispatch(setProjectsError(error.message));
                Swal.fire({
                    title: "Error obteniendo proyectos.",
                    text: error.message,
                    icon: "error"
                });
            });
    };
};

export const setProjects = (projects) => ({
    type: SET_PROJECTS,
    projects
});

// Nueva acción para manejar el error
export const setProjectsError = (error) => ({
    type: SET_PROJECTS_ERROR,
    error
});

const initialState = {
    projects: [],
    error: null,
};

export default function reducer(state = initialState, action = {}) {
    switch (action.type) {
        case SET_PROJECTS:
            return {
                ...state,
                projects: action.projects,
                error: null
            };
        case SET_PROJECTS_ERROR:
            return {
                ...state,
                error: action.error
            };
        default:
            return state;
    }
}