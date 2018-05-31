'use strict';

const nodemailer = require('nodemailer'),
    fs           = require('fs');

class Email {

    constructor(options, data = {}){

        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'danieljtorres94@gmail.com',
                pass: ''
            }               
        });
        this.message = options;
        this.message.from = "'' <contacto@o.com>";
        this.data = data;
    }

    setHtml(template) {
        this.template = fs.readFileSync('../../resources/mails'+template ,'utf8', (err) => {
            if (err) throw err;
        });

        this.message.html = this.template;

        var keys = Object.keys(this.data);

        for(var key in keys){
            while(this.message.html.indexOf("${"+keys[key]+"}") != -1){
                this.message.html = this.message.html.replace("${"+keys[key]+"}", this.data[keys[key]]);
            }
        }

        return this;
    } 

    setAttachs(attachs) {
        this.message.attachments = attachs;
        return this;
    }

    send(cb){
        this.transporter.sendMail(this.message, (err,info) => {
            if(err) return cb(err, null);
            return cb(null, info);
        });
    }
}

module.exports = Email;