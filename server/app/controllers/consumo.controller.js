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
      return res.status(404).json({ message: `Consumo con id ${id} no encontrado.` });
    }
    if (consumo.estaAbierto) {
      return res.status(404).json({ message: `Consumo con id ${id} aún está abierto.` });
    }

    // Traemos los datos para el PDF
    const detalles = await Detalle.findAll({ where: { consumoId: id } });
    const mesa = await Mesa.findByPk(consumo.mesaId);
    const cliente = await Cliente.findByPk(consumo.clienteId);

    // Formateamos la fecha manualmente
    const date = new Date(consumo.horaFin);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Los meses van de 0 a 11
    const year = date.getFullYear();
    const fechaFormateada = `${day}/${month}/${year}`;
    
    const ancho = 80;
    const largo = 300;
    // Crear un nuevo documento PDF con un ancho y altura típicos de un ticket
    const pdfDoc = new jsPDF({
      unit: 'mm',
      format: [ancho, largo]  // Ancho de 80mm y altura de 297mm (A4)
    });

    // Definir tamaño de texto más pequeño para parecer un ticket
    const textSize = 8;
    pdfDoc.setFontSize(textSize);
    pdfDoc.setFont('Courier', 'normal');
    const espaciado = textSize/2;
    tabulado = 1
    // Definir contenido del documento PDF
    let yPosition = espaciado;
    pdfDoc.text(`Fecha: ${fechaFormateada}`, tabulado, yPosition);
    yPosition += espaciado;
    pdfDoc.text(`Consumo: ${consumo.id}`, tabulado, yPosition);
    yPosition += espaciado;
    pdfDoc.text(`Cliente: ${cliente.apellido}, ${cliente.nombre}`, tabulado, yPosition);
    yPosition += espaciado;
    pdfDoc.text(`Documento: ${cliente.cedula}`, tabulado, yPosition);
    yPosition += espaciado;
    pdfDoc.text(`Mesa: ${mesa.nombre} (${mesa.id})`, tabulado, yPosition);
    yPosition += espaciado;
    pdfDoc.text(`Detalles:`, tabulado, yPosition);
    yPosition += espaciado;

    // Procesar detalles y escribir en el PDF
    for (let i = 0; i < detalles.length; i++) {
      const detalle = detalles[i];
      const producto = await Producto.findByPk(detalle.productoId);
      const cantidad = parseInt(detalle.cantidad, 10);
      const precio = parseInt(producto.precio, 10);
      const total = cantidad * precio;
      pdfDoc.text(`- ${producto.nombre}`, tabulado, yPosition);
      yPosition += espaciado;
      pdfDoc.text(`${cantidad} x ${producto.precio} = ${total}`, tabulado, yPosition);
      yPosition += espaciado;
    }

    if (detalles.length === 0) {
      pdfDoc.text(`No hay detalles para este Consumo.`, tabulado, yPosition);
      yPosition += espaciado;
    }

    yPosition += espaciado;
    pdfDoc.text(`Total: ${consumo.total}`, tabulado, yPosition);

    // Obtener el documento en formato PDF como ArrayBuffer
    const pdfBytes = pdfDoc.output('arraybuffer');

    // Configurar la respuesta HTTP para descargar el PDF
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=consumo.pdf");
    res.send(Buffer.from(pdfBytes));

  } catch (err) {
    console.error('Error en generarPDF:', err);
    res.status(500).json({ message: err.message });
  }
};