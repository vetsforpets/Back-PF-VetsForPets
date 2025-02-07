import { Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction } from "express";
import * as moment from 'moment'

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: NextFunction) {
        const now = moment().format('YYYY-MM-DD HH:mm:ss')
        console.log(`[${now}] ${req.method} ${req.url}`)
        next()
    }
}
export function loggerGlobal(req: Request, res: Response, next: NextFunction) {
    const now = moment().format('YYYY-MM-DD HH:mm:ss')
    console.log(`[${now}] ${req.method} ${req.url}`)
    next()
}