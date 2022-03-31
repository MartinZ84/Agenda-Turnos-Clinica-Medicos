'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Turno extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            Turno.belongsTo(models.Calendario);
            Turno.belongsTo(models.Estado_turno);
            Turno.belongsTo(models.Persona);
        }
    };
    Turno.init({
        fecha_reserva:{type: DataTypes.DATE, allowNull:true},
        hora_turno:{type: DataTypes.TIME, allowNull:false},
        comentario:{type: DataTypes.STRING, allowNull:true},
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Turno',
    tableName: 'turnos',
    timestamps: true,
  });
  return Turno;
};