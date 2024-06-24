import React from 'react'
import { useNavigate } from 'react-router-dom'

const Inicio = () => {
    const navigate = useNavigate()

    return (
        <div>
            <button className='opciones-main' onClick={()=>navigate('/reserva')}>Generar Reserva</button>
            <button className='opciones-main' onClick={()=>navigate('/reserva/ver')}>Ver Reservas</button>
        </div>
    )
}

export default Inicio