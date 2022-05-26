import nodemailer from "nodemailer";
import smtpTransport from "nodemailer-smtp-transport";
import { prepareOtpTemplate } from "./../email_templates/otp_template.js";
import { prepareForgotPasswordTemplate } from "./../email_templates/forgot_password.js";
import { prepareInviteEmailTemplate } from "./../email_templates/invite_template.js";
let sendEmail = (email, subject, password) => {
  let transporter = nodemailer.createTransport(
    smtpTransport({
      service: 'Gmail',
      host: process.env.MAIL_HOST,
      port: process.env.MAIL_PORT,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    })
  );

  let mailOptions = {
    from: process.env.MAIL_USER,
    to: email,
    subject: subject,
    html: prepareOtpTemplate(password),
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) console.log(error);
    console.log(info);
  });
};

let sendForgotPasswordEmail = (email, subject, code) => {
  let transporter = nodemailer.createTransport(
    smtpTransport({
      host: process.env.MAIL_HOST,
      port: process.env.MAIL_PORT,
      service: 'Gmail',
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    })
  );
  let mailOptions = {
    from: process.env.MAIL_USER,
    to: email,
    subject: subject,
    html: prepareForgotPasswordTemplate(code),
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) console.log(error);
    console.log(info);
  });
};

let sendInviteEmail = (email, subject) => {
  let transporter = nodemailer.createTransport(
    smtpTransport({
      host: process.env.MAIL_HOST,
      port: process.env.MAIL_PORT,
      service: 'Gmail',
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    })
  );
  let mailOptions = {
    from: process.env.MAIL_USER,
    to: email,
    subject: subject,
    html: prepareInviteEmailTemplate(),
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) console.log(error);
    console.log(info);
  });
};

export { sendForgotPasswordEmail, sendEmail, sendInviteEmail };
