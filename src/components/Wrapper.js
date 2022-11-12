import React, { useState } from 'react';
import { IntlProvider } from 'react-intl';
import Spanish from '../lang/es.json';
import English from '../lang/en.json';
const Context = React.createContext();
const local = navigator.language;
let lang = English;
if (local === "es-ES") {
    lang = Spanish;
}
else{
    lang = English;
}

const Wrapper = (props) => {
    const [locale, setLocale] = useState(local);
    const [messages, setMessages] = useState(lang);
    
    function selectLanguage(e) {
        const newLocale = e.target.value;
        setLocale(newLocale);
        if (newLocale === 'es-ES') {
            setMessages(Spanish);
        } else {
            if (newLocale === 'en-US') {
                setMessages(English);
            }
        }
    }
    return (
        <Context.Provider value={{ locale, selectLanguage }}>
            <IntlProvider messages={messages} locale={locale}>
                {props.children}
            </IntlProvider>
        </Context.Provider>
    );
}
export default Wrapper;
export { Context };