import { Body, Controller, HttpException, HttpStatus, Post } from "@nestjs/common";
import { EmailService } from "./email.service";
import { sendEmailDto } from "./dto/create.email.dto";

@Controller('email')
export class EmailController {
    constructor(
        private readonly emailService: EmailService
    ){}

    @Post('send')
    async sendMail(@Body() emailDto: sendEmailDto){
        try {
            await this.emailService.sendEmail(emailDto)
            return { message: 'Email enviado con exito'}
        } catch (error) {
            console.error('Error enviando el correo: ', error)

            if(error.response) {
                throw new HttpException(error.response.message, error.response.statusCode || HttpStatus.INTERNAL_SERVER_ERROR)
            } else if(error.message.includes('Login invalido')) {
                throw new HttpException("Credenciales del email invalidas", HttpStatus.UNAUTHORIZED)
            }
            else {
                throw new HttpException("Hubo un error al enviar el email", HttpStatus.INTERNAL_SERVER_ERROR)
            }

        }
    }
}