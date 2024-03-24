import { useState, useEffect, createContext } from "react";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    const [user, setUser] = useState(storedUser ?? {});

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        setUser(storedUser);
    }, []);

    const login = (currentUser) => {
        localStorage.setItem('user', JSON.stringify(currentUser));
        setUser(currentUser);
    };

    const logout = () => {
        localStorage.removeItem('user');
        setUser({});
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext;