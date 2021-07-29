import { InternalError, logger } from '.';

export type Callback = (
  event: any,
  context: any,
  callback: ResponseCallback
) => Promise<unknown>;

export type ResponseCallback = (
  err: Error | null,
  res: {
    statusCode?: number;
    headers?: { [key: string]: string };
    body?: string;
  }
) => Promise<unknown>;

export function Wrapper(cb: Callback): Callback {
  return async function (event, context, callback) {
    try {
      return await cb(event, context, callback);
    } catch (err) {
      if (process.env.NODE_ENV !== 'prod') {
        logger.error(err.message);
        logger.error(err.stack);
      }

      let statusCode = 500;
      let message = '알 수 없는 오류가 발생했습니다.';

      if (err instanceof InternalError) {
        statusCode = err.status;
        message = err.message;
      }

      callback(null, {
        statusCode,
        body: JSON.stringify({
          message,
        }),
      });
    }
  };
}
