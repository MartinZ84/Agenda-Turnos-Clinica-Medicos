const Medico = require("../models").Medico;
const Especialidad = require("../models").Especialidad;
const Persona = require("../models").Persona;

exports.verMedicos = async function (req, res) {
  console.log("llego a controllers.verMedicos ");
  if (req.user[0]) {
    console.log("dentro de if undefinied :    *****" + req.user[0]);
    req.user = req.user[0];
  }
  let medicos = await Medico.findAll();
  console.log("llego a controllers.verMedicos -- linea 12 ");
  let especialidad = await Especialidad.findAll();
  let personas = await Persona.findAll();

  console.log("llego a controllers.verMedicos -- linea 1", medicos);
  // { where: { userId: req.user.id } });
  res.render("medico/listaMedico", {
    pretty: true,
    title: "Cuyana medical -- Medicos",
    medicos: medicos,
    especialidad: especialidad,
    user: req.user,
    persona: req.persona,
    personas: personas,
  });
};

exports.medicosEsp = async function (req, res) {
  const medicos = await Medico.findAll({
    where: { EspecialidadId: req.params.EspId },
    include: Persona,
  });
  res.send(medicos);
};

exports.agregarMedico = function (req, res) {
  console.log("Entro en  agregarMedico ");
  if (req.user[0]) {
    console.log("dentro de if undefinied :    *****" + req.user[0]);
    req.user = req.user[0];
  }
  console.log(req.user);
  res.render("medico/formMedico", {
    title: "Cuyana Medical -- Agregar medico",
    form: true,
    pretty: true,
    user: req.user,
    persona: req.persona,
  });
  res.end();
};

exports.insertar = async function (req, res) {
  try {
    if (req.user.RoleId == 1) {
      await Medico.create(
        {
          PersonaId: req.body.persona,
          matricula: req.body.matricula,
          EspecialidadId: req.body.especialidad,
        },
        {
          include: [Persona, Especialidad],
        }
      );
      res.redirect("/medico");
    } else {
      res.redirect("/");
    }
  } catch (error) {
    console.log(error);
    res.status(500).json("Error: " + error);
  }
};

exports.medicoID = async function (req, res) {
  const medico = await Medico.findByPk(req.params.id, {
    include: [Persona, Especialidad],
  });
  res.render("medico", {
    pretty: true,
    medico: medico,
    role: req.user.RoleId,
    user: req.user,
    persona: req.persona,
  });
};
