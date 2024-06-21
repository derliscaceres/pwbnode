const db = require("../models");

const Mesa = db.Mesa;
const Reserva = db.Reserva;
const Restaurante = db.Restaurante;
const Op = db.Sequelize.Op;

/* Crear una nueva mesa */
exports.crear = async (req, res) => {
  try {
    const mesa = await Mesa.create(req.body);
    res.status(201).json(mesa);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* Obtener todas las mesas */
exports.listar = async (req, res) => {
  try {
    const mesas = await Mesa.findAll();
    res.json(mesas);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* Obtener una mesa por ID */
exports.encontrar = async (req, res) => {
  const id = req.params.id;
  try {
    const mesa = await Mesa.findByPk(id);
    if (!mesa) {
      res.status(404).json({ message: `Mesa con id ${id} no encontrada` });
    } else {
      res.json(mesa);
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* Actualizar una mesa por ID */
exports.modificar = async (req, res) => {
  const id = req.params.id;
  try {
    let mesa = await Mesa.findByPk(id);
    if (!mesa) {
      return res
        .status(404)
        .json({ message: `Mesa con id ${id} no encontrada` });
    }

    mesa = await mesa.update(req.body);
    res.json(mesa);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* Eliminar una mesa por ID */
exports.eliminar = async (req, res) => {
  const id = req.params.id;
  try {
    const mesa = await Mesa.findByPk(id);
    if (!mesa) {
      return res
        .status(404)
        .json({ message: `Mesa con id ${id} no encontrada` });
    }

    await mesa.destroy();
    res.json({ message: `Mesa con id ${id} eliminada correctamente` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* Encontrar mesas disponibles dado un restaurante, una fecha y un horario */
exports.mesasDisponibles = async (req, res) => {
  const { RestauranteId, fecha, horaInicio, horaFin } = req.body;
  
  try {
    /* Paso 1: Obtener todas las mesas del restaurante específico */
    const mesasDelRestaurante = await Mesa.findAll({
      where: {
        RestauranteId: RestauranteId
      },
    });

    /* Paso 2: Obtener todas las reservas que coincidan con la fecha y el horario especificados */
    const reservasEnHorario = await Reserva.findAll({
      where: { fecha: fecha, [Op.or]: [ { horaInicio: { [Op.lt]: horaFin, }, horaFin: { [Op.gt]: horaInicio, }, }, ], }, });
    /* Paso 3: Excluir las mesas que ya están reservadas en ese horario */
    const mesasReservadasIds = reservasEnHorario.map(
      (reserva) => reserva.mesaId
    );
    const mesasDisponibles = mesasDelRestaurante.filter(
      (mesa) => !mesasReservadasIds.includes(mesa.id)
    );

    res.send(mesasDisponibles);
  } catch (err) {
    res.status(500).send({
      message:
        err.message || "Ocurrió un error al filtrar las mesas disponibles.",
    });
  }
};