import Swal from 'sweetalert2';

export const SET_BOOKS = 'BOOKS/SET_BOOKS';
export const SET_BOOKS_ERROR = 'BOOKS/SET_BOOKS_ERROR'; // Nueva acción para manejar errores

export const getBooks = (accessToken) => {
    return (dispatch) => {
        const API_URL = process.env.REACT_APP_API_URL;
        const myHeaders = new Headers();
        myHeaders.append("Accept", "application/json");
        myHeaders.append("Authorization", `Bearer ${accessToken}`);

        return fetch(`${API_URL}/api/content/books`, {
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
                dispatch(setBooks(data));
            })
            .catch((error) => {
                dispatch(setBooksError(error.message));
                Swal.fire({
                    title: "Error obteniendo libros.",
                    text: error.message,
                    icon: "error"
                });
            });
    };
};

export const deleteBook = (accessToken, id) => {
    return (dispatch) => {
        const API_URL = process.env.REACT_APP_API_URL;
        const myHeaders = new Headers();
        myHeaders.append("Accept", "application/json");
        myHeaders.append("Authorization", `Bearer ${accessToken}`);

        return fetch(`${API_URL}/api/content/books/${id}`, {
            method: 'DELETE',
            headers: myHeaders,
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Error eliminando libro.");
                }
                return response.json();
            })
            .then((data) => {
                console.table(data)
            })
            .catch((error) => {
                dispatch(setBooksError(error.message));
                Swal.fire({
                    title: "Error eliminando libro.",
                    text: error.message,
                    icon: "error"
                });
            });
    };
};

export const setBooks = (BOOKS) => ({
    type: SET_BOOKS,
    BOOKS
});

// Nueva acción para manejar el error
export const setBooksError = (error) => ({
    type: SET_BOOKS_ERROR,
    error
});

const initialState = {
    rowData: [],
    error: null,
};

export default function reducer(state = initialState, action = {}) {
    switch (action.type) {
        case SET_BOOKS:
            return {
                ...state,
                rowData: Array.isArray(action.BOOKS) ? action.BOOKS : [],
                error: null,
            };
        case SET_BOOKS_ERROR:
            return {
                ...state,
                error: action.error,
            };
        default:
            return state;
    }
}