'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Especialidad extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            Especialidad.hasMany(models.Medico);
        }
    };
    Especialidad.init({
        nombre:{type: DataTypes.STRING, allowNull:false},
        detalles:{type: DataTypes.STRING, allowNull:false},
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Especialidad',
    tableName: 'especialidads',
    timestamps: true,
  });
  return Especialidad;
};