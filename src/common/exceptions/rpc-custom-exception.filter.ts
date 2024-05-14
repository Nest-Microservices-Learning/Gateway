import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';

@Catch(RpcException)
export class RpcCustomExceptionFilter implements ExceptionFilter {
  catch(exception: RpcException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse();

    // Verifica si los encabezados ya han sido enviados
    if (res.headersSent) {
      return;
    }

    const rpcError = exception.getError();

    if (rpcError.toString().includes('Empty response')) {
      return res.status(500).json({
        status: 500,
        message: rpcError
          .toString()
          .substring(0, rpcError.toString().indexOf('(') - 1),
      });
    }

    if (
      typeof rpcError === 'object' &&
      'status' in rpcError &&
      'message' in rpcError
    ) {
      const status = isNaN(+rpcError.status) ? 400 : +rpcError.status;
      return res.status(status).json(rpcError);
    }
    return res.status(400).json({
      status: 400,
      message: rpcError,
    });
  }
}
