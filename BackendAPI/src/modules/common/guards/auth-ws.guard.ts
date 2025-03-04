import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Observable } from "rxjs";

@Injectable()
export class WsAuthGuard implements CanActivate {

    constructor(private readonly jwt: JwtService) { }

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const client = context.switchToWs().getClient()
        const token = client.handshake.auth.token || client.handshake.query.token || client.handshake.headers['authorization'];

        console.log("TOKEN:", token)
        if (!token) throw new ForbiddenException("Token inválido o no proporcionado.")

        try {
            const payload = this.jwt.verify(token);

            client.data.user = payload
            console.log("User en client.data", client.data)

            return true
        } catch (error) {
            throw new ForbiddenException("Token inválido")
        }

    }
}