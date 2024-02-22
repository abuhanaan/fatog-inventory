import { useState, createContext, Dispatch, SetStateAction, FC, ReactNode } from "react"

export interface IUser {
    id: number;
    role: string;
    category: string;
    email: string;
    active: boolean;
};

export type AllUserType = {
    firstName: string;
    lastName: string;
    phoneNumber: string;
    gender: string;
    staffId: number;
};

export type GlobalUserContextType = {
    user: IUser | null;
    setUser: Dispatch<SetStateAction<IUser | null>>;
};

const AuthContext = createContext<GlobalUserContextType | null>({
    user: {
        id: 0,
        role: '',
        category: '',
        email: '',
        active: false
    },
    setUser: () => {}
});

export const AuthProvider: FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<IUser | null>({
        id: 0,
        role: '',
        category: '',
        email: '',
        active: false});

    return (
        <AuthContext.Provider value={{ user, setUser }}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext;