const Turno = require("../models").Turno;
const EstadoTurno = require("../models").Estado_turno;
const Calendario = require("../models").Calendario;
const Persona = require("../models").Persona;
const Agenda = require("../models").Agenda;
const Procedimiento = require("../models").Procedimiento;
const Especialidad = require("../models").Especialidad;
const Medico = require("../models").Medico;
const Clinica = require("../models").Clinica;
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
// import { transporter } from "./../config/mailer";
const transporter = require("../config/mailer").transporter;
const moment = require("moment");

exports.turnosDisponibles = async function (req, res) {
  console.log(req.params);
  if (req.user.RoleId == 1 || 3) {
    const turnos = await Turno.findAll({
      where: { calendarioId: req.params.idCalendario, EstadoTurnoId: 1 },
      include: [
        { model: Persona },
        { model: EstadoTurno },
        {
          model: Calendario,
          include: {
            model: Agenda,
            include: [
              { model: Medico, include: Persona },
              { model: Procedimiento },
              { model: Clinica },
            ],
          },
        },
      ],
      // [Calendario, EstadoTurno],
    });

    res.render("turno/turnosCreadosReciente", {
      pretty: true,
      turnos: turnos,
      role: req.user.RoleId,
      persona: req.persona,
      user: req.user,
    });
  } else {
    res.redirect("/");
  }
};

exports.secretarioTurnos = async function (req, res) {
  console.log("********************************+");
  console.log(req.persona);
  try {
    if (req.user.RoleId == 2) {
      const turnos = await Turno.findAll({
        where: {
          // "$Turno.PersonaId$": req.persona.id,
          EstadoTurnoId: [2, 4],
        },
        include: [
          { model: Persona },
          { model: EstadoTurno },
          {
            model: Calendario,
            include: {
              model: Agenda,
              include: [
                { model: Medico, include: Persona },
                { model: Procedimiento },
                { model: Clinica },
              ],
            },
          },
        ],
      });
      console.log(
        "************************turnos*******************************"
      );
      console.log(turnos);
      const persona = await Persona.findByPk(req.persona.id);
      res.render("turno/turnosSecretario", {
        pretty: true,
        turnos: turnos,
        persona: persona,
        user: req.user,
      });
    } else {
      res.redirect("/");
    }
  } catch (error) {
    console.log(error);
  }
};

exports.misTurnos = async function (req, res) {
  console.log("********************************+");
  console.log(req.persona);
  try {
    if (req.user.RoleId == 3) {
      const turnos = await Turno.findAll({
        where: {
          "$Turno.PersonaId$": req.persona.id,
          EstadoTurnoId: [2, 3, 4, 5],
        },
        include: [
          { model: Persona },
          { model: EstadoTurno },
          {
            model: Calendario,
            include: {
              model: Agenda,
              include: [
                { model: Medico, include: Persona },
                { model: Procedimiento },
                { model: Clinica },
              ],
            },
          },
        ],
      });
      console.log(
        "************************turnos*******************************"
      );
      console.log(turnos);
      const persona = await Persona.findByPk(req.persona.id);
      res.render("turno/turnosPaciente", {
        pretty: true,
        turnos: turnos,
        persona: persona,
        user: req.user,
      });
    } else {
      res.redirect("/");
    }
  } catch (error) {
    console.log(error);
  }
};

exports.allTurnos = async function (req, res) {
  console.log(
    "-*********************Entro buscar agenda************************o"
  );
  if (req.user.RoleId == 2) {
    const turnos = await Turno.findAll({
      include: [
        { model: Persona },
        { model: EstadoTurno },
        {
          model: Calendario,
          include: {
            model: Agenda,
            include: [
              { model: Medico, include: [Especialidad, Persona] },
              { model: Procedimiento },
              { model: Clinica },
            ],
          },
        },
      ],
      limit: 1000,
      order: "follower DESC",
    });
    res.render("secretario-allTurnos", {
      pretty: true,
      turnos: turnos,
      persona: req.user.Persona,
    });
  } else {
    res.redirect("/");
  }
};

exports.buscarAgenda = async function (req, res) {
  try {
    console.log("********************entro en buscarAgenda");

    if (req.user.RoleId == 3) {
      res.render("turno/pacienteBusAgenda", {
        pretty: true,
        persona: req.persona,
        user: req.user,
      });
    }

    if (req.user.RoleId == 2) {
      res.render("turno/secretarioBuscarAgenda", {
        pretty: true,
        persona: req.persona,
        user: req.user,
      });
    } else {
      res.redirect("/");
    }
  } catch (error) {
    console.log(error);
  }
};

