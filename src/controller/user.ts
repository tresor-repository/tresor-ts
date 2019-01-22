import { Context } from "koa";
const userController = {
  createUser: (ctx: Context) => {
    ctx.body = "Cuyy";
  }
};

export default userController;
