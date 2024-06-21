const db = require("../models");

const Reserva = db.Reserva;
const Mesa = db.Mesa;
const Cliente = db.Cliente;
const { Op } = require("sequelize");

/* Crear una nueva reserva */
exports.crear = async (req, res) => {
  try {
    const reserva = await Reserva.create(req.body);
    res.status(201).json(reserva);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* Obtener todas las reservas */
exports.listar = async (req, res) => {
  const { RestauranteId, fecha, ClienteId } = req.query;

  try {
    // Crear objeto de condiciones de búsqueda
    let condiciones = {};

    if (RestauranteId) {
      // Buscar mesas del restaurante especificado
      const mesasDelRestaurante = await Mesa.findAll({
        where: { RestauranteId: RestauranteId },
        attributes: ['id']
      });
      const mesaIds = mesasDelRestaurante.map(mesa => mesa.id);

      // Agregar condición para filtrar por MesaId
      condiciones.MesaId = { [Op.in]: mesaIds };
    }

    if (fecha) {
      condiciones.fecha = fecha;
    }

    if (ClienteId) {
      condiciones.ClienteId = ClienteId;
    }

    // Buscar reservas con las condiciones y ordenar
    const reservas = await Reserva.findAll({
      where: condiciones,
      order: [
        ['horaInicio', 'ASC'],
        ['MesaId', 'ASC']
      ],
      include: [
        { model: Mesa, attributes: ['nombre'] }, // Incluir detalles de Mesa
        { model: Cliente, attributes: ['nombre', 'apellido'] } // Incluir detalles de Cliente
      ]
    });

    res.json(reservas);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* Obtener una reserva por ID */
exports.encontrar = async (req, res) => {
  const id = req.params.id;
  try {
    const reserva = await Reserva.findByPk(id);
    if (!reserva) {
      res.status(404).json({ message: `Reserva con id ${id} no encontrada` });
    } else {
      res.json(reserva);
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* Actualizar una reserva por ID */
exports.modificar = async (req, res) => {
  const id = req.params.id;
  try {
    let reserva = await Reserva.findByPk(id);
    if (!reserva) {
      return res
        .status(404)
        .json({ message: `Reserva con id ${id} no encontrada` });
    }

    reserva = await reserva.update(req.body);
    res.json(reserva);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* Eliminar una reserva por ID */
exports.eliminar = async (req, res) => {
  const id = req.params.id;
  try {
    const reserva = await Reserva.findByPk(id);
    if (!reserva) {
      return res
        .status(404)
        .json({ message: `Reserva con id ${id} no encontrada` });
    }

    await reserva.destroy();
    res.json({ message: `Reserva con id ${id} eliminada correctamente` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
