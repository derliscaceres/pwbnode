module.exports = (sequelize, Sequelize) => {
  const Restaurante = sequelize.define(
    "Restaurante",
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
        validate: {
          isAlpha: true,
        },
      },
      direccion: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      pisos: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
    },
    /*Opciones*/
    {
      timestamps: false,
    }
  );
  return Restaurante;
};
