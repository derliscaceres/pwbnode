module.exports = (sequelize, Sequelize) => {
  const Cliente = sequelize.define(
    "Cliente",
    /*Atributos*/
    {
      id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        autoIncrement: true,
      },
      cedula: {
        type: Sequelize.BIGINT,
        unique: true,
        allowNull: false,
      },
      nombre: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      apellido: {
        type: Sequelize.STRING,
        allowNull: false,
      },
    },
    /*Opciones*/
    {
      timestamps: false,
    }
  );
  return Cliente;
};
