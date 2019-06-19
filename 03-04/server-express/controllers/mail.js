const nodemailer = require('nodemailer')
const config = require('../config/config.json')

exports.send = ({ name, email, message }) => new Promise(async (resolve, reject) => {
  try {
    if (!name || !email) {
      reject(new Error('Name and Email fields are required'))
      return
    }
    const transporter = nodemailer.createTransport(config.mail.smtp)
    const mailOptions = {
      from: `"${name}" <${email}>`,
      to: config.mail.smtp.auth.user,
      subject: config.mail.subject,
      text:
        message.trim().slice(0, 500) +
        `\n Отправлено с: <${email}>`
    }
    transporter.sendMail(mailOptions, (err, info) => {
      if (!err) {
        resolve({ ...info, message: 'Email sent' })
      } else {
        reject(err)
      }
    })
  } catch (e) {
    reject(e)
  }
})
