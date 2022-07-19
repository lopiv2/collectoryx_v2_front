import React from 'react';

import AuthService from "../app/api/auth.api";


const ValidateUserAdmin = (props) => {
    const aut=AuthService.checkUserLogged()
    console.log(aut)
    return aut
}

export default ValidateUserAdmin;