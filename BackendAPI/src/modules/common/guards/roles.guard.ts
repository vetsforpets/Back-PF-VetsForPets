import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Observable } from "rxjs";
import { Role } from "../enums/roles.enum";
import { IS_ADMIN_KEY } from "src/decorators/roles/admin.decorator";
import { IS_PUBLIC_KEY } from "src/decorators/public-routes/public-routes.decorator";


@Injectable()
export class RolesGuard implements CanActivate {

    constructor(private reflector: Reflector) { }

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {

        const requiredRoles = this.reflector.getAllAndOverride<Role[]>('roles', [context.getHandler(), context.getClass()])
        const isAdminRoute = this.reflector.getAllAndOverride<boolean>(IS_ADMIN_KEY, [context.getHandler(), context.getClass()])
        const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);


        if (isPublic) return true

        const { user } = context.switchToHttp().getRequest()

        if (!user) throw new ForbiddenException("No tienes autorización para acceder a esta ruta.")

        if (isAdminRoute && user.isAdmin) return true;


        if (requiredRoles?.length) {

            const hasRole = () => requiredRoles.some((rol) => user?.role?.includes(rol))

            const isValid = user && user.role && hasRole();

            if (!isValid) throw new ForbiddenException("No tienes autorización para acceder a esta ruta.")

            return isValid;

        }

        throw new ForbiddenException("No tienes autorización para acceder a esta ruta.")


    }
}