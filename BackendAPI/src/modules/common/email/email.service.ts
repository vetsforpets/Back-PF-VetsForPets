import { Injectable } from "@nestjs/common"
import * as nodemailer from 'nodemailer'
import { sendEmailDto } from "./dto/create.email.dto"
import { config as dotenvConfig } from 'dotenv'

dotenvConfig({ path: '.env' }); 


@Injectable()
export class EmailService{
    private transporter

    constructor(){
        this.transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST, 
            port: process.env.EMAIL_PORT, 
            secure: false, 
            auth: {
                user: process.env.EMAIL_USER,    
                pass: process.env.EMAIL_PASSWORD, 
            },
        })
    }

    async sendEmail(emailDto: sendEmailDto) {
        const { recipients, subject, html } = emailDto;
        const transport = this.transporter;

        const options: nodemailer.SendMailOptions = {
            from: process.env.EMAIL_USER,
            to: recipients,
            subject: subject,
            html: html,
        }

        try {
            const result = await transport.sendMail(options)
            console.log('Email enviado con exito', result)
        } catch (error) {
            console.error('Error enviando el email: ', error)
        }
    }
}