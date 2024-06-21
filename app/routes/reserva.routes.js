module.exports = (app) => {
    const reserva = require("../controllers/reserva.controller.js");
    var router = require("express").Router();
    router.post("/", reserva.crear);
    router.get("/", reserva.listar);
    router.get("/:id", reserva.encontrar);
    router.delete("/:id", reserva.eliminar);
    router.put("/:id", reserva.modificar);
    app.use("/api/reserva", router);
  };
  