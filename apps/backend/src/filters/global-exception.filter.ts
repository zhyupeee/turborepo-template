import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
  BadRequestException,
} from "@nestjs/common";
import { Response } from "express";

/**
 * 全局异常过滤器
 * 统一处理所有未捕获的异常，返回标准格式的错误响应
 */
@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = "服务器内部错误";
    let code = "INTERNAL_SERVER_ERROR";

    // 处理 HTTP 异常
    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();
      if (typeof exceptionResponse === "string") {
        message = exceptionResponse;
      } else if (
        typeof exceptionResponse === "object" &&
        exceptionResponse !== null &&
        "message" in exceptionResponse &&
        typeof exceptionResponse.message === "string"
      ) {
        message = exceptionResponse.message;
      }
      code = exception.name;

      // 处理常见的 HTTP 异常
      if (status === HttpStatus.BAD_REQUEST) {
        code = "BAD_REQUEST";
      } else if (status === HttpStatus.UNAUTHORIZED) {
        code = "UNAUTHORIZED";
      } else if (status === HttpStatus.FORBIDDEN) {
        code = "FORBIDDEN";
      } else if (status === HttpStatus.NOT_FOUND) {
        code = "NOT_FOUND";
      } else if (status === HttpStatus.CONFLICT) {
        code = "CONFLICT";
      } else if (status === HttpStatus.GONE) {
        code = "GONE";
      }
    }
    // 处理验证异常
    else if (exception instanceof BadRequestException) {
      status = HttpStatus.BAD_REQUEST;
      code = "VALIDATION_ERROR";
      const exceptionResponse = exception.getResponse();
      if (typeof exceptionResponse === "string") {
        message = exceptionResponse;
      } else if (
        typeof exceptionResponse === "object" &&
        exceptionResponse !== null &&
        "message" in exceptionResponse &&
        typeof exceptionResponse.message === "string"
      ) {
        message = exceptionResponse.message;
      }
    }
    // 处理其他 Error
    else if (exception instanceof Error) {
      message = exception.message;
      code = "INTERNAL_SERVER_ERROR";
      this.logger.error(`未处理的异常：${exception.message}`, exception.stack);
    }
    // 处理未知异常
    else {
      this.logger.error(`未知异常：${JSON.stringify(exception)}`);
    }

    // 判断是否为开发环境
    const isDev = process.env.NODE_ENV === "development";

    // 返回统一格式的错误响应
    response.status(status).json({
      success: false,
      message,
      code,
      ...(isDev && {
        stack: exception instanceof Error ? exception.stack : undefined,
      }),
    });
  }
}
