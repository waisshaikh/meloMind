import React from 'react'
import { useAuth } from '../hooks/useAuth'
import { useNavigate } from 'react-router'

const Protected = ({children}) => {

    const {
        user,loading
    }= useAuth()

     const navigate = useNavigate()

      if(loading){
        return <h1>Loaing....</h1>
    }

    if(!loading && !user){
        return <navigate to ="/login"/>
        
    }
   


  return (
    <div>Protected</div>
  )
}

export default Protected