import Router from "koa-router";
import userController from "./controller/user";

const router = new Router();

router.post("/users", userController.createUser);

export default router.routes();
