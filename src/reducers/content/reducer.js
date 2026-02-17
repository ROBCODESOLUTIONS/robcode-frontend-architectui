import Swal from 'sweetalert2';

export const SET_CONTENT_LIST = 'CONTENT/SET_CONTENT_LIST';
export const SET_CONTENT_DETAIL_CHILDREN = 'CONTENT/SET_CONTENT_DETAIL_CHILDREN';
export const SET_CONTENT_ERROR = 'CONTENT/SET_CONTENT_ERROR';

export const getContentSections = (accessToken, group = 0) => {
    return (dispatch) => {
        const API_URL = process.env.REACT_APP_API_URL;
        const myHeaders = new Headers();
        myHeaders.append("Accept", "application/json");
        myHeaders.append("Authorization", `Bearer ${accessToken}`);

        return fetch(`${API_URL}/api/content/full_content_group/${group}`, {
            method: 'GET',
            headers: myHeaders,
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Error obteniendo secciones.");
                }
                return response.json();
            })
            .then((data) => {
                dispatch(setContentList(data));
            })
            .catch((error) => {
                dispatch(setContentsError(error.message));
                Swal.fire({
                    title: "Error obteniendo secciones.",
                    text: error.message,
                    icon: "error"
                });
            });
    };
};

export const getContentDetail = (accessToken, id = 0) => {
    return (dispatch) => {
        const API_URL = process.env.REACT_APP_API_URL;
        const myHeaders = new Headers();
        myHeaders.append("Accept", "application/json");
        myHeaders.append("Authorization", `Bearer ${accessToken}`);

        return fetch(`${API_URL}/api/content/full_content/${id}`, {
            method: 'GET',
            headers: myHeaders,
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Error obteniendo hijos del contenido.");
                }
                return response.json();
            })
            .then((data) => {
                dispatch(setContentDetailChildren(data));
            })
            .catch((error) => {
                dispatch(setContentsError(error.message));
                Swal.fire({
                    title: "Error obteniendo hijos del contenido.",
                    text: error.message,
                    icon: "error"
                });
            });
    };
};

export const deleteContent = (accessToken, id) => {
    return (dispatch) => {
        const API_URL = process.env.REACT_APP_API_URL;
        const myHeaders = new Headers();
        myHeaders.append("Accept", "application/json");
        myHeaders.append("Authorization", `Bearer ${accessToken}`);

        return fetch(`${API_URL}/api/content/section/${id}`, {
            method: 'DELETE',
            headers: myHeaders,
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Error eliminando sección.");
                }
                return response.json();
            })
            .then((data) => {
                console.table(data);
                // Opcional: refrescar lista después del delete
                // dispatch(getContentSections(accessToken));
            })
            .catch((error) => {
                dispatch(setContentsError(error.message));
                Swal.fire({
                    title: "Error eliminando sección.",
                    text: error.message,
                    icon: "error"
                });
            });
    };
};

export const setContentList = (list) => ({
    type: SET_CONTENT_LIST,
    list,
});

export const setContentDetailChildren = (children) => ({
    type: SET_CONTENT_DETAIL_CHILDREN,
    children,
});

export const setContentsError = (error) => ({
    type: SET_CONTENT_ERROR,
    error,
});

const initialState = {
    rowData: [],           // Lista principal (full_content_group)
    children: [],          // Hijos del detalle (full_content/:id)
    error: null,
};

export default function reducer(state = initialState, action = {}) {
    switch (action.type) {
        case SET_CONTENT_LIST:
            return {
                ...state,
                rowData: Array.isArray(action.list) ? action.list : [],
                error: null,
            };
        case SET_CONTENT_DETAIL_CHILDREN:
            return {
                ...state,
                children: Array.isArray(action.children) ? action.children : [],
                error: null,
            };
        case SET_CONTENT_ERROR:
            return {
                ...state,
                error: action.error,
            };
        default:
            return state;
    }
}
