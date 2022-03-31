'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Estado_turno extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            Estado_turno.hasMany(models.Turno);
        }
    };
    Estado_turno.init({
        descripcion:{type: DataTypes.STRING, allowNull:true},
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Estado_turno',
    tableName: 'Estado_turnos',
    timestamps: true,
  });
  return Estado_turno;
};