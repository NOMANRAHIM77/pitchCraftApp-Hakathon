import { createContext,useContext, useState } from "react";


const defaultValue = {
    firstName : "",
    surName : "",
    email : "",
    gender: "",
    dateOfBirth:""
}


export const AuthContext = createContext(defaultValue)

const AuthProvider =({children})=>{
    const [userDetails,setUserDetails] = useState(defaultValue)
       return(
         <AuthContext  value={{userDetails,setUserDetails}} >  {children} </AuthContext>
       )
    }

 export const UseAuthContext =()=>{
    return useContext(AuthContext)
 }
    
export default AuthProvider    