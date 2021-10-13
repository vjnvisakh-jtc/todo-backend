// tslint:disable-next-line: no-var-requires
require('module-alias/register');
import i18n from 'i18n';
import { App, logger } from '@server';
import { Mongoose, Repositories } from '@storage';
import { AppContext } from '@typings';

logger.info('www - Initializing HTTP server...');
logger.info('www - Initializing connection to Mongo Store...');

// tslint:disable-next-line: no-var-requires
const swaggerJsDoc = require('swagger-jsdoc'); const swaggerUI = require('swagger-ui-express');

const mongoStore = new Mongoose.MongoStore();

const respositoryContext = {
  logger,
  store: mongoStore,
  translate: i18n.__,
};

const appContext: AppContext = {
  logger,
  accountRepository: new Repositories.AccountRepository(respositoryContext),
  todoRepository: new Repositories.TodoRepository(respositoryContext),
};

mongoStore
  .connect()
  .then(() => {
    logger.info('www - Connection to Mongo Store succeeded...');
    const app = new App(appContext);

    const swaggerOptions = {
      swaggerDefinition: {
        info: {
          title: 'TODO API',
          version: '1.0.0',
        },
      },
      apis: ['src/controllers/*.ts'],
    };

    const swaggerDocs = swaggerJsDoc(swaggerOptions);
    app.expressApp.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocs));

    const server = app.listen();
    appContext.logger.info('www - Server started...');
    process.on('SIGINT', () => {
      appContext.logger.info(
        'www - sigint event received, attempting to shut down application...',
      );
      server.close((err) => {
        if (err) {
          appContext.logger.error(
            `www - encountered error while shutting down server - ${err.message}`,
          );
          process.exit(1);
        } else {
          appContext.logger.info(
            'www - server was closed gracefully, shutting down...',
          );
          process.exit(0);
        }
      });
    });
  })
  .catch((err) => {
    logger.error(`Error starting HTTP server: ${err.message}`);
  });
