"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Persona extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Persona.belongsTo(models.Usuario);
      Persona.hasOne(models.Medico);
      Persona.hasMany(models.Agenda);
      Persona.hasMany(models.Turno);
    }
  }
  Persona.init(
    {
      dni: { type: DataTypes.INTEGER, unique: true },
      usuarioid: { type: DataTypes.INTEGER, allowNull: true },
      nombre: { type: DataTypes.STRING, allowNull: false },
      apellido: { type: DataTypes.STRING, allowNull: false },
      celular: { type: DataTypes.INTEGER, allowNull: false },
      email: { type: DataTypes.STRING, allowNull: false },
      domicilio: { type: DataTypes.STRING, allowNull: false },
      riesgoso: { type: DataTypes.INTEGER, allowNull: false },
      tipoPer: { type: DataTypes.INTEGER, allowNull: true },
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "Persona",
      tableName: "personas",
      timestamps: true,
    }
  );
  return Persona;
};
