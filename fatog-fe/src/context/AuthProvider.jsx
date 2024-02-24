import { useState, createContext } from "react";
import { useContext } from "react";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState({});

    const login = (currentUser) => {
        setUser(currentUser);
    };

    const logout = () => {
        setUser({});
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext;