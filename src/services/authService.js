import Swal from 'sweetalert2'

export const login = (email, password) => {
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
                localStorage.setItem('token', data.access_token);
                return data;
            }
            throw new Error(data.message || 'Error desconocido');
        })

};

const getCookie = (name) => {
    console.log(name);
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
};

export default {
    login,
};
