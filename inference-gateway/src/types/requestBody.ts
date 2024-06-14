import { Request } from 'express';

export interface CustomRequest extends Request {
  trace_id: string;
  server: string;
  model: string;
}
