const dbConfig = require("../config/db.config.js");
const Sequelize = require("sequelize");

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  operatorsAliases: false,
  port: dbConfig.port,
  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle,
  },
});

/* Objeto Sequelize*/
const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

/* Importación de modelos */
db.Ventas = require("./venta.model.js")(sequelize, Sequelize);

db.Cliente = require("./cliente.model.js")(sequelize, Sequelize);
db.Mesa = require("./mesa.model.js")(sequelize, Sequelize);
db.Restaurante = require("./restaurante.model.js")(sequelize, Sequelize);
db.Reserva = require("./reserva.model.js")(sequelize, Sequelize);

/* Primer final */
db.Categoria = require("./categoria.model.js")(sequelize, Sequelize);
db.Producto = require("./producto.model.js")(sequelize, Sequelize);
db.Consumo = require("./consumo.model.js")(sequelize, Sequelize);
db.Detalle = require("./detalle.model.js")(sequelize, Sequelize);

/* Definición de relaciones*/

db.Restaurante.hasMany(db.Mesa); // FK en mesa
db.Mesa.belongsTo(db.Restaurante);

db.Cliente.hasMany(db.Reserva); // FK en reserva
db.Reserva.belongsTo(db.Cliente);

db.Mesa.hasMany(db.Reserva); // FK en reserva
db.Reserva.belongsTo(db.Mesa);

// db.Categoria.hasMany(db.Producto, { foreignKey: "categoriaId" }); // FK en producto
// db.Producto.belongsTo(db.Categoria, { foreignKey: "categoriaId" });

// db.Consumo.hasMany(db.Detalle, { foreignKey: "consumoId" }); // FK en detalle
// db.Detalle.belongsTo(db.Consumo, { foreignKey: "consumoId" });

// db.Mesa.hasMany(db.Consumo, { foreignKey: "mesaId" }); // FK en consumo
// db.Consumo.belongsTo(db.Mesa, { foreignKey: "mesaId" });

// db.Cliente.hasMany(db.Consumo, { foreignKey: "clienteId" }); // FK en consumo
// db.Consumo.belongsTo(db.Cliente, { foreignKey: "clienteId" });

// db.Detalle.belongsToMany(db.Producto, { through: 'ProductoDetalle' }); // ManyToMany
// db.Producto.belongsToMany(db.Detalle, { through: 'ProductoDetalle' });

db.Categoria.hasMany(db.Producto, {
  foreignKey: {
    name: "categoriaId",
    allowNull: false,
  },
});
db.Producto.belongsTo(db.Categoria, {
  foreignKey: {
    name: "categoriaId",
    allowNull: false,
  },
});

db.Consumo.hasMany(db.Detalle, {
  foreignKey: {
    name: "consumoId",
    allowNull: false,
  },
});
db.Detalle.belongsTo(db.Consumo, {
  foreignKey: {
    name: "consumoId",
    allowNull: false,
  },
});

db.Mesa.hasMany(db.Consumo, {
  foreignKey: {
    name: "mesaId",
    allowNull: false,
  },
});
db.Consumo.belongsTo(db.Mesa, {
  foreignKey: {
    name: "mesaId",
    allowNull: false,
  },
});

db.Cliente.hasMany(db.Consumo, {
  foreignKey: {
    name: "clienteId",
    allowNull: false,
  },
});
db.Consumo.belongsTo(db.Cliente, {
  foreignKey: {
    name: "clienteId",
    allowNull: false,
  },
});

db.Producto.hasMany(db.Detalle, {
  foreignKey: {
    name: "productoId",
    allowNull: false,
  },
});
db.Detalle.belongsTo(db.Producto, {
  foreignKey: {
    name: "productoId",
    allowNull: false,
  },
});

module.exports = db;
