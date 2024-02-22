import { useContext } from "react";
import AuthContext from "../context/AuthProvider";
import { GlobalUserContextType } from "../context/AuthProvider";

const useAuth = () => {
    return useContext(AuthContext) as GlobalUserContextType;
};

export default useAuth;