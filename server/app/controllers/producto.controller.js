const db = require("../models");

const Producto = db.Producto;

/* Crear un nuevo producto */
exports.crear = async (req, res) => {
  try {
    //console.log(req.body);
    const producto = await Producto.create(req.body);
    res.status(201).json(producto);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* Obtener todos los productos */
exports.listar = async (req, res) => {
  try {
    const productos = await Producto.findAll();
    res.json(productos);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* Obtener un producto por ID */
exports.encontrar = async (req, res) => {
  const id = req.params.id;
  try {
    const producto = await Producto.findByPk(id);
    if (!producto) {
      res.status(404).json({ message: `Producto con id ${id} no encontrado` });
    } else {
      res.json(producto);
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* Actualizar un producto por ID */
exports.modificar = async (req, res) => {
  const id = req.params.id;
  try {
    let producto = await Producto.findByPk(id);
    if (!producto) {
      return res
        .status(404)
        .json({ message: `Producto con id ${id} no encontrado` });
    }

    producto = await producto.update(req.body);
    res.json(producto);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* Eliminar un producto por ID */
exports.eliminar = async (req, res) => {
  const id = req.params.id;
  try {
    const producto = await Producto.findByPk(id);
    if (!producto) {
      return res
        .status(404)
        .json({ message: `Producto con id ${id} no encontrado` });
    }

    await producto.destroy();
    res.json({ message: `Producto con id ${id} eliminado correctamente` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
