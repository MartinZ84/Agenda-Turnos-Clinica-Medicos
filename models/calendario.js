'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Calendario extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            Calendario.belongsTo(models.Agenda);
            Calendario.hasMany(models.Turno)
        }
    };
    Calendario.init({
        fecha:{type: DataTypes.DATEONLY, allowNull:false},
        hora_inicio:{type: DataTypes.TIME, allowNull:false},
        hora_fin:{type: DataTypes.TIME, allowNull:false},
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Calendario',
    tableName: 'calendarios',
    timestamps: true,
  });
  return Calendario;
};