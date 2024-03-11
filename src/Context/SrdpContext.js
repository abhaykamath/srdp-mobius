import { createContext, useState } from "react";


export const SrdpContext = createContext();

export const ContextProvider = ({ children }) => {
    const [expandNav,setExpandNav] = useState(false)
    return (
        <SrdpContext.Provider value={{ expandNav, setExpandNav }}>
            {children}
        </SrdpContext.Provider>
    )
}