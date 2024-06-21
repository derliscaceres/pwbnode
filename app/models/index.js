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

/* Definición de relaciones*/

db.Restaurante.hasMany(db.Mesa);
db.Mesa.belongsTo(db.Restaurante);

db.Cliente.hasMany(db.Reserva);
db.Reserva.belongsTo(db.Cliente);

db.Mesa.hasMany(db.Reserva);
db.Reserva.belongsTo(db.Mesa);

module.exports = db;
