import {createBrowserRouter} from "react-router";
import Register from "./auth/Pages/Register";
import Login from './auth/Pages/Login';

export const router = createBrowserRouter([
    {
        path:"/",
        element: <h1>Wais shaikh Home</h1>
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

