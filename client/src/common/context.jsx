import { createContext, useContext, useEffect, useState } from "react";
import { lookInSession } from "./session";
import { ThemeContext } from "./theme-context";

export const UserContext = createContext();


export const UserProvider = ({ children }) => {
    const {theme,setTheme} = useContext(ThemeContext);
    
    const [user, setUser] = useState({});

    useEffect(() => {
        let userInSession = lookInSession("user");
        let themeInSession = lookInSession("theme");

        userInSession ? setUser(JSON.parse(userInSession)) : setUser({ access_token: null, username: null, profile_img: null, fullname: null, new_notifications_available: null});

        if(themeInSession){
            setTheme(() => {
                document.body.setAttribute('data-theme', themeInSession);
                return themeInSession;
            });
        }else{
            document.body.setAttribute('data-theme', theme);
        }

    },[]);

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
};