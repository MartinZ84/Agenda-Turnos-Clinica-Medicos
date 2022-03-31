"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Usuario extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Usuario.hasOne(models.Persona);
      Usuario.belongsTo(models.Role);
    }
  }
  Usuario.init(
    {
      usuario: { type: DataTypes.STRING, unique: true },
      password: { type: DataTypes.STRING, allowNull: true },
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "Usuario",
      tableName: "usuarios",
      timestamps: true,
    }
  );
  return Usuario;
};
