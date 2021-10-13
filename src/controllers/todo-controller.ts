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

    // Update a todo item.
    this.router.put(
      `${this.basePath}/:id`,
      createTodoValidator(this.appContext),
      this.updateTodo,
    );

    // Fetch a todo item.
    this.router.get(
      `${this.basePath}/:id`,
      deleteTodoValidator(this.appContext),
      this.fetchTodo,
    );

    // Fetch all todos.
    this.router.get(
      `${this.basePath}/`,
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

  private updateTodo = async (req: ExtendedRequest, res: Response, next: NextFunction) => {

    const failures: ValidationFailure[] = Validation.extractValidationErrors(req);

    if (failures.length > 0) {
      const valError = new Errors.ValidationError(
        res.__('DEFAULT_ERRORS.VALIDATION_FAILED'),
        failures,
      );
      return next(valError);
    }

    const { title } = req.body;
    const { id } = req.params;

    try {

      let todo = await this.appContext.todoRepository.findById(id);

      if (todo._id === undefined) {
        throw new Error('Id not found');
      }

      todo = await this.appContext.todoRepository.update(
        { _id: this.appContext.todoRepository.toObjectId(id) },
        { title },
      );

      res.status(200).json(todo.serialize());

    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  private fetchTodo = async (req: ExtendedRequest, res: Response, next: NextFunction) => {

    const failures: ValidationFailure[] = Validation.extractValidationErrors(req);

    if (failures.length > 0) {
      const valError = new Errors.ValidationError(
        res.__('DEFAULT_ERRORS.VALIDATION_FAILED'),
        failures,
      );
      return next(valError);
    }

    const { id } = req.params;

    try {

      const todo = await this.appContext.todoRepository.findById(id);

      if (todo._id === undefined) {
        throw new Error('Id not found');
      }

      res.status(200).json(todo.serialize());

    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  private fetchTodos = async (req: ExtendedRequest, res: Response, next: NextFunction) => {

    const failures: ValidationFailure[] = Validation.extractValidationErrors(req);

    if (failures.length > 0) {
      const valError = new Errors.ValidationError(
        res.__('DEFAULT_ERRORS.VALIDATION_FAILED'),
        failures,
      );
      return next(valError);
    }

    const todos = await this.appContext.todoRepository.getAll();

    res.status(200).send(todos);
  }
}
