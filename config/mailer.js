const nodemailer = require("nodemailer");
// create reusable transporter object using the default SMTP transport
exports.transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // true for 465, false for other ports
  auth: {
    user: "laprueba.correo@gmail.com", // generated ethereal user
    pass: "uhuhwidgrpacxlno", // generated ethereal password
  },
});

// transporter.verify().then(() => {
//   console.log("Listo para enviar mail");
// });
