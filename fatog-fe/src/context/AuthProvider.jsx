import { useState, useEffect, createContext } from "react";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
    const storedUser = JSON.parse(sessionStorage.getItem('user'));
    const [user, setUser] = useState(storedUser ?? {});

    useEffect(() => {
        const storedUser = JSON.parse(sessionStorage.getItem('user'));
        setUser(storedUser);
    }, []);

    const login = (currentUser) => {
        sessionStorage.setItem('user', JSON.stringify(currentUser));
        setUser(currentUser);
    };

    const logout = () => {
        sessionStorage.removeItem('user');
        setUser({});
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext;