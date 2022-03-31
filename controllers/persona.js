const { Op } = require("sequelize");
var db = require("../models/index");
const bcrypt = require("bcrypt");
// const authConfig = require('../config/auth')
const Persona = require("../models").Persona;
const Usuario = require("../models").Usuario;

exports.cargarPerfil = async function (req, res) {
  console.log("entro cargar perfil");
  console.log(req.params);
  const persona = await Persona.findByPk(req.params.personaId, {
    include: Usuario,
  });
  res.render("paciente-perfil", {
    pretty: true,
    persona: persona,
    user: req.user,
    // persona: req.persona,
  });
};

exports.agregar = function (req, res) {
  if (req.user.RoleId == 2) {
    res.render("secretario-agregarPersona", {
      pretty: true,
      persona: req.user.Persona,
    });
  } else {
    res.redirect("/");
  }
};

exports.agregarPersona = function (req, res) {
  try {
    console.log("Entro en  agregarPersona");
    if (req.user[0]) {
      console.log("dentro de if undefinied :    *****" + req.user[0]);
      req.user = req.user[0];
    }
    console.log(req.user);
    res.render("persona/formPersona", {
      title: "Cuyana Medical -- Agregar persona",
      form: true,
      pretty: true,
      user: req.user,
      persona: req.persona,
    });
    res.end();
  } catch (error) {
    res.send(error);
  }
};

exports.personasSinRelacion = async function (req, res) {
  const personas = await db.sequelize.query(
    "SELECT * FROM `personas` WHERE (id NOT IN (SELECT personaid FROM medicos)) AND tipoPer= 1 ",
    {
      model: Persona,
    }
  );
  res.send(personas);
};

exports.personasConUsuPaciente = async function (req, res) {
  const personas = await Persona.findAll({
    where: { UsuarioId: { [Op.not]: null } },
    include: { model: Usuario, where: { RoleId: 3 } },
  });
  res.send(personas);
};

exports.listaPersonas = async function (req, res) {
  try {
    console.log("llego a controllers  verPersonas ");
    if (req.user[0]) {
      console.log("dentro de if undefinied :    *****" + req.user[0]);
      req.user = req.user[0];
    }
    const personas = await Persona.findAll();
    console.log("llego a controllers.ver Personas -- linea 52 ");

    // { where: { userId: req.user.id } });
    res.render("persona/listaPersona", {
      pretty: true,
      title: "Cuyana medical -- Persona",
      personas: personas,
      user: req.user,
      persona: req.persona,
    });
  } catch (error) {
    res.send(error);
  }

  // const personas = await Persona.findAll({
  //   where: { UsuarioId: { [Op.not]: null } },
  //   include: { model: Usuario, where: { RoleId: 3 } },
  // });
  // res.send(personas);
};

exports.insertar = async function (req, res) {
  try {
    if (req.user.RoleId == 1) {
      await Persona.create({
        dni: req.body.dni,
        nombre: req.body.nombre,
        apellido: req.body.apellido,
        celular: req.body.celular,
        email: req.body.email,
        domicilio: req.body.domicilio,
        riesgoso: 0,
        tipoPer: req.body.tipoPer,
      });
      res.redirect("/medico/agregarMedico");
    } else if (req.user.RoleId == 2) {
      let password = await bcrypt.hashSync(req.body.password, 10);

      await Persona.create(
        {
          dni: req.body.dni,
          nombre: req.body.nombre,
          apellido: req.body.apellido,
          celular: req.body.celular,
          email: req.body.email,
          domicilio: req.body.domicilio,
          riesgoso: 0,
          tipoPer: req.body.tipoPer,
          Usuario: {
            // usuario: req.body.userRegistro,
            usuario: req.body.email,
            password: password,
          },
        },
        {
          include: Usuario,
        }
      );
      // res.redirect("/turno/allTurnos");
      res.redirect("/persona");
    } else {
      res.redirect("/");
    }
  } catch (error) {
    console.log("Error de persona agregar: ", error);
    res.status(500).json(error.errors[0]);
  }
};

exports.update = async function (req, res) {
  const persona = await Persona.findByPk(req.user.Persona.id);
  const usuario = await Usuario.findByPk(req.user.id);
  if (req.body.password != "") {
    let password = bcrypt.hashSync(req.body.password, authConfig.rounds);
    usuario.password = password;
  }
  usuario.usuario = req.body.usuario;
  persona.celular = req.body.celular;
  persona.email = req.body.email;
  persona.domicilio = req.body.domicilio;
  await persona.save();
  await usuario.save();
  res.redirect("/");
};
