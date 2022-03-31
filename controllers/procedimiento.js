const Procedimiento = require("../models").Procedimiento;

exports.verProcedimiento = async function (req, res) {
  if (req.user[0]) {
    console.log("dentro de if undefinied :    *****" + req.user[0]);
    req.user = req.user[0];
  }
  let procedimientos = await Procedimiento.findAll();
  // { where: { userId: req.user.id } });
  res.render("procedimiento/listaProcedimiento", {
    pretty: true,
    title: "Cuyana medical -- Procedimientos",
    procedimientos: procedimientos,
    user: req.user,
    persona: req.persona,
  });
};

//ENVIAR EL USER A CADA VISTA PARA INSERTAR EL USUARIO EN CADA LISTA
exports.agregarProcedimiento = function (req, res) {
  console.log("Entro en  agregar procedimiento ");
  if (req.user[0]) {
    console.log("dentro de if undefinied :    *****" + req.user[0]);
    req.user = req.user[0];
  }
  console.log(req.user);
  res.render("procedimiento/formProcedimiento", {
    title: "Agregar procedimiento",
    form: true,
    pretty: true,
    user: req.user,
    persona: req.persona,
  });
  res.end();
};

exports.createProcedimiento = async function (req, res) {
  try {
    await Procedimiento.create({
      nombre: req.body.nombre,
      descripcion: req.body.descripcion,
      indicaciones: req.body.indicaciones,
    });
    res.redirect(301, "/procedimiento/");
  } catch (error) {
    console.log(error);
    res.render("procedimiento/formProcedimiento", {
      pretty: true,
      alert: true,
      alertTitle: "Error",
      alertMessage:
        "No se puede insertar el procedimiento porque ya existe uno con el mismo nombre guardado. Por favor verificar",
      alertIcon: "warning",
      showConfirmButton: true,
      timer: 5000,
      ruta: "procedimiento/agregarProcedimiento",
      user: req.user,
      persona: req.persona,
    });
  }
};

exports.updateProcedimiento = async function (req, res) {
  let procedimiento = await Procedimiento.findByPk(req.body.id);
  procedimiento.nombre = req.body.nombre;
  procedimiento.descripcion = req.body.descripcion;
  procedimiento.indicaciones = req.body.indicaciones;
  await procedimiento.save();
  res.redirect(301, req.get("referer"));
};

exports.deleteProcedimiento = async function (req, res) {
  console.log("***********************************");
  let procedimiento = await Procedimiento.findByPk(req.body.id);
  console.log(req.body.id);
  let agendas = await procedimiento.getAgendas();
  // console.log(req.user);
  if (agendas.length == 0) {
    console.log("entro aca agendas delete");
    await procedimiento.destroy();
  } else {
    console.log(
      "No se puede borrar el procedimiento porque tiene agendas asociadas"
    );
    res.render("procedimiento/listaProcedimiento", {
      pretty: true,
      alert: true,
      alertTitle: "Error",
      alertMessage:
        "No se puede borrar el procedimiento porque tiene agendas asociadas. Por favor verificar",
      alertIcon: "warning",
      showConfirmButton: true,
      timer: 5000,
      ruta: "procedimiento",
      user: req.user,
      persona: req.persona,
    });
  }
  res.redirect(301, "/procedimiento"); //
  //res.redirect(301, req.get("referer")); //parentesis del resredirect que
};

exports.procedimientoID = async function (req, res) {
  console.log(req.body);
  const pro = await Procedimiento.findByPk(req.params.id);
  res.render("procedimiento", {
    pretty: true,
    pro: pro,
    role: req.user.RoleId,
    user: req.user,
    persona: req.persona,
  });
};

exports.insertar = async function (req, res) {
  if (req.user.RoleId == 1) {
    await Procedimiento.create({
      nombre: req.body.nombre,
      descripcion: req.body.descripcion,
      indicaciones: req.body.indicaciones,
    });
    res.redirect("/agenda/crearAgenda");
  } else {
    res.redirect("/");
  }
};

exports.proTodas = async function (req, res) {
  const pros = await Procedimiento.findAll();
  res.send(pros);
};

exports.procedimientoID = async function (req, res) {
  const pro = await Procedimiento.findByPk(req.params.id);
  res.render("procedimiento", {
    pretty: true,
    pro: pro,
    role: req.user.RoleId,
    user: req.user,
    persona: req.persona,
  });
};
