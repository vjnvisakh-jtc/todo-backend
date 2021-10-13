import { BaseModel } from './base-model';
import { LooseObject } from '@typings';

export class Todo extends BaseModel {
  title: string;
  createdAt: Date;

  constructor(json?: any) {
    super(json);

    if (json) {
      this.title = json.title;
      this.createdAt = json.createdAt;
    }
  }

  public serialize(): LooseObject {
    return {
      id: this._id,
      title: this.title,
      createdAt: this.createdAt,
    };
  }
}
