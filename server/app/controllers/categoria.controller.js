const db = require("../models");

const Categoria = db.Categoria;

/* Crear una nueva categoría */
exports.crear = async (req, res) => {
  try {
    const categoria = await Categoria.create(req.body);
    res.status(201).json(categoria);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* Obtener todas las categorías */
exports.listar = async (req, res) => {
  try {
    const categorias = await Categoria.findAll();
    res.json(categorias);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* Obtener una categoría por ID */
exports.encontrar = async (req, res) => {
  const id = req.params.id;
  try {
    const categoria = await Categoria.findByPk(id);
    if (!categoria) {
      res.status(404).json({ message: `Categoría con id ${id} no encontrada` });
    } else {
      res.json(categoria);
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* Actualizar una categoría por ID */
exports.modificar = async (req, res) => {
  const id = req.params.id;
  try {
    let categoria = await Categoria.findByPk(id);
    if (!categoria) {
      return res
        .status(404)
        .json({ message: `Categoría con id ${id} no encontrada` });
    }

    categoria = await categoria.update(req.body);
    res.json(categoria);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* Eliminar una categoría por ID */
exports.eliminar = async (req, res) => {
  const id = req.params.id;
  try {
    const categoria = await Categoria.findByPk(id);
    if (!categoria) {
      return res
        .status(404)
        .json({ message: `Categoría con id ${id} no encontrada` });
    }

    await categoria.destroy();
    res.json({ message: `Categoría con id ${id} eliminada correctamente` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
