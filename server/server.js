const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const db = require("./app/models/index.js");

/* Sincronización de modelos con la base de datos */
db.sequelize.sync().then(() => {
  console.log("\n\nBase de datos sincronizada correctamente\n\n");
}).catch(err => {
  console.error("\n\nError al sincronizar la base de datos:", err);
});

/* Configuración de CORS */
const corsOptions = {
  origin: "http://localhost:3000", // Cambia esta URL según tu configuración de cliente
};
app.use(cors(corsOptions));

/* Middleware para parsear JSON y formularios URL-encoded */
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

/* Ruta de prueba */
app.get("/", (req, res) => {
  res.json({ message: "Bienvenido Node backend 2024" });
});

/* Rutas principales */
require("./app/routes/cliente.routes.js")(app); // Rutas para Cliente
require("./app/routes/mesa.routes.js")(app); // Rutas para Mesa
require("./app/routes/reserva.routes.js")(app); // Rutas para Reserva
require("./app/routes/restaurante.routes.js")(app); // Rutas para Restaurante

/* Puerto de escucha */
const PORT = process.env.PORT || 9090;
app.listen(PORT, () => {
  console.log(`\n\nLa aplicación está corriendo en el puerto ${PORT}.\n\n`);
});
