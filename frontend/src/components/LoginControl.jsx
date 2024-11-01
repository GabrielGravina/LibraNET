import React, { useState } from 'react'
function LoginControl(props) {

    const [isAdmin, setIsAdmin] = useState(false)
    
    return (
        <>
            <button onClick={props.toggleAdmin}>{props.isAdmin ? "Sair" : "Entrar como administrador"}</button>
            <p>Bem vindo, {props.isAdmin ? "Admin" : "usuário!"}</p>
        </>
        
    )
}
export default LoginControl