import { Injectable, NestMiddleware } from '@nestjs/common';

@Injectable()
export class BufferMiddleware implements NestMiddleware {
  use(req: any, res: any, next: any) {
    // Check if the request contains buffer data
    if (req.headers['content-type'] === 'application/octet-stream') {
      // Attach the buffer data to the request body
      let data = Buffer.from('');
      req.on('data', (chunk: any) => {
        data = Buffer.concat([data, chunk]);
      });
      req.on('end', () => {
        req.body = data;
        next();
      });
    } else {
      next();
    }
  }
}
