import Swal from 'sweetalert2'

const API_URL = process.env.REACT_APP_API_URL;

const myHeaders = new Headers();
myHeaders.append("Accept", "application/json");
myHeaders.append("Content-Type", "application/json");

export const login = (email, password) => {

    return fetch(`${API_URL}/api/login`, {
        method: 'POST',
        headers: myHeaders,
        body: JSON.stringify({ email, password }),
        redirect: "follow"
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
                localStorage.setItem('token', data.access_token);
                return data;
            }
            throw new Error(data.message || 'Error desconocido');
        })
};

export default {
    login,
};
