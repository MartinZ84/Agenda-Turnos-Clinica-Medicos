const Calendario = require("../models").Calendario;
const Agenda = require("../models").Agenda;
const Clinica = require("../models").Clinica;

exports.calendarioAgenda = async function (req, res) {
  const dias = await Calendario.findAll({
    where: { agendaId: req.params.AgendaId },
  });
  console.log(JSON.stringify(dias, null, 2));
  res.send(dias);
};

exports.agregarCal = async function (req, res) {
  if (req.user.RoleId == 1) {
    const dias = await Calendario.findAll({
      where: { agendaId: req.params.AgendaId },
    });
    const agenda = await Agenda.findOne({
      where: { id: req.params.AgendaId },
      order: [["createdAt", "DESC"]],
      include: [{ model: Clinica }],
    });
    console.log(agenda);

    res.render("agenda/agregarDia", {
      pretty: true,
      dias: dias,
      persona: req.persona,
      user: req.user,
      agenda: agenda,
    });
  } else {
    res.redirect("/");
  }
};

exports.insertarCal = async function (req, res) {
  console.log(req.body.fecha);
  Calendario.create(
    {
      AgendaId: req.body.agendaid,
      fecha: req.body.fecha,
      hora_inicio: req.body.hora_inicio,
      hora_fin: req.body.hora_fin,
    },
    {
      include: Agenda,
    }
  );
};
