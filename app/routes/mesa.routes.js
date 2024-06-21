module.exports = (app) => {
    const mesa = require("../controllers/mesa.controller.js");
    var router = require("express").Router();
    router.post("/", mesa.crear);
    router.get("/", mesa.listar);
    router.get("/:id", mesa.encontrar);
    router.delete("/:id", mesa.eliminar);
    router.put("/:id", mesa.modificar);
    router.post("/disponible", mesa.mesasDisponibles);
    app.use("/api/mesa", router);
  };
  