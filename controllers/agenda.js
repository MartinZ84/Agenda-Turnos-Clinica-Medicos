const Medico = require("../models").Medico;
const Agenda = require("../models").Agenda;
const Clinica = require("../models").Clinica;
const Persona = require("../models").Persona;
const Procedimiento = require("../models").Procedimiento;

exports.listarAgenda = async function (req, res) {
  if (req.user.RoleId == 1) {
    const agendas = await Agenda.findAll({
      order: [["createdAt", "DESC"]],
      include: [
        { model: Clinica },
        { model: Procedimiento },
        { model: Persona },
        { model: Medico, include: { model: Persona } },
      ],
    });
    res.render("agenda/listaAgenda", {
      pretty: true,
      agendas: agendas,
      user: req.user,
      persona: req.persona,
    });
  } else if (req.user.RoleId == 3) {
    res.render("paciente-buscarAgenda", {
      pretty: true,
      persona: req.user,
      persona: req.persona,
    });
  } else {
    res.redirect("/");
  }
};

exports.agendasMed = async function (req, res) {
  const agendas = await Agenda.findAll({
    where: { MedicoId: req.params.MedId },
    include: Clinica,
  });
  res.send(agendas);
};

exports.agendasPro = async function (req, res) {
  const agendas = await Agenda.findAll({
    where: { ProcedimientoId: req.params.ProId },
    include: Clinica,
  });
  res.send(agendas);
};

exports.crearAgenda = async function (req, res) {
  if (req.user.RoleId == 1) {
    res.render("agenda/formAgenda", {
      pretty: true,
      persona: req.user.Persona,
      user: req.user,
    });
  } else {
    res.redirect("/");
  }
};

exports.insertarAgenda = async function (req, res) {
  if (req.body.tipo == "Medico") {
    console.log("entro en insertar agenda por medico");
    const medico = await Medico.findByPk(req.body.medico, { include: Persona });
    await Agenda.create({
      PersonaId: req.persona.id,
      ClinicaId: req.body.clinica,
      MedicoId: req.body.medico,
      nombre:
        "Agenda de " + medico.Persona.nombre + " " + medico.Persona.apellido,
      tiempo_turno: req.body.tiempo_turno,
    });
    res.redirect("/agenda/");
  } else if (req.body.tipo == "Procedimiento") {
    console.log("entro en insertar agenda por procedimiento");
    console.log(req.user);
    console.log(req.persona);
    const pro = await Procedimiento.findByPk(req.body.procedimiento);
    await Agenda.create({
      PersonaId: req.persona.id,
      ClinicaId: req.body.clinica,
      ProcedimientoId: req.body.procedimiento,
      nombre: "Agenda de " + pro.nombre,
      tiempo_turno: req.body.tiempo_turno,
    });
    res.redirect("/agenda/");
  } else {
    res.json({ msg: "error no eligio el tipo de agenda" });
  }
};

exports.clinicaTodas = async function (req, res) {
  console.log("entro clinicas tosas");
  const clinicas = await Clinica.findAll();
  console.log(clinicas);
  res.json(clinicas);
};
