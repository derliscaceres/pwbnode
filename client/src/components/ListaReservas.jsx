import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const ListaReservas = () => {
    const navigate = useNavigate()
    const [restaurante, setRestaurante] = useState([])
    const [restSeleccionado, setRestSeleccionado] = useState("")
    const [fecha, setFecha] = useState("")
    const [cliente, setCliente] = useState("")
    const [error, setError] = useState("")
    const [reservas, setReservas] = useState()

    useEffect(() => {
        axios.get('http://localhost:9090/api/restaurante')
            .then(res => {
                setRestaurante(res.data)
            })
    }, [])

    useEffect(() => {
        if (restaurante[0]) {
            setRestSeleccionado(restaurante[0].id)
        }
    }, [restaurante])



    const handleSubmit = (e) => {
        e.preventDefault()
        if (restSeleccionado === "" || fecha === "") {
            setError("Campos Vacios")
        } else {
            if (cliente !== "") {
                axios.get("http://localhost:9090/api/cliente/" + cliente)
                    .then(res => {
                        axios.get('http://localhost:9090/api/reserva?RestauranteId=' + restSeleccionado + '&fecha=' + fecha + "&ClienteId=" + res.data.id)
                            .then(res => {
                                setReservas(res.data)
                            })
                            .catch(error => {
                                console.log(error);
                            })
                    })
            } else {
                axios.get('http://localhost:9090/api/reserva?RestauranteId=' + restSeleccionado + '&fecha=' + fecha)
                    .then(res => {
                        setReservas(res.data)
                    })
                    .catch(error => {
                        console.log(error);
                    })
            }
        }
    }

    return (
        <>
            <button className='btn btn-success' onClick={e => navigate('/')}>Regresar</button>
            <form className='ms-5 mt-5' action='submit' onSubmit={handleSubmit}>
                <div>
                    <label className="form-label">Restaurante: </label>
                    <select className="form-select form-select-sm w-25" value={restSeleccionado} onChange={e => setRestSeleccionado(e.target.value)}>
                        {
                            restaurante.map(item => (
                                <option key={item.id} value={item.id}>
                                    {item.nombre}
                                </option>
                            ))
                        }
                    </select>
                </div>
                <div className='mt-2'>
                    <label className="form-label" htmlFor="date-picker">Selecciona una fecha: </label>
                    <input
                        className="form-control w-25"
                        type="date"
                        id="date-picker"
                        value={fecha}
                        onChange={e => setFecha(e.target.value)}
                    />
                </div>
                <div className='mt-2'>
                    <label className="form-label" htmlFor="cliente">Cédula Cliente(Opcional): </label>
                    <input className="form-control w-25" name='cliente' type="text" value={cliente} onChange={e => setCliente(e.target.value)} />
                </div>
                <div>
                    <button className='btn btn-primary mt-3' type='submit'>
                        Buscar Reservas
                    </button>
                </div>
                {
                    error ?
                        <p style={{ fontWeight: "bold", color: "red" }}>{error}</p>
                        :
                        ""
                }
            </form>
            {
                reservas ?
                    <table className="mt-5 mx-5 table table-striped table-bordered">
                        <thead className="thead-dark">
                            <tr>
                                <th>ID</th>
                                <th>Fecha</th>
                                <th>Hora Inicio</th>
                                <th>Hora Fin</th>
                                <th>Cantidad</th>
                                <th>Mesa</th>
                                <th>Cliente</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reservas.map(item => (
                                <tr key={item.id}>
                                    <td>{item.id}</td>
                                    <td>{item.fecha}</td>
                                    <td>{item.horaInicio}</td>
                                    <td>{item.horaFin}</td>
                                    <td>{item.cantidad}</td>
                                    <td>{item.Mesa.nombre}</td>
                                    <td>{item.Cliente.nombre + " " +item.Cliente.apellido}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    :
                    ""
            }
        </>
    )
}

export default ListaReservas