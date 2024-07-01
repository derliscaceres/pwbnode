module.exports = (sequelize, Sequelize) => {
  const Producto = sequelize.define(
    "Producto",
    /*Atributos*/
    {
      id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        autoIncrement: true,
      },
      nombre: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      precio: {
        type: Sequelize.BIGINT,
        allowNull: false,
      },
    },
    /*Opciones*/
    {
      timestamps: false,
    }
  );
  return Producto;
};
