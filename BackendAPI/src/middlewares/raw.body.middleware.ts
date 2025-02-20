import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class RawBodyMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    let data = '';
    req.setEncoding('utf-8');

    req.on('data', (chunk) => {
      data += chunk;
    });

    req.on('end', () => {
      (req as any).rawBody = data;
      next();
    });
  }
}
