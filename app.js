var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const dotenv = require("dotenv");
var passport = require("passport");
var methodOverride = require("method-override");
const Usuario = require("./models").Usuario;

var indexRouter = require("./routes/index");

var authRouter = require("./routes/auth");
var clinicaRouter = require("./routes/clinica");
var procedimientoRouter = require("./routes/procedimiento");
var medicoRouter = require("./routes/medico");
var especialidadRouter = require("./routes/especialidad");
var personaRouter = require("./routes/persona");
var agendaRouter = require("./routes/agenda");
var turnoRouter = require("./routes/turno");
var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");
//instalar moment para manejar fechas=  npm install moment
app.locals.moment = require("moment");

//middlewares
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

//PASSPORT GITHUB
app.use(
  require("express-session")({
    secret: "keyboard cat",
    resave: true,
    saveUninitialized: true,
  })
);

var GitHubStrategy = require("passport-github2").Strategy;

passport.use(
  new GitHubStrategy(
    {
      clientID: "99f4e15ff235b161be4a",
      clientSecret: "62009b0763198389f3bf629c978badd43aa7b3ba",
      callbackURL: "http://localhost:3000/auth/github/callback",
    },
    function (accessToken, refreshToken, profile, cb) {
      console.log("aca profile " + profile);
      Usuario.findOrCreate({
        where: {
          usuario: profile.emails[0].value,
          // nombre: profile.displayName,
        },
      }).then((user, creado) => {
        return cb(null, user);
      });
    }
  )
);

passport.serializeUser(function (user, done) {
  done(null, user);
});
passport.deserializeUser(function (user, done) {
  done(null, user);
});

app.use(passport.initialize());
app.use(passport.session());
//para sobreescribir metodo y poder aceptar put y delete
//https://github.com/expressjs/method-override
app.use(methodOverride("_method"));

//Para eliminar la cache
app.use(function (req, res, next) {
  console.log("ELIMINA CACHE");
  if (!req.user)
    res.header("Cache-Control", "private, no-cache, no-store, must-revalidate");
  next();
});
//seteamos las variables de entorno
dotenv.config({ path: "./env/.env" });

//llamar al router
app.use("/", indexRouter);
// app.use("/users", usersRouter);
app.use("/clinica", clinicaRouter);
app.use("/procedimiento", procedimientoRouter);
app.use("/medico", medicoRouter);
app.use("/especialidad", especialidadRouter);
app.use("/persona", personaRouter);
app.use("/agenda", agendaRouter);
app.use("/turno", turnoRouter);
//abajo para github
app.use("/auth", authRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
