import express from "express";
import config from "config";
import connect from "./utils/connect";
import logger from "./utils/logger";
import routes from "./routes";
import deserializeUser from "./middleware/deserializeUser";

const port = config.get<number>("port");

const cors = require('cors');

const app = express();

app.use(express.json());

app.use(cors({
  origin: 'http://localhost:3001'
}))

app.use(deserializeUser);

app.listen(port, async () => {
  logger.info("App is running");

  await connect();
  
  routes(app);
});