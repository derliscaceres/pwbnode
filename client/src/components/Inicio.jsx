import React from 'react'
import { useNavigate } from 'react-router-dom'

const Inicio = () => {
    const navigate = useNavigate()

    return (
        <div className='d-flex w-100 justify-content-evenly mt-5'>
            <button className='btn btn-primary mt-5' onClick={()=>navigate('/reserva')}>Generar Reserva</button>
            <button className='btn btn-success mt-5' onClick={()=>navigate('/reserva/ver')}>Ver Reservas</button>
        </div>
    )
}

export default Inicio