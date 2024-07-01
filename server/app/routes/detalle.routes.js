module.exports = (app) => {
  const detalle = require("../controllers/detalle.controller.js");
  var router = require("express").Router();

  router.post("/", detalle.crear);
  router.get("/", detalle.listar);
  router.get("/:id", detalle.encontrar);
  router.delete("/:id", detalle.eliminar);
  router.put("/:id", detalle.modificar);

  router.get("/porconsumo/:id", detalle.porConsumo);

  app.use("/api/detalle", router);
};
