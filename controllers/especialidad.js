const Especialidad = require("../models").Especialidad;

exports.allEspecialidades = async function (req, res) {
  const especialidades = await Especialidad.findAll();
  res.send(especialidades);
};

exports.verEspecialidades = async function (req, res) {
  try {
    if (req.user[0]) {
      console.log("dentro de if undefinied :    *****" + req.user[0]);
      req.user = req.user[0];
    }
    const especialidades = await Especialidad.findAll();
    // { where: { userId: req.user.id } });
    res.render("especialidad/listaEspecialidad", {
      pretty: true,
      title: "Cuyana medical -- Especialidades",
      especialidades: especialidades,
      user: req.user,
      persona: req.persona,
    });
  } catch (error) {
    res.status(error);
  }
};

// exports.espID = async function (req, res) {
//   const esp = await Especialidad.findByPk(req.params.id);
//   res.render("especialidad", {
//     pretty: true,
//     esp: esp,
//     role: req.user.RoleId,
//     persona: req.user.Persona,
//   });
// };

exports.insertar = async function (req, res) {
  if (req.user.RoleId == 1) {
    await Especialidad.create({
      nombre: req.body.nombre,
      detalles: req.body.detalles,
    });
    res.redirect("/medico/agregarMedico");
  } else {
    res.redirect("/");
  }
};

exports.insertarEspecialidad = async function (req, res) {
  if (req.user.RoleId == 1) {
    await Especialidad.create({
      nombre: req.body.nombre,
      detalles: req.body.detalles,
    });
    res.redirect("/especialidad");
  } else {
    res.redirect("/");
  }
};
exports.agregarEspecialidad = function (req, res) {
  console.log("Entro en  agregar especialidad ");
  try {
    if (req.user[0]) {
      console.log("dentro de if undefinied :    *****" + req.user[0]);
      req.user = req.user[0];
    }
    console.log(req.user);
    res.render("especialidad/formEspecialidad", {
      title: "Cuyana medical -- Agregar especialidad",
      form: true,
      pretty: true,
      user: req.user,
      persona: req.persona,
    });
    res.end();
  } catch (error) {
    console.log(error);
    res.status(error);
  }
};

exports.updateEspecialidad = async function (req, res) {
  let especialidad = await Especialidad.findByPk(req.body.id);
  especialidad.nombre = req.body.nombre;
  especialidad.detalles = req.body.detalles;

  await especialidad.save();
  res.redirect(301, req.get("referer"));
};

exports.deleteEspecialidad = async function (req, res) {
  try {
    console.log("***********************************");
    let especialidad = await Especialidad.findByPk(req.body.id);
    console.log(req.body.id);
    let medicos = await especialidad.getMedicos();
    // console.log(req.user);
    if (medicos.length == 0) {
      console.log("entro aca especialidad delete");
      await especialidad.destroy();
    } else {
      console.log(
        "No se puede borrar la especialidad porque tiene medicos asociados. Por favor verificar"
      );
      res.render("especialidad/listaEspecialidad", {
        pretty: true,
        alert: true,
        alertTitle: "Error",
        alertMessage:
          "No se puede borrar la especialidad porque tiene medicos asociados. Por favor verificar",
        alertIcon: "warning",
        showConfirmButton: true,
        timer: 5000,
        ruta: "especialidad",
        user: req.user,
        persona: req.persona,
      });
    }
    res.redirect(301, "/especialidad"); //
  } catch (error) {
    console.log(error);
    res.status(error);
  }
};
