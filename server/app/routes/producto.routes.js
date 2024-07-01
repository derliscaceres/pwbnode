module.exports = (app) => {
  const producto = require("../controllers/producto.controller.js");
  var router = require("express").Router();

  router.post("/", producto.crear);
  router.get("/", producto.listar);
  router.get("/:id", producto.encontrar);
  router.delete("/:id", producto.eliminar);
  router.put("/:id", producto.modificar);

  app.use("/api/producto", router);
};
