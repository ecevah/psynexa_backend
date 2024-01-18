const { json } = require("express");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

require('dotenv').config();

const noTokenController = {
    mail: async(req, res) => {
        try{
            const key = Math.floor(Math.random() * 8999) + 1000;
            const date = Date(Date.now());
            let keyHash = await bcrypt.hash(key.toString(), 8);
            let transport = nodemailer.createTransport({
                service: 'hotmail',
                auth:{
                    user: 'LogosApp@outlook.com',
                    pass: process.env.MAIL_PASS
                }
            })

            let mailOptions = {
                from: 'LogosApp@outlook.com',
                to: req.query.email,
                subject: 'Şifre Sıfırlama Kodunuz',
                text: `Date/Tarih: ${date} \nMesage/Mesaj: ${key}`
            }

            transport.sendMail(mailOptions, (err,data) => {
                if(err){
                    res.json({
                        status: false,
                        message: "Mail Not Send",
                        err
                    })
                }else{
                    res.json({
                        status: true,
                        message: "Mail Send Complated",
                        keyHash
                    })
                }
            })
        }catch(err){
            res.json({
                status: false,
                message: "Mail Not Send",
                err
            })
        }
    }
}

module.exports = noTokenController;