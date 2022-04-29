import React, { useState } from "react";

const AppContext = React.createContext();

const ContextProvider = (props) => {
    const [isLogged, setIsLogged] = useState(false);
    const [user_name, setuser_name] = useState("");
    return (
        <AppContext.Provider value={{ user_name, setuser_name, isLogged, setIsLogged }}>
            {props.children}
        </AppContext.Provider>
    );

};

export default ContextProvider;
export { AppContext };