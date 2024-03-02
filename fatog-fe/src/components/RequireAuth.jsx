import { useLocation, Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const RequireAuth = () => {
    const { pathname } = useLocation();
    const { user } = useAuth();

    return (
        user?.accessToken
            ? <Outlet />
            : <Navigate to='/' state={{ from: pathname }} replace />
    )
}

export default RequireAuth;