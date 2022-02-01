const  nodemailer = require('nodemailer');
require('dotenv').config();
const fs = require('fs');
const smtpTransport = require('nodemailer-smtp-transport');
const handlebars = require('handlebars')
const path = require('path');



const readHTML = function(path, callback){
    fs.readFile(path, {encoding: 'utf-8'}, function(err, html){
        if(err){
            callback(err);
            throw err;
        }
        else{
            callback(null, html);
        }
    });
};


const sendEmail = async(email,subject, name, verifcationLink) =>{
    try{
        if(process.env.STATE === "DEV"){

            const testAccocunt = await nodemailer.createTestAccount();


            const transporter = nodemailer.createTransport(smtpTransport({
                host: process.env.HOST,
                service: process.env.SERVICE,
                port: 587,
                auth:{
                    user: testAccocunt.user,
                    pass: testAccocunt.pass
                },
            }));
            
            let template = "../template/registration-email.html"

            const RegistrationTemplate =path.join(__dirname, template);
        
            
            readHTML(RegistrationTemplate, async function(err, html){

                
                const template_ = handlebars.compile(html);
                const replacement= {
                    username: name,
                    link: verifcationLink
                }
                const htmlToSend= template_(replacement);
                const sender = await transporter.sendMail({
                    from: process.env.DEFAULT_EMAIL,
                    to:email,
                    subject:subject,
                    html: htmlToSend
                });
                console.log("email sent sucessfully");
                
                console.log(`preview URL: ${nodemailer.getTestMessageUrl(sender)}`)                
            })



            


        }else if (process.env.STATE == "PRODUCTION"){
            const transporter = nodemailer.createTransport({
                host: process.env.HOST,
                service: process.env.SERVICE,
                port: 587,
                auth:{
                    user: process.env.USER,
                    pass: process.env.PASS
                },            
            });
            const sender = await transporter.sendMail({
                from: process.env.DEFAULT_EMAIL,
                to:email,
                subject:subject,
                text:text
            });
            console.log("email sent sucessfully");


        }
        
       
        }catch(error){
            console.log('Email not sent');
            console.log(error);

    }
}



module.exports ={
    sendEmail,
}