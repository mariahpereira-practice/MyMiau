import { Navigate, Outlet, useLocation } from "react-router"
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { selectAuth } from "../store/slices/auth-slice";
import { Layout } from "../components/Layout";
import { useEffect } from "react";

export const ProtectedRoute = () => {

    const {isAuthenticated} = useSelector(selectAuth);

    const location = useLocation();

    useEffect(() => {
        if(!isAuthenticated) {
            toast.warning("Você precisa fazer o login", {toastId: "auth-warning"});
        }    
    },[isAuthenticated]);

    if(!isAuthenticated){
        return <Navigate to="/login" replace state={{from: location}}></Navigate>
    }

    return (
          <Outlet></Outlet>
    )
}