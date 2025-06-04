import Swal from 'sweetalert2';

export const SET_SEASONS = 'SEASONS/SET_SEASONS';
export const SET_SEASONS_ERROR = 'SEASONS/SET_SEASONS_ERROR'; // Nueva acción para manejar errores

export const getSeasons = (accessToken) => {
    return (dispatch) => {
        const API_URL = process.env.REACT_APP_API_URL;
        const myHeaders = new Headers();
        myHeaders.append("Accept", "application/json");
        myHeaders.append("Authorization", `Bearer ${accessToken}`);

        return fetch(`${API_URL}/api/content/contents`, {
            method: 'GET',
            headers: myHeaders,
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Error obteniendo libros."); 
                }
                return response.json();
            })
            .then((data) => {
                console.log("Seasons");
                console.table(data);
                dispatch(setSeasons(data));
            })
            .catch((error) => {
                dispatch(setSeasonsError(error.message));
                Swal.fire({
                    title: "Error obteniendo libros.",
                    text: error.message,
                    icon: "error"
                });
            });
    };
};

export const deleteSeason = (accessToken, id) => {
    return (dispatch) => {
        const API_URL = process.env.REACT_APP_API_URL;
        const myHeaders = new Headers();
        myHeaders.append("Accept", "application/json");
        myHeaders.append("Authorization", `Bearer ${accessToken}`);

        return fetch(`${API_URL}/api/content/contents/${id}`, {
            method: 'DELETE',
            headers: myHeaders,
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Error eliminando sesión.");
                }
                return response.json();
            })
            .then((data) => {
                console.table(data)
            })
            .catch((error) => {
                dispatch(setSeasonsError(error.message));
                Swal.fire({
                    title: "Error eliminando sesión.",
                    text: error.message,
                    icon: "error"
                });
            });
    };
};

export const setSeasons = (seasons) => ({
    type: SET_SEASONS,
    seasons
});

// Nueva acción para manejar el error
export const setSeasonsError = (error) => ({
    type: SET_SEASONS_ERROR,
    error
});

const initialState = {
    seasons: [],
    error: null,
};

export default function reducer(state = initialState, action = {}) {
    switch (action.type) {
        case SET_SEASONS:
            console.log(state);
            return {
                ...state,
                seasons: action.seasons,
                rowData: action.seasons,
                error: null
            };
        case SET_SEASONS_ERROR:
            return {
                ...state,
                error: action.error
            };
        default:
            return state;
    }
}