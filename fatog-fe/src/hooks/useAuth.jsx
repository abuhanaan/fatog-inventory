import { useContext } from "react";
import AuthContext from "../context/AuthProvider";
import { redirect } from "react-router-dom";

const useAuth = () => {
    return useContext(AuthContext);
};

export async function requireAuth(request) {
    const isLoggedIn = JSON.parse(sessionStorage.getItem('user')) || false;
    const pathname = new URL(request.url).pathname;

    if (!isLoggedIn) {
        throw redirect(`/?message=Please login to continue&redirectTo=${pathname}`);
    }
}

export default useAuth;