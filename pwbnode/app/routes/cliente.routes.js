module.exports = (app) => {
    const cliente = require("../controllers/cliente.controller.js");
    var router = require("express").Router();
    router.post("/", cliente.crear);
    router.get("/", cliente.listar);
    router.get("/:cedula", cliente.encontrar);
    router.delete("/:id", cliente.eliminar);
    router.put("/:id", cliente.modificar);
    app.use("/api/cliente", router);
  };
  