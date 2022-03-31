'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Medico extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            Medico.belongsTo(models.Especialidad);
            Medico.belongsTo(models.Persona);
            Medico.hasMany(models.Agenda);
        }
    };
    Medico.init({
        matricula:{type: DataTypes.INTEGER, allowNull:false, unique:true},
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Medico',
    tableName: 'medicos',
    timestamps: true,
  });
  return Medico;
};