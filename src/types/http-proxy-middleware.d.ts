declare module 'http-proxy-middleware' {
    import { RequestHandler } from 'express';
  
    export interface Options {
      target: string | undefined;
      changeOrigin?: boolean;
      pathRewrite?:{ [key: string]: string };
    }
  
    export function createProxyMiddleware(options: Options): RequestHandler;
  }