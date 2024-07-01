module.exports = (app) => {
  const restaurante = require("../controllers/restaurante.controller.js");
  var router = require("express").Router();
  router.post("/", restaurante.crear);
  router.get("/", restaurante.listar);
  router.get("/:id", restaurante.encontrar);
  router.delete("/:id", restaurante.eliminar);
  router.put("/:id", restaurante.modificar);
  app.use("/api/restaurante", router);
};
