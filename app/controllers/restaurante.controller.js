const db = require("../models");

const Restaurante = db.Restaurante;

/* Crear un nuevo restaurante */
exports.crear = async (req, res) => {
  try {
    const restaurante = await Restaurante.create(req.body);
    res.status(201).json(restaurante);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* Obtener todos los restaurantes */
exports.listar = async (req, res) => {
  try {
    const restaurantes = await Restaurante.findAll();
    res.json(restaurantes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* Obtener un restaurante por ID */
exports.encontrar = async (req, res) => {
  const id = req.params.id;
  try {
    const restaurante = await Restaurante.findByPk(id);
    if (!restaurante) {
      res
        .status(404)
        .json({ message: `Restaurante con id ${id} no encontrado` });
    } else {
      res.json(restaurante);
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* Actualizar un restaurante por ID */
exports.modificar = async (req, res) => {
  const id = req.params.id;
  try {
    let restaurante = await Restaurante.findByPk(id);
    if (!restaurante) {
      return res
        .status(404)
        .json({ message: `Restaurante con id ${id} no encontrado` });
    }

    restaurante = await restaurante.update(req.body);
    res.json(restaurante);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* Eliminar un restaurante por ID */
exports.eliminar = async (req, res) => {
  const id = req.params.id;
  try {
    const restaurante = await Restaurante.findByPk(id);
    if (!restaurante) {
      return res
        .status(404)
        .json({ message: `Restaurante con id ${id} no encontrado` });
    }

    await restaurante.destroy();
    res.json({ message: `Restaurante con id ${id} eliminado correctamente` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
