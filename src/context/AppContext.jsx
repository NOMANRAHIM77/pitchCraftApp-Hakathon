import { createContext, useContext } from "react";

export const AppContext = createContext(null) 

const AppProvider =({children})=>{
    return <AppContext   value={"dark"} >{children}</AppContext>
}

//custom hook
export const useAppContext=()=>{
    return useContext(AppContext)
}


export default AppProvider