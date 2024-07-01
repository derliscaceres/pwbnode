module.exports = (sequelize, Sequelize) => {
  const Consumo = sequelize.define(
    "Consumo",
    /* Atributos */
    {
      id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        autoIncrement: true,
      },
      estaAbierto: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true, // Por defecto, estado true (abierto)
      },
      total: {
        type: Sequelize.BIGINT,
        allowNull: false,
        defaultValue: 0,
      },
      horaInicio: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW, // Valor por defecto: fecha y hora actual
      },
      horaFin: {
        type: Sequelize.DATE,
        allowNull: true, // Permitir que pueda ser nulo (si aún no se cierra)
      },
    },
    /* Opciones */
    {
      timestamps: false, // Desactivar timestamps automáticos (createdAt y updatedAt)
    }
  );

  return Consumo;
};
