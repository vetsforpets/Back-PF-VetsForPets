import { ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { AuthGuard } from "@nestjs/passport";
import { IS_PUBLIC_KEY } from "src/decorators/public-routes/public-routes.decorator";

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    constructor(private readonly reflector: Reflector) {
        super();
    }

    async canActivate(context: ExecutionContext): Promise<boolean> {

        const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);

        if (isPublic) return true;

        const canAct = await super.canActivate(context);
        if (!canAct) return false

        const req = context.switchToHttp().getRequest()

        const user = req.user;

        if (!user) {
            throw new UnauthorizedException("Tu cuenta está inactiva o no existe. Contacta al soporte.")
        }
        if (!user.isActive) {
            throw new ForbiddenException("Tu cuenta se encuentra inactiva.")
        }

        return true;
    }
}