const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
// const conexion = require("../database/db");
const { promisify } = require("util");

const User = require("../models").User;
const Persona = require("../models").Persona;
const Usuario = require("../models").Usuario;

//procedimiento para registrarnos
exports.register = async function (req, res) {
  try {
    const name = req.body.name;
    const apellido = req.body.apellido;
    const dni = req.body.dni;
    const celular = req.body.celular;
    const domicilio = req.body.domicilio;
    const email = req.body.email;
    const pass = req.body.password;

    // generar salt para hashear el password
    const salt = await bcrypt.genSalt(10);
    // hasheamos el password con salt anexado
    let passHash = await bcrypt.hash(pass, salt);

    // Creando un nuevo usuario
    const user = await Usuario.create({
      usuario: email,
      password: passHash,
    });
    const usuario = await Usuario.findOne({
      where: {
        usuario: email,
      },
    });
    console.log(usuario.id);
    //Creando una nueva persona
    const persona = await Persona.create({
      dni: dni,
      usuarioid: usuario.id,
      nombre: name,
      apellido: apellido,
      email: email,
      celular: celular,
      domicilio: domicilio,
      riesgoso: 0,
    });
    // persona.usuarioid = usuario.id;
    // await persona.save();
    // console.log(passHash);
    // console.log(req.body);

    // user.pass = passHash;
    // await user.save();
    console.log("Registro de uusario guardado OK");
    const id = usuario.id;
    const rol = usuario.rol;
    const token = jwt.sign({ id: id, rol: rol }, process.env.JWT_SECRETO, {
      expiresIn: process.env.JWT_TIEMPO_EXPIRA,
    });
    //generamos el token SIN fecha de expiracion
    //const token = jwt.sign({id: id}, process.env.JWT_SECRETO)
    console.log(
      "TOKEN: " +
        token +
        " para el USUARIO : " +
        usuario.nombre +
        ", rol" +
        usuario.rol
    );

    const cookiesOptions = {
      expires: new Date(
        Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000
      ),
      httpOnly: true,
    };
    res.cookie("jwt", token, cookiesOptions);
    res.render("register", {
      pretty: true,
      alert: true,
      alertTitle: "Registro exitoso",
      alertMessage: "REGISTRO CORRECTO!",
      alertIcon: "success",
      showConfirmButton: false,
      timer: 2500,
      ruta: "",
      user: usuario[0],
      persona: persona,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json("Error: " + error);
  }
};

exports.login = async function (req, res) {
  try {
    console.log("entrto hasta el pricipio de login dentro de try");
    const user = req.body.user;
    const pass = req.body.password;
    const email = req.body.email;
    console.log(email + " " + pass);
    if (!email || !pass) {
      console.log("entrto hasta el pricipio de login dentro de try > if");
      res.render("login", {
        pretty: true,
        alert: true,
        alertTitle: "Advertencia",
        alertMessage: "Ingrese un usuario y password",
        alertIcon: "info",
        showConfirmButton: true,
        timer: false,
        ruta: "login",
      });
    } else {
      console.log("linea 59");
      const user = await Usuario.findAll({ where: { usuario: email } });
      // console.log(user[0].email);
      console.log("linea 62,  usuario:  ", user);

      if (!user[0] || !(await bcrypt.compare(pass, user[0].password))) {
        console.log("inicio de sesión mal");
        res.render("login", {
          pretty: true,
          alert: true,
          alertTitle: "Error",
          alertMessage: "Usuario y/o Password incorrectas",
          alertIcon: "error",
          showConfirmButton: true,
          timer: 2500,
          ruta: "login",
        });
      } else {
        //inicio de sesión OK
        console.log("inicio de sesión OK");
        const id = user[0].id;
        const rol = user[0].rol;
        const token = jwt.sign({ id: id, rol: rol }, process.env.JWT_SECRETO, {
          expiresIn: process.env.JWT_TIEMPO_EXPIRA,
        });
        //generamos el token SIN fecha de expiracion
        //const token = jwt.sign({id: id}, process.env.JWT_SECRETO)
        console.log(
          "TOKEN: " +
            token +
            " para el USUARIO : " +
            user[0].nombre +
            ", rol" +
            user[0].rol
        );

        const cookiesOptions = {
          expires: new Date(
            Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000
          ),
          httpOnly: true,
        };

        let persona = await Persona.findOne({
          where: {
            usuarioid: user[0].id,
          },
        });
        console.log("Persona", persona);

        res.cookie("jwt", token, cookiesOptions);
        res.render("login", {
          pretty: true,
          alert: true,
          alertTitle: "Conexión exitosa",
          alertMessage: "¡LOGIN CORRECTO!",
          alertIcon: "success",
          showConfirmButton: false,
          timer: 2500,
          ruta: "",
          user: user[0],
          persona: persona[0],
        });
      }
      //   }
      // );
    }
  } catch (error) {
    console.log("catch error: " + error);
  }
};

exports.isAuthenticated = async (req, res, next) => {
  if (req.cookies.jwt) {
    try {
      console.log("Estamos aca isAuthenticated  dentro del try");
      const decodificada = await promisify(jwt.verify)(
        req.cookies.jwt,
        process.env.JWT_SECRETO
      );
      console.log(decodificada);
      let user = await Usuario.findByPk(decodificada.id);
      let persona = await Persona.findOne({
        where: {
          usuarioid: user.id,
        },
      });
      console.log("********************Persona =", persona);

      // ({ where: { id: decodificada.id } });
      console.log(user);
      if (!user) {
        return next();
      }
      req.user = user;
      req.persona = persona;
      // console.log(req.user);
      return next();
    } catch (error) {
      console.log(error);
      // return next();
      res.redirect("/login");
    }
  } else if (req.user) {
    console.log("dentro de else if authecticated  " + req.user);
    return next();
  } else {
    console.log("en el else del isAuthenticated login ");
    res.redirect("/login");
    // return next()
  }
};

exports.isAuthorizated = (roles) => async (req, res, next) => {
  console.log(req.cookies);
  console.log(Object.keys(req.cookies).includes("connect.sid"));
  if (req.cookies.jwt) {
    try {
      console.log("Estamos aca iautorizacion  dentro del try");
      const decodificada = await promisify(jwt.verify)(
        req.cookies.jwt,
        process.env.JWT_SECRETO
      );
      console.log(decodificada);
      let user = await Usuario.findByPk(decodificada.id);

      console.log(user.RoleId);

      if (!user) {
        console.log("dentro de if !user autorizacion");
        return next();
      }

      if ([].concat(roles).includes(user.RoleId)) {
        console.log(
          "****** dentro de  if ([].concat(roles).includes(user.RoleId))"
        );
        next();
      } else {
        res.render("401", { user: req.user });
        // res.status(401);
        // res.send({ error: "NO TIENE PERMISOS PARA VER EL RECURSO" });
      }

      // req.user = user;
      // console.log(req.user);
      // return next();
    } catch (error) {
      console.log(error);
      return next();
    }
  } else if (Object.keys(req.cookies).includes("connect.sid")) {
    try {
      console.log("roooooooooooolllllllllll " + req.user[0].roleId);
      // if (req.user[0].roleId === "Admin") next();
      // else {
      //   res.render("401", { user: req.user[0] });
      // }
      if ([].concat(roles).includes(user.RoleId)) {
        next();
      } else {
        res.render("401", { user: req.user });
        // res.status(401);
        // res.send({ error: "NO TIENE PERMISOS PARA VER EL RECURSO" });
      }
    } catch (error) {
      console.log(error);
      return next();
    }
  } else {
    res.redirect("/login");
  }
};

exports.logout = (req, res, next) => {
  res.clearCookie("jwt");

  //para github
  req.session.destroy();
  req.logout();
  return res.redirect("/");
};
