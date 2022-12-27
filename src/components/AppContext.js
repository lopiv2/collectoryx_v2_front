import React, { useState } from "react";

const AppContext = React.createContext();

const ContextProvider = (props) => {
  const [isLogged, setIsLogged] = useState(false);
  const [userData, setUserData] = useState("");
  const [userConfig, setUserConfig] = useState("");
  const [userName, setUserName] = useState("");
  const [role, setRole] = useState("");
  const [feedsList, setFeedsList] = useState([]);
  const [dailyEvents, setDailyEvents] = useState([]);
  const version="1.5.1"
  return (
    <AppContext.Provider
      value={{
        userData,
        setUserData,
        userConfig,
        setUserConfig,
        userName,
        setUserName,
        isLogged,
        setIsLogged,
        role,
        setRole,
        feedsList,
        setFeedsList,
        dailyEvents,
        setDailyEvents,
        version,
      }}
    >
      {props.children}
    </AppContext.Provider>
  );
};

export default ContextProvider;
export { AppContext };
