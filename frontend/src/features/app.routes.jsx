import {createBrowserRouter} from "react-router";
import Register from "./auth/Pages/Register";
import Login from './auth/Pages/Login';
import Protected from "./auth/components/Protected";

export const router = createBrowserRouter([
    {
        path:"/",
        element: <Protected><h1>Home</h1></Protected>
    },
    {   
        path:"/register",
        element:<Register/>
    },
    {
        path:"/login",
        element:<Login/>
        
    }
]);

