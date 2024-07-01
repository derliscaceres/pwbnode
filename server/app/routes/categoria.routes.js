module.exports = (app) => {
  const categoria = require("../controllers/categoria.controller.js");
  var router = require("express").Router();

  router.post("/", categoria.crear);
  router.get("/", categoria.listar);
  router.get("/:id", categoria.encontrar);
  router.delete("/:id", categoria.eliminar);
  router.put("/:id", categoria.modificar);

  app.use("/api/categoria", router);
};
