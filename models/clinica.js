'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Clinica extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            Clinica.hasMany(models.Agenda);
        }
    };
    Clinica.init({
        nombre:{type: DataTypes.STRING, allowNull:false},
        direccion:{type: DataTypes.STRING, allowNull:false},
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Clinica',
    tableName: 'Clinicas',
    timestamps: true,
  });
  return Clinica;
};