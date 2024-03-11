import { createContext, useEffect, useState } from "react";
import { lookInSession } from "./session";

export const UserContext = createContext();


export const UserProvider = ({ children }) => {
    const [user, setUser] = useState({});

    useEffect(() => {
        let userInSession = lookInSession("user");
        userInSession ? setUser(JSON.parse(userInSession)) : setUser({ access_token: null, username: null, profile_img: null, fullname: null});
    },[]);

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
};