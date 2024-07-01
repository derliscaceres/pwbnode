const db = require("../models");

const Detalle = db.Detalle;
const Consumo = db.Consumo;
const Producto = db.Producto;

/* Crear un nuevo detalle */
exports.crear = async (req, res) => {
  try {
    const consumo = await Consumo.findByPk(req.body.consumoId);
    if (!consumo) {
      return res.status(404).json({ message: "No existe ese Consumo." });
    }

    if (consumo.estaAbierto === false) {
      return res
        .status(404)
        .json({
          message: `El consumo ${consumo.id} esta cerrado, no se pueden agregar detalles.`,
        });
    }

    const producto = await Producto.findByPk(req.body.productoId);
    if (!producto) {
      return res.status(404).json({ message: "No existe ese Producto." });
    }

    const cantidad = parseInt(req.body.cantidad, 10); // Asegúrate de que cantidad es un número entero
    const precio = parseInt(producto.precio, 10); // Asegúrate de que precio es un número entero
    consumo.total =
      parseInt(consumo.total, 10) + parseInt(precio * cantidad, 10);

    await Consumo.update(
      { total: consumo.total },
      { where: { id: req.body.consumoId } }
    );

    const detalle = await Detalle.create(req.body);
    return res.status(201).json(detalle);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

/* Obtener todos los detalles */
exports.listar = async (req, res) => {
  try {
    const detalles = await Detalle.findAll();
    res.json(detalles);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* Obtener un detalle por ID */
exports.encontrar = async (req, res) => {
  const id = req.params.id;
  try {
    const detalle = await Detalle.findByPk(id);
    if (!detalle) {
      res.status(404).json({ message: `Detalle con id ${id} no encontrado` });
    } else {
      res.json(detalle);
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* Actualizar un detalle por ID */
exports.modificar = async (req, res) => {
  const id = req.params.id;
  try {
    let detalle = await Detalle.findByPk(id);
    if (!detalle) {
      return res
        .status(404)
        .json({ message: `Detalle con id ${id} no encontrado` });
    }

    detalle = await detalle.update(req.body);
    res.json(detalle);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* Eliminar un detalle por ID */
exports.eliminar = async (req, res) => {
  const id = req.params.id;
  try {
    const detalle = await Detalle.findByPk(id);
    if (!detalle) {
      return res
        .status(404)
        .json({ message: `Detalle con id ${id} no encontrado` });
    }

    const consumo = await Consumo.findByPk(detalle.consumoId);
    if (!consumo) {
      return res.status(404).json({ message: "No existe ese Consumo." });
    }

    const producto = await Producto.findByPk(detalle.productoId);
    if (!producto) {
      return res.status(404).json({ message: "No existe ese Producto." });
    }

    const cantidad = parseInt(detalle.cantidad, 10); // Asegúrate de que cantidad es un número entero
    const precio = parseInt(producto.precio, 10); // Asegúrate de que precio es un número entero
    consumo.total =
      parseInt(consumo.total, 10) - parseInt(precio * cantidad, 10);

    if (consumo.total < 0) {
      consumo.total = 0;
    }

    await Consumo.update(
      { total: consumo.total },
      { where: { id: detalle.consumoId } }
    );

    await detalle.destroy();
    return res.json({
      message: `Detalle con id ${id} eliminado correctamente`,
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

exports.porConsumo = async (req, res) => {
  const id = req.params.id;
  try {
    const detalles = await Detalle.findAll({ where: { consumoId: id } });
    res.status(200).json(detalles);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
