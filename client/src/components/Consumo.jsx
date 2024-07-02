import React, { useCallback, useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const Consumo = () => {

    const navigate = useNavigate()

    const [mesas, setMesas] = useState([])
    const [mesaSeleccionada, setMesaSeleccionada] = useState("seleccione")
    const [restaurantes, setRestaurantes] = useState([])
    const [restauranteSeleccionado, setRestauranteSeleccionado] = useState()
    const [consumos, setConsumos] = useState([])
    const [productos, setProductos] = useState([])
    const [productoSeleccionado, setProductoSeleccionado] = useState()
    const [precioProducto, setPrecioProducto] = useState()
    const [cantidadProducto, setCantidadProducto] = useState(1)
    const [cedula, setCedula] = useState()
    const [existeCliente, setExisteCliente] = useState(true)
    const [nombre, setNombre] = useState("")
    const [apellido, setApellido] = useState("")

    const obtenerConsumos = useCallback(
        () => {
            axios.get('http://localhost:9090/api/consumo/mesa/'+mesaSeleccionada)
                .then( res => {
                    setConsumos(res.data)
                    setCedula(res.data[0].Cliente.cedula)
                })
                .catch( err => {
                    // error
                })
        },
        [mesaSeleccionada],
    )

    useEffect(() => {
        axios.get('http://localhost:9090/api/restaurante')
            .then( res => {
                setRestaurantes(res.data)
                setRestauranteSeleccionado(res.data[0].id)
            })
    }, [])

    useEffect(() => {
        if (restauranteSeleccionado){
            axios.get('http://localhost:9090/api/mesa/restaurante/'+restauranteSeleccionado)
                .then( res => {
                    setMesas(res.data)
                })
        }
    }, [restauranteSeleccionado])

    useEffect(() => {
        if (mesaSeleccionada && mesaSeleccionada !== "seleccione"){
            obtenerConsumos()
            axios.get('http://localhost:9090/api/producto')
                .then( res => {
                    setProductos(res.data)
                    setProductoSeleccionado(res.data[0].id)
                    setPrecioProducto(0)
                })
        }
    }, [mesaSeleccionada, obtenerConsumos])

    const handleSubmit = e => {
        e.preventDefault()
    }

    const handleAgregarDetalle = () => {
        axios.post("http://localhost:9090/api/detalle",{
            cantidad: cantidadProducto,
            consumoId: consumos[0].id,
            productoId: productoSeleccionado
        })
            .then( res => {
                obtenerConsumos()
            })
    }

    const handleSeleccionarCliente = () => {
        axios.get("http://localhost:9090/api/cliente/"+cedula)
            .then(res => {
                axios.post("http://localhost:9090/api/consumo/", {
                    clienteId: res.data.id,
                    mesaId: mesaSeleccionada
                })
                    .then( res => {
                        obtenerConsumos()
                    })
            })
            .catch( err => {
                setExisteCliente(false)
            })
    }

    const handleCambiarCliente = () => {
        axios.get("http://localhost:9090/api/cliente/"+cedula)
            .then(res => {
                setExisteCliente(true)
                axios.put("http://localhost:9090/api/consumo/"+consumos[0].id, {
                    clienteId: res.data.id
                })
                    .then( res => {
                        obtenerConsumos()
                    })
            })
            .catch( err => {
                setExisteCliente(false)
            })
    }

    const handleCrearCliente = (e) => {
        if (e.target.name === 'boton-consumo-creado') {
            axios.post("http://localhost:9090/api/cliente", {
                cedula,
                nombre,
                apellido
            })
                .then( res => {
                    axios.put("http://localhost:9090/api/consumo/"+consumos[0].id, {
                        clienteId: res.data.id
                    })
                        .then( res => {
                            obtenerConsumos()
                            setExisteCliente(true)
                        })
                })
        } else if (e.target.name === 'boton-nuevo-consumo') {
            axios.post("http://localhost:9090/api/cliente", {
                cedula,
                nombre,
                apellido
            })
                .then( res => {
                    axios.post("http://localhost:9090/api/consumo/", {
                        clienteId: res.data.id,
                        mesaId: mesaSeleccionada
                    })
                        .then( res => {
                            obtenerConsumos()
                            setExisteCliente(true)
                        })
                })
        }
    }

    const cerrarConsumo = () => {
        axios.put("http://localhost:9090/api/consumo/"+consumos[0].id, {
            estaAbierto: false
        })
            .then( res => {
                console.log(res.data);
                axios.get("http://localhost:9090/api/consumo/pdf/"+consumos[0].id, {responseType: 'blob'})
                    .then(res => {
                        const pdfBlob = res.data;
                        navigate('/factura', { state: { pdfBlob } });
                    })
                    .catch( err => {
                        console.log(err);
                    })
            })
    }

    return (
        <>
            <button className='btn btn-success' onClick={e => navigate('/')}>Regresar</button>
            <div className='mt-5 ms-5'>
            <form className='d-inline' action='submit' onSubmit={handleSubmit}>
            <div>
                <label className="form-label">Restaurante: </label>
                <select className="form-select form-select-sm w-50" value={restauranteSeleccionado} onChange={e => setRestauranteSeleccionado(e.target.value)}>
                    {
                        restaurantes.map( item => (
                            <option key={item.id} value={item.id}>
                                {item.nombre}
                            </option>
                        ))
                    }
                </select>
            </div>
            <div>
                <label className="form-label">Mesas: </label>
                <select className="form-select form-select-sm w-50" value={mesaSeleccionada} onChange={e => setMesaSeleccionada(e.target.value)}>
                    <option key={"seleccione"} id={"seleccione"}>
                        Seleccione una mesa...
                    </option>
                    {
                        mesas.map( item => (
                            <option key={item.id} value={item.id}>
                                {item.nombre}
                            </option>
                        ))
                    }
                </select>
            </div>
            {
            mesaSeleccionada === "seleccione" ? "" :
                consumos.length === 0 ?
                    <div className='mt-2'>
                        <label className="form-label" htmlFor="cliente">Cédula Cliente: </label>
                        <div>
                            <input type='text' className='form-control w-25' value={cedula} onChange={e => setCedula(e.target.value)}/>
                            <button className='mt-3 btn btn-sm btn-primary' onClick={handleSeleccionarCliente}>Crear Consumo</button>
                        </div>
                        {
                            existeCliente ?
                                ""
                                :
                                <div className='mt-3'>
                                    <p style={{fontWeight: 'bold', color: 'red'}}>
                                    Cedula no Registrada. Ingrese los datos del cliente nuevo:
                                    </p>
                                    <div className='col-sm-8 d-flex mt-2 align-items-center'>
                                        <label htmlFor="nombre" className='me-2'>Nombre: </label>
                                        <input type='text' name='nombre' className='form-control w-25' value={nombre} onChange={e => setNombre(e.target.value)}/>
                                    </div>
                                    <div className='col-sm-8 d-flex mt-2 align-items-center'>
                                        <label htmlFor="apellido" className='me-2'>Apellido: </label>
                                        <input type='text' name='apellido' className='form-control w-25' value={apellido} onChange={e => setApellido(e.target.value)}/>
                                    </div>
                                    <div className='d-flex mt-2'>
                                        <button name='boton-nuevo-consumo' className='btn btn-sm btn-primary' onClick={e => handleCrearCliente(e)}>Crear Cliente</button>
                                    </div>
                                </div>
                        }
                    </div>
                    :
                    <div className="mt-4 p-3 bg-light border rounded">
                        <div className="container">
                            <div className="row">
                                <p className="h5 col-sm-4"><span className="text-decoration-underline">Total</span>: {consumos[0].total}</p>
                                <p className="h5 col-sm-4">
                                    <span className="text-decoration-underline">Cliente</span>: {consumos[0].Cliente.nombre} {consumos[0].Cliente.apellido}
                                </p>
                                <div className='d-flex justify-content-end col-sm-4'>
                                    <button className='w-50 btn btn-danger' onClick={cerrarConsumo}>Cerrar Consumo</button>
                                </div>
                            </div>
                        </div>
                        <div className="container">
                            <div className="row">
                                <p className="h5 col-sm-4"/>
                                <div className='col-sm-8 d-flex mt-2'>
                                    <input type='text' className='form-control w-25' value={cedula} onChange={e => setCedula(e.target.value)}/>
                                    <button className='ms-2 btn btn-sm btn-primary' onClick={handleCambiarCliente}>Cambiar</button>
                                </div>
                            </div>
                        </div>
                        {
                            existeCliente ?
                                ""
                                :
                                <div className="container">
                                    <div className="row">
                                        <p className="col-sm-4"/>
                                        <div className='col-sm-8 d-flex mt-2 align-items-center'>
                                            <label htmlFor="nombre" className='me-2'>Nombre: </label>
                                            <input type='text' name='nombre' className='form-control w-25' value={nombre} onChange={e => setNombre(e.target.value)}/>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <p className="col-sm-4"/>
                                        <div className='col-sm-8 d-flex mt-2 align-items-center'>
                                            <label htmlFor="apellido" className='me-2'>Apellido: </label>
                                            <input type='text' name='apellido' className='form-control w-25' value={apellido} onChange={e => setApellido(e.target.value)}/>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <p className="col-sm-4"/>
                                        <div className='col-sm-3 d-flex mt-2 align-items-center justify-content-end'>
                                            <button name='boton-consumo-creado' className='btn btn-sm btn-primary' onClick={e => handleCrearCliente(e)}>Crear Cliente</button>
                                        </div>
                                    </div>
                                </div>
                        }
                        <table className="table table-striped mt-3">
                            <thead>
                            <tr>
                                <th>Cantidad</th>
                                <th>Producto</th>
                                <th>Precio Unitario</th>
                            </tr>
                            </thead>
                            <tbody>
                            {consumos.map((consumo, index) => (
                                consumo.Detalles.map((detalle, i) => (
                                    <tr key={index+"-"+i}>
                                        <td>{detalle.cantidad}</td>
                                        <td>{detalle.Producto.nombre}</td>
                                        <td>{detalle.Producto.precio}</td>
                                    </tr>
                                ))
                            ))}
                            <tr className='align-middle'>
                                <td>
                                    <input className='form-control w-50' type='number' min={1} value={cantidadProducto} onChange={e => setCantidadProducto(e.target.value)} />
                                </td>
                                <td>
                                <select className="form-select form-select-sm w-50" value={productoSeleccionado} onChange={e => {setProductoSeleccionado(e.target.value);setPrecioProducto(e.target.selectedIndex)}}>
                                {
                                    productos.map( item => (
                                        <option key={item.id} value={item.id}>
                                            {item.nombre}
                                        </option>
                                    ))
                                }
                                </select>
                                </td>
                                <td>{productos[precioProducto] ? productos[precioProducto].precio : ""}</td>
                            </tr>
                            <tr>
                                <td/><td/>
                                <td>
                                    <button className='btn btn-primary' onClick={handleAgregarDetalle}>Agregar</button>
                                </td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
            }
            </form>
            </div>
        </>
    )
}

export default Consumo