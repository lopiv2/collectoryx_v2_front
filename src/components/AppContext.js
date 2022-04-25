import React, { useState } from "react";

const AppContext = React.createContext();

const ContextProvider = (props) => {
    const [isLogged, setIsLogged] = useState(false);
<<<<<<< HEAD

    return (
        <AppContext.Provider value={{ isLogged, setIsLogged }}>
=======
    const [userName, setUserName] = useState("");

    return (
        <AppContext.Provider value={{ userName, setUserName, isLogged, setIsLogged }}>
>>>>>>> 4a1d133b (first commit)
            {props.children}
        </AppContext.Provider>
    );

};

export default ContextProvider;
export { AppContext };