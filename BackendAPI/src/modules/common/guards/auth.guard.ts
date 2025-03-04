import { ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    constructor() {
        super();
    }

    canActivate(context: ExecutionContext) {

        const canActivate = super.canActivate(context) // se ejecuta el authGuard('jwt')

        if (!canActivate) return false


        const request = context.switchToHttp().getRequest()
        const user = request.user;

        if (!user || !user.isActive) throw new ForbiddenException("Tu cuenta está inactiva o no existe. Contacta al soporte.")

        return true;
    }
}