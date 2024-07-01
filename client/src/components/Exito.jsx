import React from 'react'
import { useNavigate } from 'react-router-dom'

const Exito = () => {
    const navigate = useNavigate()
    return (
        <>
            <button className='btn btn-success' onClick={e => navigate('/')}>Inicio</button>
            <p className='m-5' style={{fontSize: "3em",fontWeight: "bolder"}}>¡Éxito!</p>
        </>
    )
}

export default Exito