exports.reserva = async function (req, res) {
  let hoy = new Date();
  console.log(req.query);
  const persona = await Persona.findByPk(req.query.perId);
  const turno = await Turno.findByPk(req.query.turId);
  // turno.fecha_reserva = req.body.fecha_reserva;
  turno.fecha_reserva = hoy;
  turno.EstadoTurnoId = 2;
  turno.PersonaId = req.query.perId;
  await turno.save();
  try {
    console.log(
      "******************entro a enviar mail****************************"
    );
    const calendar = await Calendario.findByPk(turno.CalendarioId);
    const agenda = await Agenda.findByPk(calendar.AgendaId);
    const clinica = await Clinica.findByPk(agenda.ClinicaId);
    const procedimiento = await Procedimiento.findByPk(agenda.ProcedimientoId);
    const medico = await Medico.findByPk(agenda.MedicoId);
    let perMed;
    let especialidad;
    if (medico) {
      perMed = await Persona.findByPk(medico.PersonaId);
      especialidad = await Especialidad.findByPk(medico.EspecialidadId);
    }

    //  console.log(medico);
    if (procedimiento) {
      let info = await transporter.sendMail({
        from: '"Cuyana Medical 👻" <laprueba.correo@gmail.com>', // sender address
        to: persona.email, // list of receivers
        subject: "Reserva de turno en Cuyana Medical", // Subject line
        text: `Usted ha realizado la reserva del turno`, // plain text body
        html: `<p>Usted ha realizado la reserva del turno numero: <b>${
          turno.id
        }</b>, para la fecha: <b>${moment(calendar.fecha).format(
          "DD/MM/YYYY"
        )}</b>, hora: <b>${turno.hora_turno}</b>.  Procedimiento: <b>${
          procedimiento.nombre
        }</b>. Indicaciones para procedimiento: <b>${
          procedimiento.indicaciones
        }</b>.  </br>Clinica: <b>${clinica.nombre}</b>. Direccion: <b>${
          clinica.direccion
        }</b>.</p>`, // html body
      });
    } else {
      let info = await transporter.sendMail({
        from: '"Cuyana Medical 👻" <laprueba.correo@gmail.com>', // sender address
        to: persona.email, // list of receivers
        subject: "Reserva de turno en Cuyana Medical", // Subject line
        text: `Usted ha realizado la reserva del turno`, // plain text body
        html: `<p>Usted ha realizado la reserva del turno numero :<b>${
          turno.id
        }</b>, para la fecha: <b>${moment(calendar.fecha).format(
          "DD/MM/YYYY"
        )}</b>, hora: <b>${turno.hora_turno}</b>.  Medico: <b>${
          perMed.nombre
        } ${perMed.apellido}</b>, Especialidad: <b>${
          especialidad.nombre
        }</b>  Matricula: <b>${medico.matricula}</b>. </br>Clinica: <b>${
          clinica.nombre
        }</b>. Direccion: <b>${clinica.direccion}</b>.</p>`, // html body
      });
    }
  } catch (error) {
    console.log(error);
  }
  res.redirect("/turno/misTurnos");
};

