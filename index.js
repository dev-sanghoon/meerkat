const pm2 = require("pm2");
const dotenv = require("dotenv");
const mailer = require("nodemailer");

dotenv.config();

pm2.connect(() => {
  pm2.launchBus((err, bus) => {
    bus.on("process:event", (packet) => {
      if (packet.process.status === "stopped") {
        console.log("Server stopped!");
        mailer
          .createTransport({
            service: "gmail",
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            auth: {
              user: process.env.MAILER_EMAIL,
              pass: process.env.MAILER_PASSWORD,
            },
          })
          .sendMail({
            from: `"Habitier" <${process.env.MAILER_EMAIL}>`,
            to: process.env.LOG_RECEIVER,
            subject: "Habitier server stopped",
            html: `<p>${JSON.stringify(packet)}</p>`,
          });
      }
    });
  });
});
