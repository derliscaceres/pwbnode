import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const Reserva = () => {
    const navigate = useNavigate()
    const [restaurante, setRestaurante] = useState([])
    const [restSeleccionado, setRestSeleccionado] = useState("")
    const horas = ["13:00:00", "14:00:00", "15:00:00", "20:00:00", "21:00:00", "22:00:00", "23:00:00"]
    const [horaInicioSeleccionada, setHoraInicioSeleccionada] = useState(horas[0])
    const [horaFinSeleccionada, setHoraFinSeleccionada] = useState(horas[1])
    const [fecha, setFecha] = useState("")
    const [error, setError] = useState()
    const [mesas, setMesas] = useState()
    const [mesaSeleccionada, setMesaSeleccionada] = useState()
    const [cantidad, setCantidad] = useState("")
    const [error2, setError2] = useState()
    const [cliente, setCliente] = useState("")
    const [noExiste, setNoExiste] = useState(false)
    const [nombre, setNombre] = useState("")
    const [apellido, setApellido] = useState("")

    useEffect(() => {
        axios.get('http://localhost:9090/api/restaurante')
            .then( res => {
                setRestaurante(res.data)
            })
    }, [])

    useEffect(() => {
        if (restaurante[0]){
            setRestSeleccionado(restaurante[0].id)
        }
    }, [restaurante])

    useEffect(() => {
        if (mesas) {
            setMesaSeleccionada(mesas[0])
        }
    }, [mesas])
    

    
    const handleRestChange = (event) => {
        setRestSeleccionado(event.target.value);
    };

    const handleHoraChange = (event) => {
        if (event.target.name==="hora-inicio"){
            setHoraInicioSeleccionada(event.target.value);
        }else if (event.target.name==="hora-fin"){
            setHoraFinSeleccionada(event.target.value)
        }
    };

    const handleFechaChange = (event) => {
        setFecha(event.target.value)
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        axios.post('http://localhost:9090/api/mesa/disponible', {
            RestauranteId : restSeleccionado,
            fecha,
            horaInicio : horaInicioSeleccionada,
            horaFin : horaFinSeleccionada
        })
        .then( res => {
            setError()
            setMesas(res.data)
        })
        .catch(error => {
            setError(error.response.data.message)
        })
    }

    const handleSubmitReserva = e => {
        e.preventDefault()
        if (cantidad === "" || cliente === ""){
            setError2("Campos Vacios")
        }else{
            setError2()
            if (cantidad <= mesaSeleccionada.cantidad){
                axios.get("http://localhost:9090/api/cliente/"+cliente)
                .then(res => {
                    axios.post("http://localhost:9090/api/reserva", {
                        fecha,
                        horaInicio : horaInicioSeleccionada,
                        horaFin : horaFinSeleccionada,
                        cantidad,
                        ClienteId: res.data.id,
                        MesaId : mesaSeleccionada.id
                    })
                        .then( res => {
                            navigate('/exito')
                        })
                        .catch( err => 
                            setError2(err.response.data.message)
                        )
                })
                .catch( error => {
                    setNoExiste(true)
                })
            }else{
                setError2("Cantidad invalida, la mesa seleccionada no tiene suficiente capacidad")
            }
            
            if (noExiste) {
                if (nombre==="" || apellido==="") {
                    setError2("Campos vacios")
                }else{
                    setError2()
                    axios.post("http://localhost:9090/api/cliente", {
                        cedula : cliente,
                        nombre,
                        apellido
                    })
                        .then( res => {
                            axios.post("http://localhost:9090/api/reserva", {
                                fecha,
                                horaInicio : horaInicioSeleccionada,
                                horaFin : horaFinSeleccionada,
                                cantidad,
                                ClienteId: res.data.id,
                                MesaId : mesaSeleccionada.id
                            })
                                .then( res => {
                                    navigate('/exito')
                                })
                                .catch( err => 
                                    console.log(err)
                                )
                        })
                        .catch( err => {
                            console.log(err);
                        })
                }
            }
        }
    }

    return (
        <>
        <button className='btn btn-success' onClick={e => navigate('/')}>Regresar</button>
        <div className='d-flex justify-content-start'>
        <form className='d-inline w-50 m-3' action='submit' onSubmit={handleSubmit}>
            <div>
                <label className="form-label">Restaurante: </label>
                <select className="form-select form-select-sm w-50" value={restSeleccionado} onChange={e => handleRestChange(e)}>
                    {
                        restaurante.map( item => (
                            <option key={item.id} value={item.id}>
                                {item.nombre}
                            </option>
                        ))
                    }
                </select>
            </div>
            <div className='mt-1'>
                <label className="form-label" htmlFor="date-picker">Selecciona una fecha: </label>
                <input
                    className="form-control w-50"
                    type="date"
                    id="date-picker"
                    value={fecha}
                    onChange={handleFechaChange}
                />
            </div>
            <div className='mt-1'>
                <label className="form-label">Hora inicio: </label>
                <select className="form-select form-select-sm w-50" name='hora-inicio' value={horaInicioSeleccionada} onChange={e => handleHoraChange(e)}>
                    {
                        horas.map( item => (
                            <option key={item} value={item}>
                                {item}
                            </option>
                        ))
                    }
                </select>
            </div>
            <div className='mt-1'>
                <label className="form-label">Hora fin: </label>
                <select className="form-select form-select-sm w-50" name='hora-fin' value={horaFinSeleccionada} onChange={e => handleHoraChange(e)}>
                    {
                        horas.map( item => (
                            <option key={item} value={item}>
                                {item}
                            </option>
                        ))
                    }
                </select>
            </div>
            {
                error ?
                    <p style={{fontWeight: "bold", color: "red"}}>{error}</p>
                    :
                    ""
            }
            <div>
                <button className="btn btn-primary mt-3" type='submit'>
                    Buscar Mesas
                </button>
            </div>
        </form>
        {
            mesas ?
                <form className='d-inline w-50 m-3' action="submit" onSubmit={handleSubmitReserva}>
                    <label className='form-label'>Mesas Disponibles</label>
                    <select className="form-select form-select-sm w-50" value={mesaSeleccionada} onChange={e => setMesaSeleccionada(e.target.value)}>
                        {
                            mesas.map( item => 
                                <option key={item.id} value={item.id}>
                                    {item.nombre} Capacidad: {item.cantidad}
                                </option>
                            )
                        }
                    </select>
                    <div className='mt-2'>
                        <label className="form-label" htmlFor="capacidad">Cantidad de Comensales: </label>
                        <input className="form-control w-50" type="text" name="capacidad" value={cantidad} onChange={ e => setCantidad(e.target.value) }/>
                    </div>
                    <div className='mt-2'>
                        <label className="form-label" htmlFor="cliente">Cédula Cliente: </label>
                        <input className="form-control w-50" name='cliente' type="text" value={cliente} onChange={ e => setCliente(e.target.value)}/>
                    </div>
                    {
                        noExiste ?
                            <div>
                                <label className="form-label" style={{display: "block"}}>Ingrese datos del nuevo Cliente:</label>
                                <div>
                                    <label className="form-label" htmlFor="nombre">Nombre: </label>
                                    <input className="form-control w-50" name='nombre' type='text' value={nombre} onChange={e => setNombre(e.target.value)}/>
                                </div>
                                <div>
                                    <label className="form-label" htmlFor="apellido">Apellido: </label>
                                    <input className="form-control w-50" name='apellido' type='text' value={apellido} onChange={e => setApellido(e.target.value)}/>
                                </div>
                                <button className="btn btn-primary mt-3" type='submit'>Guardar Cliente y Reservar</button>
                            </div>
                            :
                            <button className="btn btn-primary mt-3" type='submit'>Reservar</button>
                    }
                    {
                        error2 ?
                            <p style={{fontWeight: "bold", color: "red"}}>{error2}</p>
                            :
                            ""
                    }
                </form>
                :
                ""
        }
        </div>
        </>
    )
}

export default Reserva