exports.cambiarEstado = async function (req, res) {
  console.log(
    "*********************************** cambiar estado***********************+"
  );
  console.log(req.body);
  const turno = await Turno.findByPk(req.body.id);
  const persona = await Persona.findByPk(req.body.personaid);
  turno.EstadoTurnoId = req.body.estadoTurno;
  if (req.body.estadoTurno == 3) {
    persona.riesgoso += 1;
    turno.EstadoTurnoId = 1;
    turno.PersonaId = 0;
  }
  if (req.body.estadoTurno == 2) {
    turno.PersonaId = req.body.personaid;
    turno.fecha_reserva = req.body.fecha_reserva;
    try {
      console.log(
        "******************entro a enviar mail****************************"
      );
      const calendar = await Calendario.findByPk(turno.CalendarioId);
      const agenda = await Agenda.findByPk(calendar.AgendaId);
      const clinica = await Clinica.findByPk(agenda.ClinicaId);
      const procedimiento = await Procedimiento.findByPk(
        agenda.ProcedimientoId
      );
      const medico = await Medico.findByPk(agenda.MedicoId);
      let perMed;
      let especialidad;
      if (medico) {
        perMed = await Persona.findByPk(medico.PersonaId);
        especialidad = await Especialidad.findByPk(medico.EspecialidadId);
      }

      //  console.log(medico);
      if (procedimiento) {
        let info = await transporter.sendMail({
          from: '"Cuyana Medical 👻" <laprueba.correo@gmail.com>', // sender address
          to: persona.email, // list of receivers
          subject: "Reserva de turno en Cuyana Medical", // Subject line
          text: `Se ha realizado la reserva del turno`, // plain text body
          html: `<p>Se ha realizado la reserva del turno numero: <b>${
            turno.id
          }</b>, para la fecha: <b>${moment(calendar.fecha).format(
            "DD/MM/YYYY"
          )}</b>, hora: <b>${turno.hora_turno}</b>.  Procedimiento: <b>${
            procedimiento.nombre
          }</b>. Indicaciones para procedimiento: <b>${
            procedimiento.indicaciones
          }</b>.  </br>Clinica: <b>${clinica.nombre}</b>. Direccion: <b>${
            clinica.direccion
          }</b>.</p>`, // html body
        });
      } else {
        let info = await transporter.sendMail({
          from: '"Cuyana Medical 👻" <laprueba.correo@gmail.com>', // sender address
          to: persona.email, // list of receivers
          subject: "Reserva de turno en Cuyana Medical", // Subject line
          text: `Usted ha realizado la reserva del turno`, // plain text body
          html: `<p>Se ha realizado la reserva del turno numero :<b>${
            turno.id
          }</b>, para la fecha: <b>${moment(calendar.fecha).format(
            "DD/MM/YYYY"
          )}</b>, hora: <b>${turno.hora_turno}</b>.  Medico: <b>${
            perMed.nombre
          } ${perMed.apellido}</b>, Especialidad: <b>${
            especialidad.nombre
          }</b>  Matricula: <b>${medico.matricula}</b>. </br>Clinica: <b>${
            clinica.nombre
          }</b>. Direccion: <b>${clinica.direccion}</b>.</p>`, // html body
        });
      }
    } catch (error) {
      console.log(error);
    }
  }
  await persona.save();
  await turno.save();
  res.send("se modifico turno");
};

