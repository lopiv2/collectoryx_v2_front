import React, { useState } from "react";

const AppContext = React.createContext();

const ContextProvider = (props) => {
    const [isLogged, setIsLogged] = useState(false);
    const [userName, setUserName] = useState("");
    return (
        <AppContext.Provider value={{ userName, setUserName, isLogged, setIsLogged }}>
            {props.children}
        </AppContext.Provider>
    );

};

export default ContextProvider;
export { AppContext };