module.exports = (sequelize, Sequelize) => {
  const Detalle = sequelize.define(
    "Detalle",
    /*Atributos*/
    {
      id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        autoIncrement: true,
      },
      cantidad: {
        type: Sequelize.BIGINT,
        allowNull: false,
      },
    },
    /*Opciones*/
    {
      timestamps: false,
    }
  );
  return Detalle;
};
