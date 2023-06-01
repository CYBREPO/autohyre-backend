
const Mailgen = require('mailgen');
const nodemailer = require('nodemailer');

exports.email = async (data) => {
    try{
        let transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL,
                pass: process.env.EMAILPASS,
            },
        });
        console.log(data.mails);
        console.log(data._doc);
    
    
        var mailGenerator = new Mailgen({
            theme: 'default',
            product: {
                // Appears in header & footer of e-mails
                name: 'AutoHyre',
                link: process.env.AUTOHYRELINK
                // Optional product logo
                // logo: 'https://mailgen.js/img/logo.png'
            }
        });
        var email = {
            body: {
                name: 'User',
                intro: '',
                table: {
                    data: [{
                        name: "dummy",
                        email: "dummy",
                        make: data._doc.make,
                        model: data._doc.model,
                        type: data._doc.type,
                        year: data._doc.year,
    
                    }]
                },
                outro: ''
            }
        };
    console.log(data.mails);
        var emailBody = mailGenerator.generate(email);
        var mailOptions = {
            from: process.env.EMAIL, // sender address
            to: data.mails, // list of receivers
            subject: "Autohyre", // Subject line
            html: emailBody, // html body
        };
    
        return await transporter.sendMail(mailOptions);
    }
    catch(ex){
        console.log(ex)
        return ex;
    }
    
}

