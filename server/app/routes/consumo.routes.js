module.exports = (app) => {
  const consumo = require("../controllers/consumo.controller.js");
  var router = require("express").Router();

  router.post("/", consumo.crear);
  router.get("/", consumo.listar);
  router.get("/mesa/:id", consumo.listarPorMesa);
  router.get("/:id", consumo.encontrar);
  router.delete("/:id", consumo.eliminar);
  router.put("/:id", consumo.modificar);

  router.get("/pdf/:id", consumo.generarPDF);

  app.use("/api/consumo", router);
};
