import {
  BadRequestException,
  Catch,
  ExceptionFilter,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common';
import { ValidationError } from 'class-validator';

@Catch(BadRequestException)
export class BadRequestExceptionFilter implements ExceptionFilter {
  catch(exception: BadRequestException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    let stringError;

    const validationErrors = exception.getResponse()?.['message'] || [];
    if (!Array.isArray(validationErrors)) {
      stringError = exception.getResponse()?.['message'];
    }
    const formattedErrors = this.formatErrors(validationErrors, stringError);

    const status = HttpStatus.BAD_REQUEST;

    const badRequestResponse = {
      statusCode: status,
      message: 'Bad Request',
      errors: formattedErrors,
      timestamp: new Date().toISOString(),
      path: request.url,
    };
    console.log(badRequestResponse);

    response.status(status).json(badRequestResponse);
  }

  private formatErrors(
    errors: ValidationError[] | string[],
    stringError?,
  ): string[] {
    const result: string[] = [];

    if (Array.isArray(errors)) {
      errors.forEach((err) => {
        if (err instanceof ValidationError) {
          Object.values(err.constraints).forEach((message) => {
            result.push(message);
          });
        } else if (typeof err === 'string') {
          result.push(err);
        }
      });
    } else {
      result.push(stringError);
    }
    return result;
  }
}
