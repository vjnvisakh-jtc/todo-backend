import { LooseObject } from '@typings';
import { BaseModel } from './base-model';

export type ModelFactory<T extends BaseModel> = {
  getType(): LooseObject;
  create(json: any): T;
};
