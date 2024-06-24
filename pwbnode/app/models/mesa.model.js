module.exports = (sequelize, Sequelize) => {
  const Mesa = sequelize.define(
    "Mesa",
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
      cantidad: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      posx: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      posy: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      piso: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
    },
    /*Opciones */
    {
      timestamps: false,
    }
  );
  return Mesa;
};
