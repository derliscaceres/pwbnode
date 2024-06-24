import React from 'react'
import { useNavigate } from 'react-router-dom'

const Exito = () => {
    const navigate = useNavigate()
    return (
        <>
            <button onClick={e => navigate('/')}>Inicio</button>
            <div>Exito!</div>
        </>
    )
}

export default Exito