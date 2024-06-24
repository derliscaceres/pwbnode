const db = require("../models");

const Cliente = db.Cliente;

/* Crear un cliente */
exports.crear = async (req, res) => {
  try {
    const cliente = await Cliente.create(req.body);
    res.status(201).json(cliente);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* Obtener todos los clientes */
exports.listar = async (req, res) => {
  try {
    const clientes = await Cliente.findAll();
    res.status(200).json(clientes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* Obtener un cliente por ID */
exports.encontrar = async (req, res) => {
  const cedula = req.params.cedula;
  try {
    const cliente = await Cliente.findOne({ where: { cedula: cedula } });
    if (!cliente) {
      res.status(404).json({ message: `Cliente con cédula ${cedula} no encontrado` });
    } else {
      res.json(cliente);
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


/* Actualizar un cliente por ID */
exports.modificar = async (req, res) => {
  const id = req.params.id;
  try {
    let cliente = await Cliente.findByPk(id);
    if (!cliente) {
      return res
        .status(404)
        .json({ message: `Cliente con id ${id} no encontrado` });
    }

    cliente = await cliente.update(req.body);
    res.json(cliente);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* Eliminar un cliente por ID */
exports.eliminar = async (req, res) => {
  const id = req.params.id;
  try {
    const cliente = await Cliente.findByPk(id);
    if (!cliente) {
      return res
        .status(404)
        .json({ message: `Cliente con id ${id} no encontrado` });
    }

    await cliente.destroy();
    res.json({ message: `Cliente con id ${id} eliminado correctamente` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
