const db = require("../models");
const Consumo = db.Consumo;
const Detalle = db.Detalle;
const Producto = db.Producto;
const Mesa = db.Mesa;
const Cliente = db.Cliente;

const { jsPDF } = require("jspdf");
const fs = require("fs").promises;

/* Crear un nuevo consumo */
exports.crear = async (req, res) => {
  try {
    const consumo = await Consumo.create(req.body);
    res.status(201).json(consumo);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* Obtener todos los consumos */
exports.listar = async (req, res) => {
  try {
    const consumos = await Consumo.findAll();
    res.json(consumos);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* Obtener un consumo por ID */
exports.encontrar = async (req, res) => {
  const id = req.params.id;
  try {
    const consumo = await Consumo.findByPk(id);
    if (!consumo) {
      res.status(404).json({ message: `Consumo con id ${id} no encontrado.` });
    } else {
      res.json(consumo);
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* Actualizar un consumo por ID */
exports.modificar = async (req, res) => {
  const id = req.params.id;
  //console.log(req.body);
  try {
    let consumo = await Consumo.findByPk(id);
    if (!consumo) {
      return res
        .status(404)
        .json({ message: `Consumo con id ${id} no encontrado.` });
    }

    // Verificar si se está marcando como cerrado y actualizar closedAt
    if (req.body.estaAbierto === false && consumo.estaAbierto === true) {
      req.body.horaFin = new Date(); // Guarda la fecha y hora actual como closedAt
    } else if (req.body.estaAbierto === true && consumo.estaAbierto === false) {
      req.body.horaFin = null; // Elimina el valor de closedAt
    }

    consumo = await consumo.update(req.body);
    //console.log(consumo);
    res.json(consumo);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* Eliminar un consumo por ID */
exports.eliminar = async (req, res) => {
  const id = req.params.id;
  try {
    const consumo = await Consumo.findByPk(id);
    if (!consumo) {
      return res
        .status(404)
        .json({ message: `Consumo con id ${id} no encontrado.` });
    }

    await consumo.destroy();
    res.json({ message: `Consumo con id ${id} eliminado correctamente.` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.generarPDF = async (req, res) => {
  const id = req.params.id;
  try {
    const consumo = await Consumo.findByPk(id);
    if (!consumo) {
      return res
        .status(404)
        .json({ message: `Consumo con id ${id} no encontrado.` });
    }
    if (consumo.estaAbierto) {
      return res
        .status(404)
        .json({ message: `Consumo con id ${id} aún está abierto.` });
    }

    // Traemos los datos para el PDF
    const detalles = await Detalle.findAll({ where: { consumoId: id } });
    const mesa = await Mesa.findByPk(consumo.mesaId);
    const cliente = await Cliente.findByPk(consumo.clienteId);

    // Crear un nuevo documento PDF
    const pdfDoc = new jsPDF();

    // Definir contenido del documento PDF
    pdfDoc.text(`Fecha: ${consumo.horaFin}`, 50, 50);
    pdfDoc.text(`Consumo: ${consumo.id}`, 50, 60);
    pdfDoc.text(`Cliente: ${cliente.apellido}, ${cliente.nombre}`, 50, 70);
    pdfDoc.text(`Documento: ${cliente.cedula}`, 50, 80);
    pdfDoc.text(`Mesa: ${mesa.nombre} (${mesa.id})`, 50, 90);
    pdfDoc.text(`Detalles:`, 50, 100);

    let yPosition = 110;
    // Procesar detalles y escribir en el PDF
    for (let i = 0; i < detalles.length; i++) {
      const detalle = detalles[i];
      const producto = await Producto.findByPk(detalle.productoId);
      const cantidad = parseInt(detalle.cantidad, 10);
      const precio = parseInt(producto.precio, 10);
      const total = cantidad * precio;
      pdfDoc.text(`- ${producto.nombre}`, 50, yPosition);
      pdfDoc.text(
        `${producto.precio} * ${detalle.cantidad} = ${total}`,
        60,
        yPosition + 10
      );
      yPosition += 20; // Mover hacia abajo para el siguiente detalle
    }

    if (detalles.length === 0) {
      pdfDoc.text(`No hay detalles para este Consumo.`, 50, yPosition);
      yPosition += 20;
    }

    pdfDoc.text(`Total: ${consumo.total}`, 50, yPosition);

    // Obtener el documento en formato PDF como ArrayBuffer
    const pdfBytes = pdfDoc.output("arraybuffer");

    // Configurar la respuesta HTTP para descargar el PDF
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=factura_${consumo.id}_${cliente.cedula}.pdf`
    );
    res.send(Buffer.from(pdfBytes));
  } catch (err) {
    console.error("Error en generarPDF:", err);
    res.status(500).json({ message: err.message });
  }
};