exports.buscarTurno = async function (req, res) {
  console.log(req.body);

  //determino la fecha actual para depues filtrar los calendarios con fecha>=hoy
  let today = new Date();
  let dd = today.getDate();
  let mm = today.getMonth() + 1;
  let yyyy = today.getFullYear();
  if (dd < 10) {
    dd = "0" + dd;
  }
  if (mm < 10) {
    mm = "0" + mm;
  }
  today = yyyy + "-" + mm + "-" + dd;
  console.log(today);
  if (req.body.radioBtn === "clinica") {
    try {
      let clinica = await Clinica.findByPk(req.body.clinica);
      console.log(clinica);

      //PARA PROCEDIMIENTO
      if (req.body.procedimiento) {
        let procedimiento = await Procedimiento.findByPk(
          req.body.procedimiento
        );
        console.log(procedimiento);
        let agendas = await Agenda.findAll({
          where: {
            clinicaId: req.body.clinica,
            procedimientoId: req.body.procedimiento,
          },
          // include: [{ model: Procedimiento }, { model: Clinica }],
        });
        // console.log(agendas);
        // console.log(agenda[0].Procedimiento);
        let agendaIds = [];
        agendas.forEach((a) => {
          agendaIds.push(a.id);
        });
        console.log(agendaIds);
        let calendarios = await Calendario.findAll({
          where: {
            agendaId: { [Op.in]: agendaIds },
            fecha: { [Op.gte]: today },
          },
        });
        // console.log(calendarios);
        // console.log("*********************************");
        // console.log(calendarios[0].Agenda.Clinica);
        let calendarIds = [];
        calendarios.forEach((cal) => {
          calendarIds.push(cal.id);
        });
        let turnos = await Turno.findAll({
          where: {
            calendarioId: { [Op.in]: calendarIds },
            EstadoTurnoId: 1,
          },
          include: [
            { model: EstadoTurno },
            {
              model: Calendario,
              include: {
                model: Agenda,
                include: [
                  { model: Medico, include: [Especialidad, Persona] },
                  { model: Procedimiento },
                  { model: Clinica },
                ],
              },
            },
          ],
        });
        let cantTur = turnos.lenght;
        if (!cantTur);
        console.log(cantTur);
        console.log(
          "****************turnos procedimiento*********************"
        );

        res.render("turno/pacienteBuscarTurnos", {
          pretty: true,
          turnos: turnos,
          persona: req.persona,
          user: req.user,
          // calendarios: calendarios,
          // clinica: clinica,
          // agenda: agendas,
          procedimiento: procedimiento,
        });
      }
      //PARA MEDICO
      if (req.body.medico) {
        // let medico = await Medico.findByPk(req.body.medico);
        let medico = await Medico.findAll({
          where: { id: req.body.medico },
          include: [{ model: Persona }, { model: Especialidad }],
        });
        console.log(medico);
        let agenda = await Agenda.findAll({
          where: {
            clinicaId: req.body.clinica,
            medicoId: req.body.medico,
          },
          include: [{ model: Medico }],
        });
        // console.log(agenda[0].Procedimiento);
        let agendaIds = [];
        agenda.forEach((a) => {
          agendaIds.push(a.id);
        });
        console.log(agendaIds);
        let calendarios = await Calendario.findAll({
          where: {
            agendaId: { [Op.in]: agendaIds },
            fecha: { [Op.gte]: today },
          },
        });
        console.log(calendarios);
        let calendarIds = [];
        calendarios.forEach((cal) => {
          calendarIds.push(cal.id);
        });
        // let turnos = await Turno.findAll({
        //   where: {
        //     calendarioId: { [Op.in]: calendarIds },
        //     EstadoTurnoId: 1,
        //   },
        //   include: [{ model: EstadoTurno }],
        // });
        let turnos = await Turno.findAll({
          where: {
            calendarioId: { [Op.in]: calendarIds },
            EstadoTurnoId: 1,
          },
          include: [
            { model: EstadoTurno },
            {
              model: Calendario,
              include: {
                model: Agenda,
                include: [
                  { model: Medico, include: [Especialidad, Persona] },
                  { model: Procedimiento },
                  { model: Clinica },
                ],
              },
            },
          ],
        });

        console.log("****************turnos*********************");
        console.log(turnos);
        res.render("turno/pacienteBuscarTurnos", {
          pretty: true,
          turnos: turnos,
          persona: req.persona,
          user: req.user,
          calendarios: calendarios,
          clinica: clinica,
          agenda: agenda,
          medico: medico,
        });
      }
    } catch (error) {
      console.log(error);
    }
  }
  //PARA ESPECIALIDAD
  if (req.body.radioBtn === "especialidad") {
    try {
      console.log(req.body);
      let medico = await Medico.findAll({
        where: { id: req.body.medico },
        include: [{ model: Persona }, { model: Especialidad }],
      });
      console.log(medico);
      let agendas = await Agenda.findAll({
        where: {
          // clinicaId: req.body.clinica,
          medicoId: req.body.medico,
        },
        include: [{ model: Medico }, { model: Clinica }],
      });
      // console.log(agendas);
      // console.log(agenda[0].Procedimiento);
      let agendaIds = [];
      agendas.forEach((a) => {
        agendaIds.push(a.id);
      });
      console.log(agendaIds);
      let calendarios = await Calendario.findAll({
        where: {
          agendaId: { [Op.in]: agendaIds },
          fecha: { [Op.gte]: today },
        },
        include: {
          model: Agenda,
          include: [
            { model: Medico, include: [Especialidad, Persona] },
            { model: Procedimiento },
            { model: Clinica },
          ],
        },
      });
      // console.log(calendarios);
      console.log("*********************************");
      // console.log(calendarios[0].Agenda.Clinica);
      let calendarIds = [];
      calendarios.forEach((cal) => {
        calendarIds.push(cal.id);
      });

      let turnos = await Turno.findAll({
        where: {
          calendarioId: { [Op.in]: calendarIds },
          EstadoTurnoId: 1,
        },
        include: [
          { model: EstadoTurno },
          {
            model: Calendario,
            include: {
              model: Agenda,
              include: [
                { model: Medico, include: [Especialidad, Persona] },
                { model: Procedimiento },
                { model: Clinica },
              ],
            },
          },
        ],
      });

      res.render("turno/pacienteBuscarTurnos", {
        pretty: true,
        turnos: turnos,
        persona: req.persona,
        user: req.user,
        calendarios: calendarios,
        // clinica: clinica,
        agenda: agendas,
        medico: medico,
      });
    } catch (error) {
      console.log(error);
    }
  }

  //PARA PROCEDIMIENTO
  if (req.body.radioBtn === "procedimiento") {
    try {
      let procedimiento = await Procedimiento.findByPk(req.body.procedimiento);
      console.log(procedimiento);
      let agendas = await Agenda.findAll({
        where: {
          // clinicaId: req.body.clinica,
          procedimientoId: req.body.procedimiento,
        },
        // include: [{ model: Procedimiento }, { model: Clinica }],
      });
      // console.log(agendas);
      // console.log(agenda[0].Procedimiento);
      let agendaIds = [];
      agendas.forEach((a) => {
        agendaIds.push(a.id);
      });
      console.log(agendaIds);
      let calendarios = await Calendario.findAll({
        where: {
          agendaId: { [Op.in]: agendaIds },
          fecha: { [Op.gte]: today },
        },
      });

      let calendarIds = [];
      calendarios.forEach((cal) => {
        calendarIds.push(cal.id);
      });
      let turnos = await Turno.findAll({
        where: {
          calendarioId: { [Op.in]: calendarIds },
          EstadoTurnoId: 1,
        },
        include: [
          { model: EstadoTurno },
          {
            model: Calendario,
            include: {
              model: Agenda,
              include: [
                { model: Medico, include: [Especialidad, Persona] },
                { model: Procedimiento },
                { model: Clinica },
              ],
            },
          },
        ],
      });

      res.render("turno/pacienteBuscarTurnos", {
        pretty: true,
        turnos: turnos,
        persona: req.persona,
        user: req.user,
        // calendarios: calendarios,
        // clinica: clinica,
        // agenda: agendas,
        procedimiento: procedimiento,
      });
    } catch (error) {
      console.log(error);
    }
  }
};

