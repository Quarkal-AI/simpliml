import { Request } from 'express';

interface GetDeployment {
  page: number
}

export default interface GetDeploymentRequest extends Request {
  body: GetDeployment;
}
