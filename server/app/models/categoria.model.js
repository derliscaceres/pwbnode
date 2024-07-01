module.exports = (sequelize, Sequelize) => {
  const Categoria = sequelize.define(
    "Categoria",
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
    },
    /*Opciones*/
    {
      timestamps: false,
    }
  );
  return Categoria;
};
