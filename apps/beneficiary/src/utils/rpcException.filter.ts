// import { ArgumentsHost, Catch, RpcExceptionFilter as RPCExceptionFilter } from '@nestjs/common';
// import { RpcException } from '@nestjs/microservices';
// import { Observable, throwError } from 'rxjs';

// @Catch(RpcException)
// export class RpcExceptionFilter implements RPCExceptionFilter<RpcException> {
//   catch(exception: RpcException, host: ArgumentsHost): Observable<any> {
//     return throwError(() => exception.getError());
//   }
// }
