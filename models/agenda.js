'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Agenda extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            Agenda.belongsTo(models.Clinica);
            Agenda.belongsTo(models.Procedimiento);
            Agenda.belongsTo(models.Medico);
            Agenda.belongsTo(models.Persona);
            Agenda.hasMany(models.Calendario)
        }
    };
    Agenda.init({
        nombre:{type: DataTypes.STRING, allowNull:false},
        tiempo_turno:{type: DataTypes.TIME, allowNull:false},
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Agenda',
    tableName: 'agendas',
    timestamps: true,
  });
  return Agenda;
};