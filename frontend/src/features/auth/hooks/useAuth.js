import { login,register,getme,logout } from "../services/auth.api";
import { useContext } from "react";
import { AuthContext } from "../auth.context";

export const useAuth=()=>{
    const context = useContext(AuthContext)
    const {user,setUser, loading,setLoading}=context

    async function handleRegister({username,email,password}){
        setLoading(true)
        const data = await register({username,email,password})
        setUser=(data.user)
        setLoading(false)

    }


    async function handleLogin({username,email,password}) {
        setLoading(true)
        const data = await login({username,email,password})
        setUser(data.user)
        setLoading(false)
        
    }


    async function handleGetme (){
        setLoading(true)
        const data = await getme()  
        setUser=(data.user)
        setLoading(false)
    }

    async function handleLogout(){
        setLoading(true)
        const data = await logout()
        setUser(null);
        setLoading(false)
    }

    return({
        user,loading,handleRegister,handleLogin,handleGetme,handleLogout
    })
}