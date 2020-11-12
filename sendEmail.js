const nodemailer = require("nodemailer");
const fs = require('fs')
module.exports = (req) => {
    var template = fs.readFileSync("template.html")

    template = template.toString();
    template = template.replace("_NAME_", req.username)
    template = template.replace("_GMAIL_", req.email)
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: "587",
        secure: false,
        auth: {
            user: 'msqintern1@gmail.com',
            pass: 'msqassociates',
        },
    });
    var mailOptions = {
        from: req.email,
        to: 'msqintern1@gmail.com',
        subject: 'User Recovery',
        text: 'This is just a sample email!',
        html: template,
    }
    
    transporter.sendMail(mailOptions, (err, info) => {
        if(err) {
            console.log(err)
        }else {
            console.log(info.messageId)
            console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info))
        }
    });
}