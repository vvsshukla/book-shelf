import { createContext, useContext, useMemo } from "react";
import { useLocalStorage } from "./useLocalStorage";
import { useNavigate } from "react-router-dom";
const AuthContext = createContext();

export const AuthProvider = ({children}) => {
    const [user, setUser] = useLocalStorage('user', null);
    const navigate = useNavigate();
    
    const login = async (data) => {
        setUser(data);
        navigate('/dashboard');
    }

    const logout = () => {
        setUser(null);
        window.location.href = process.env.REACT_APP_BASE_URL;
    }

    const value = useMemo(() => ({
        user,
        login,
        logout
    }), [user]);

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
    return useContext(AuthContext);
}