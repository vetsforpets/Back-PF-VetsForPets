import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Observable } from "rxjs";
import { Role } from "../enums/roles.enum";


@Injectable()
export class RolesGuard implements CanActivate {

    constructor(private reflector: Reflector) { }

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {

        const requiredRoles = this.reflector.getAllAndOverride<Role[]>('roles', [context.getHandler(), context.getClass()])

        if (!requiredRoles || requiredRoles.length === 0) return true

        const request = context.switchToHttp().getRequest()
        const user = request.user

        const isValid = user?.role && requiredRoles.includes(user.role);

        if (!isValid) throw new ForbiddenException("No tienes autorización para acceder a esta ruta.")

        return isValid;
    }
}