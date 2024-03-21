import { Express, Request, Response } from "express";
import { createUserHandler, findUsersHandler } from "./controller/user.controller";
import validateResource from "./middleware/validateResource";
import { createUserSchema } from "./schema/user.schema";
import { queryArxivHandler } from "./controller/arXiv.controller";
import { createUserSessionHandler, deleteSessionHandler, getUserSessionHandler } from "./controller/session.controller";
import { createSessionSchema } from "./schema/session.schema";
import requireUser from "./middleware/requireUser";
import { createFeedSchema, updateFeedSchema } from "./schema/feed.schema";
import { createFeedHandler, findUserFeedsHandler, updateFeedHandler, deleteFeedHandler, getFeedHandler } from "./controller/feed.controller";

const bodyParser = require('body-parser');

require('body-parser-xml')(bodyParser);

export default function routes(app: Express) {
  app
    .get("/healthcheck", (request: Request, response: Response) => response.sendStatus(200))

  app
    .post('/api/users/', validateResource(createUserSchema), createUserHandler)
    .get('/api/users', findUsersHandler)

  app
    .get('/api/arXiv', queryArxivHandler)

  app
    .get('/api/sessions', requireUser, getUserSessionHandler)
    .post('/api/sessions/', validateResource(createSessionSchema), createUserSessionHandler)
    .delete('/api/sessions/', requireUser, deleteSessionHandler)


  app
    .get('/api/feeds', requireUser, findUserFeedsHandler)
    .post('/api/feeds/', [validateResource(createFeedSchema), requireUser], createFeedHandler)


  app
    .get('/api/feeds/:feedId/', requireUser, getFeedHandler)
    .put('/api/feeds/:feedId/', [requireUser, validateResource(updateFeedSchema)], updateFeedHandler)
    .delete('/api/feeds/:feedId/', requireUser, deleteFeedHandler)


}