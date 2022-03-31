const Clinica = require("../models").Clinica;

exports.verClinicas = async function (req, res) {
  if (req.user[0]) {
    console.log("dentro de if undefinied :    *****" + req.user[0]);
    req.user = req.user[0];
  }
  let clinicas = await Clinica.findAll();
  // { where: { userId: req.user.id } });
  res.render("clinica/listaClinicas", {
    pretty: true,
    title: "Cuyana medical -- Clinicas",
    clinicas: clinicas,
    user: req.user,
    persona: req.persona,
  });
};

//ENVIAR EL USER A CADA VISTA PARA INSERTAR EL USUARIO EN CADA LISTA
exports.agregarClinica = function (req, res) {
  console.log("Entro en  agregarClinica ");
  if (req.user[0]) {
    console.log("dentro de if undefinied :    *****" + req.user[0]);
    req.user = req.user[0];
  }
  console.log(req.user);
  res.render("clinica/formClinica", {
    title: "Agregar clinica",
    form: true,
    pretty: true,
    user: req.user,
    persona: req.persona,
  });
  res.end();
};

exports.createClinica = async function (req, res) {
  await Clinica.create({
    nombre: req.body.nombre,
    direccion: req.body.direccion,
  });
  res.redirect(301, "/clinica/");
};

exports.updateClinica = async function (req, res) {
  let clinica = await Clinica.findByPk(req.body.id);

  clinica.nombre = req.body.nombre;
  clinica.direccion = req.body.direccion;
  await clinica.save();
  res.redirect(301, req.get("referer"));
};

exports.deleteClinica = async function (req, res) {
  console.log("***********************************");
  let clinica = await Clinica.findByPk(req.body.id);
  console.log(req.body.id);
  let agendas = await clinica.getAgendas();
  // console.log(req.user);
  if (agendas.length == 0) {
    console.log("entro aca agendas delete");
    await clinica.destroy();
  } else {
    console.log("No se puede borrar la clinica porque tiene agendas asociadas");
    res.render("clinica/listaClinicas", {
      pretty: true,
      alert: true,
      alertTitle: "Error",
      alertMessage:
        "No se puede borrar la clinica porque tiene agendas asociadas. Por favor verificar",
      alertIcon: "warning",
      showConfirmButton: true,
      timer: 5000,
      ruta: "clinica",
      user: req.user,
    });
  }
  res.redirect(301, "/clinica"); //
  //res.redirect(301, req.get("referer")); //parentesis del resredirect que
};

exports.clincaID = async function (req, res) {
  const clinica = await Clinica.findByPk(req.params.id);
  res.render("clinica", {
    pretty: true,
    clinica: clinica,
    role: req.user.RoleId,
    persona: req.user.Persona,
  });
};

// exports.agregar = function (req, res) {
//   if (req.user.RoleId == 1) {
//     res.render("admin-agregarClinica", {
//       pretty: true,
//       persona: req.user.Persona,
//     });
//   } else {
//     res.redirect("/");
//   }
// };

exports.clinicaTodas = async function (req, res) {
  console.log("entro");
  const clinicas = await Clinica.findAll();
  console.log(clinicas);
};
