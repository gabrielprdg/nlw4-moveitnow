import nodemailer, { Transporter } from 'nodemailer'
import {resolve} from 'path'
import handlebars from 'handlebars'
import fs from 'fs'

class SendMailService {
    private client: Transporter
    constructor(){
        nodemailer.createTestAccount().then((account) => {
            const transporter = nodemailer.createTransport({
                host: account.smtp.host,
                port: account.smtp.port,
                secure: account.smtp.secure,
                auth: {
                    user: account.user,
                    pass: account.pass
                },
            })
            this.client = transporter
        }).catch(err => { 
            console.log(err)
        })
    }

    async execute(to: string, subject: string, variables: Object, path: string){
        // Reading file 
        const templateFileContent = fs.readFileSync(path).toString('utf-8')
        // Compiling the template
        const mailTemplateParser = handlebars.compile(templateFileContent)
        // Making the parse of the variables
        const html = mailTemplateParser(variables)

        try{
            const message = await this.client.sendMail({
                to,
                subject,
                html,
                from: 'NPS <noreplay@nps.com.br>',
            })
            console.log('Message sent: %s', message.messageId);
            // Preview only available when sending through an Ethereal account
            console.log('Preview URL: %s', nodemailer.getTestMessageUrl(message));
        }catch(err){
            console.log(err)
        }
      
    }
}

export default new SendMailService()