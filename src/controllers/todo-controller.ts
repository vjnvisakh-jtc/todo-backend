import { BaseController } from './base-controller';
import { Todo } from '@models';
import { AppContext, Errors, ExtendedRequest, ValidationFailure } from '@typings';
import { NextFunction, Router, Response } from 'express';
import { createTodoValidator, deleteTodoValidator } from '@validators';
import { Validation } from '@helpers';

export class TodoController extends BaseController {
  public basePath: string = '/todo';
  public router: Router = Router();

  constructor(ctx: AppContext) {
    super(ctx);
    this.initializeRoutes();
  }

  private initializeRoutes() {
    // Create a new todo item.
    this.router.post(`${this.basePath}`, createTodoValidator(this.appContext), this.createTodo);

    // Delete a todo item.
    this.router.delete(
      `${this.basePath}/:id`,
      deleteTodoValidator(this.appContext),
      this.deleteTodo,
    );

    // Fetch all todos
    this.router.get(
      `${this.basePath}`,
      this.fetchTodos,
    );
  }

  private createTodo = async (req: ExtendedRequest, res: Response, next: NextFunction) => {

    const failures: ValidationFailure[] = Validation.extractValidationErrors(req);

    if (failures.length > 0) {
      const valError = new Errors.ValidationError(
        res.__('DEFAULT_ERRORS.VALIDATION_FAILED'),
        failures,
      );
      return next(valError);
    }

    const { title } = req.body;
    const todo = await this.appContext.todoRepository.save(new Todo({ title }));

    res.status(201).json(todo.serialize());
  }

  private deleteTodo = async (req: ExtendedRequest, res: Response, next: NextFunction) => {

    const failures: ValidationFailure[] = Validation.extractValidationErrors(req);

    if (failures.length > 0) {
      const valError = new Errors.ValidationError(
        res.__('DEFAULT_ERRORS.VALIDATION_FAILED'),
        failures,
      );
      return next(valError);
    }

    const { id } = req.params;

    await this.appContext.todoRepository.deleteMany({
      _id: this.appContext.todoRepository.toObjectId(id),
    });

    res.status(204).json();
  }

  /**
   * @openapi
   * /todo:
   *   get:
   *     description: Welcome to swagger-jsdoc!
   *     tags: [Books]
   *     responses:
   *       200:
   *         description: Returns a mysterious string.
   */
  private fetchTodos = async (req: ExtendedRequest, res: Response, next: NextFunction) => {

    const todos = await this.appContext.todoRepository.getAll();

    res.status(204).json(todos);
  }
}
