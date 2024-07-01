module.exports = (sequelize, Sequelize) => {
  const Reserva = sequelize.define(
    "Reserva",
    /*Atributos*/
    {
      id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        autoIncrement: true,
      },
      fecha: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
      horaInicio: {
        type: Sequelize.TIME,
        allowNull: false,
        validate: {
          isIn: [
            [
              "12:00:00",
              "13:00:00",
              "14:00:00",
              "19:00:00",
              "20:00:00",
              "21:00:00",
              "22:00:00",
            ],
          ],
        },
      },
      horaFin: {
        type: Sequelize.TIME,
        allowNull: false,
        validate: {
          isIn: [
            [
              "13:00:00",
              "14:00:00",
              "15:00:00",
              "20:00:00",
              "21:00:00",
              "22:00:00",
              "23:00:00",
            ],
          ],
        },
      },
      cantidad: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
    },
    /*Opciones*/
    {
      timestamps: false,
    }
  );

  Reserva.addHook("beforeValidate", (reserva, options) => {
    const horaInicio = new Date(`1970-01-01T${reserva.horaInicio}Z`);
    const horaFin = new Date(`1970-01-01T${reserva.horaFin}Z`);

    if (reserva.horaInicio >= reserva.horaFin) {
      throw new Error("La hora de fin debe ser mayor que la hora de inicio");
    }

    const horaInicioHoras = horaInicio.getUTCHours();
    const horaFinHoras = horaFin.getUTCHours();

    if (
      (horaInicioHoras >= 12 && horaInicioHoras <= 14 && horaFinHoras > 15) ||
      (horaInicioHoras >= 19 && horaInicioHoras <= 22 && horaFinHoras > 23)
    ) {
      throw new Error(
        "La hora de fin no es válida para la hora de inicio dada"
      );
    }
  });

  return Reserva;
};
