const db = require("./app/models");

/* Importa los modelos que deseas poblar */
const Cliente = db.Cliente;
const Mesa = db.Mesa;
const Restaurante = db.Restaurante;
const Reserva = db.Reserva;

async function populateDatabase() {
  try {
    /* Crea clientes de ejemplo */
    const clientes = await Cliente.bulkCreate([
      { cedula: 5537788, nombre: "Francisco", apellido: "Cabañas" },
      { cedula: 4290382, nombre: "Derlis", apellido: "Cáceres" },
      { cedula: 6666666, nombre: "María", apellido: "Pérez" },
      { cedula: 5072500, nombre: "Osmani", apellido: "Mestre" },
    ], { returning: true });

    /* Obtén los ids de los clientes creados */
    const clienteIds = clientes.map(cliente => cliente.id);

    /* Crea restaurantes de ejemplo */
    const restaurantes = await Restaurante.bulkCreate([
      { nombre: "Bellini", direccion: "San Lorenzo", pisos: 1 },
      { nombre: "McDonalds", direccion: "Asunción", pisos: 1 },
      { nombre: "Mostaza", direccion: "Fernando de la Mora", pisos: 1 },
      { nombre: "Lomilitos", direccion: "Capiata", pisos: 1 },
    ], { returning: true });

    /* Obtén los ids de los restaurantes creados */
    const restauranteIds = restaurantes.map(restaurante => restaurante.id);

    /* Crea mesas de ejemplo */
    const mesasData = [
      { nombre: "Mesa 1", cantidad: 5, posx: 1, posy: 1, piso: 1, RestauranteId: restauranteIds[0] },
      { nombre: "Mesa 2", cantidad: 5, posx: 1, posy: 2, piso: 1, RestauranteId: restauranteIds[0] },
      { nombre: "Mesa 3", cantidad: 5, posx: 1, posy: 3, piso: 1, RestauranteId: restauranteIds[0] },
      { nombre: "Mesa 4", cantidad: 5, posx: 1, posy: 4, piso: 1, RestauranteId: restauranteIds[0] },
      { nombre: "Mesa 5", cantidad: 5, posx: 1, posy: 5, piso: 1, RestauranteId: restauranteIds[0] },
      { nombre: "Mesa 1", cantidad: 6, posx: 1, posy: 1, piso: 1, RestauranteId: restauranteIds[1] },
      { nombre: "Mesa 2", cantidad: 6, posx: 1, posy: 2, piso: 1, RestauranteId: restauranteIds[1] },
      { nombre: "Mesa 3", cantidad: 6, posx: 1, posy: 3, piso: 1, RestauranteId: restauranteIds[1] },
      { nombre: "Mesa 4", cantidad: 6, posx: 1, posy: 4, piso: 1, RestauranteId: restauranteIds[1] },
      { nombre: "Mesa 5", cantidad: 6, posx: 1, posy: 5, piso: 1, RestauranteId: restauranteIds[1] },
      { nombre: "Mesa 1", cantidad: 5, posx: 1, posy: 1, piso: 1, RestauranteId: restauranteIds[2] },
      { nombre: "Mesa 2", cantidad: 5, posx: 1, posy: 2, piso: 1, RestauranteId: restauranteIds[2] },
      { nombre: "Mesa 3", cantidad: 5, posx: 1, posy: 3, piso: 1, RestauranteId: restauranteIds[2] },
      { nombre: "Mesa 4", cantidad: 5, posx: 1, posy: 4, piso: 1, RestauranteId: restauranteIds[2] },
      { nombre: "Mesa 5", cantidad: 5, posx: 1, posy: 5, piso: 1, RestauranteId: restauranteIds[2] },
      { nombre: "Mesa 1", cantidad: 4, posx: 1, posy: 1, piso: 1, RestauranteId: restauranteIds[3] },
      { nombre: "Mesa 2", cantidad: 4, posx: 1, posy: 2, piso: 1, RestauranteId: restauranteIds[3] },
      { nombre: "Mesa 3", cantidad: 4, posx: 1, posy: 3, piso: 1, RestauranteId: restauranteIds[3] },
      { nombre: "Mesa 4", cantidad: 4, posx: 1, posy: 4, piso: 1, RestauranteId: restauranteIds[3] },
      { nombre: "Mesa 5", cantidad: 4, posx: 1, posy: 5, piso: 1, RestauranteId: restauranteIds[3] }
    ];
    const mesas = await Mesa.bulkCreate(mesasData, { returning: true });

    /* Obtén los ids de las mesas creadas */
    const mesasIds = mesas.map(mesa => mesa.id);

    /* Crea reservas de ejemplo */
    const reservasData = [
      { fecha: "2024-06-24", horaInicio: "18:00:00", horaFin: "19:00:00", cantidad: 4, ClienteId: clienteIds[0], MesaId: mesasIds[0] },
      { fecha: "2024-06-24", horaInicio: "19:00:00", horaFin: "20:00:00", cantidad: 4, ClienteId: clienteIds[0], MesaId: mesasIds[0] },
      { fecha: "2024-06-24", horaInicio: "19:00:00", horaFin: "20:00:00", cantidad: 3, ClienteId: clienteIds[2], MesaId: mesasIds[1] },
      { fecha: "2024-06-25", horaInicio: "19:00:00", horaFin: "20:00:00", cantidad: 4, ClienteId: clienteIds[3], MesaId: mesasIds[3] },
      { fecha: "2024-06-25", horaInicio: "19:00:00", horaFin: "20:00:00", cantidad: 4, ClienteId: clienteIds[0], MesaId: mesasIds[5] },
      { fecha: "2024-06-25", horaInicio: "19:00:00", horaFin: "20:00:00", cantidad: 4, ClienteId: clienteIds[1], MesaId: mesasIds[7] },
      { fecha: "2024-06-26", horaInicio: "12:00:00", horaFin: "20:00:00", cantidad: 4, ClienteId: clienteIds[2], MesaId: mesasIds[9] },
      { fecha: "2024-06-26", horaInicio: "13:00:00", horaFin: "14:00:00", cantidad: 4, ClienteId: clienteIds[3], MesaId: mesasIds[10] },
      { fecha: "2024-06-26", horaInicio: "14:00:00", horaFin: "15:00:00", cantidad: 4, ClienteId: clienteIds[3], MesaId: mesasIds[12] },
      { fecha: "2024-06-27", horaInicio: "19:00:00", horaFin: "20:00:00", cantidad: 4, ClienteId: clienteIds[3], MesaId: mesasIds[12] },
      { fecha: "2024-06-27", horaInicio: "20:00:00", horaFin: "21:00:00", cantidad: 5, ClienteId: clienteIds[2], MesaId: mesasIds[14] },
      { fecha: "2024-06-27", horaInicio: "21:00:00", horaFin: "22:00:00", cantidad: 3, ClienteId: clienteIds[3], MesaId: mesasIds[2] },
    ];

    await Reserva.bulkCreate(reservasData);

    console.log("Datos insertados correctamente");
  } catch (err) {
    console.error("Error al insertar datos:", err);
  } finally {
    /* Cierra la conexión con la base de datos */
    await db.sequelize.close();
  }
}

/* Ejecuta la función para poblar la base de datos */
populateDatabase();