exports.verTurno = async function (req, res) {
  console.log(req.query);
  try {
    let turno = await Turno.findByPk(req.query.id);
    let calendario = await Calendario.findByPk(turno.CalendarioId);
    let agenda = await Agenda.findByPk(calendario.AgendaId);
    let procedimiento = await Procedimiento.findByPk(agenda.ProcedimientoId);
    let clinica = await Clinica.findByPk(agenda.ClinicaId);
    let perTur = await Persona.findByPk(req.query.perTurId);
    res.render("turno/pacienteVerTurno", {
      pretty: true,
      turno: turno,
      persona: req.persona,
      user: req.user,
      calendario: calendario,
      clinica: clinica,
      agenda: agenda,
      procedimiento: procedimiento,
      perTur: perTur,
    });
  } catch (error) {
    console.log(error);
  }
};

exports.confirmarTurno = async function (req, res) {
  console.log(req.params);
  try {
    if (req.user.RoleId == 3) {
      let turno = await Turno.findByPk(req.params.idTurno);
      let calendario = await Calendario.findByPk(turno.CalendarioId);
      let agenda = await Agenda.findByPk(calendario.AgendaId);
      let procedimiento = await Procedimiento.findByPk(agenda.ProcedimientoId);
      let clinica = await Clinica.findByPk(agenda.ClinicaId);
      res.render("turno/pacienteConfirmarTurno", {
        pretty: true,
        turno: turno,
        persona: req.persona,
        user: req.user,
        calendario: calendario,
        clinica: clinica,
        agenda: agenda,
        procedimiento: procedimiento,
      });
    }
    if (req.user.RoleId == 2) {
      let turno = await Turno.findByPk(req.params.idTurno);
      let calendario = await Calendario.findByPk(turno.CalendarioId);
      let agenda = await Agenda.findByPk(calendario.AgendaId);
      let procedimiento = await Procedimiento.findByPk(agenda.ProcedimientoId);
      let clinica = await Clinica.findByPk(agenda.ClinicaId);
      res.render("turno/secretarioConfirmarTurno", {
        pretty: true,
        turno: turno,
        persona: req.persona,
        user: req.user,
        calendario: calendario,
        clinica: clinica,
        agenda: agenda,
        procedimiento: procedimiento,
      });
    }
  } catch (error) {
    console.log(error);
  }
};
