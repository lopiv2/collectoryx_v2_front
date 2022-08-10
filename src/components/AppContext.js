import React, { useState } from "react";

const AppContext = React.createContext();

const ContextProvider = (props) => {
    const [isLogged, setIsLogged] = useState(false);
    const [userName, setUserName] = useState("");
    const [role, setRole] = useState("");
    const [feedsList, setFeedsList] = useState([]);
    return (
        <AppContext.Provider value={{ userName, setUserName, isLogged, setIsLogged, role, setRole, feedsList, setFeedsList }}>
            {props.children}
        </AppContext.Provider>
    );

};

export default ContextProvider;
export { AppContext };