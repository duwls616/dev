import requestContext from 'request-context';

// app.module.ts에서 MiddlewareConsumer를 사용하여 로드
export const contextMiddleware = requestContext.middleware('request');
