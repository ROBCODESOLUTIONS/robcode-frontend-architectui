import { createContext, useState, useContext } from 'react';
import PropTypes from "prop-types";
import useNavigate from "react-router-dom";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [authToken, setAuthToken] = useState(JSON.parse(localStorage.getItem('token')));

    const login = (token) => {
        localStorage.setItem('token', JSON.stringify(token));
        setAuthToken(token);
    };

    const logout = () => {
        localStorage.removeItem('token');
        setAuthToken(null);
    };

    const navigate = (path) => {
        navigate(path);
    };

    return (
        <AuthContext.Provider value={{ authToken, login, logout, navigate }}>
            {children}
        </AuthContext.Provider>
    );
};

AuthProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

export const useAuth = () => useContext(AuthContext);
