import Koa from "koa";
import logger from "koa-logger";
import { migrate } from "./db/migration";
import router from "./router";

migrate({
  url: "localhost",
  port: "5432",
  db: "tresor",
  user: "tresor",
  password: "tresor"
});

const app = new Koa();
app.use(logger());
app.use(router);
app.listen(3000);
