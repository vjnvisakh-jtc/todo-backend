import { ModelFactory, Todo } from '@models';
import { BaseRepository } from './base-repository';
import { RepositoryContext } from './repository-context';

export class TodoRepository extends BaseRepository<Todo> {

  constructor(context: RepositoryContext) {
    super(context);
  }

  protected modelFactory(): ModelFactory<Todo> {
    return {
      getType() {
        return Todo;
      },
      create(json: any) {
        return new Todo(json);
      },
    };
  }
}
