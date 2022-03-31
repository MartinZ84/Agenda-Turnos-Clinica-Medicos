'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Procedimiento extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            Procedimiento.hasMany(models.Agenda);
        }
    };
    Procedimiento.init({
        nombre:{type: DataTypes.STRING, allowNull:false, unique: true},
        descripcion:{type: DataTypes.STRING, allowNull:false},
        indicaciones:{type: DataTypes.STRING, allowNull:false},
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Procedimiento',
    tableName: 'procedimientos',
    timestamps: true,
  });
  return Procedimiento;
};