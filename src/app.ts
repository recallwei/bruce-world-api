import express, { Express, Request, Response, NextFunction } from "express";
import createError from "http-errors";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import logger from "morgan";
import swaggerJsdoc from "express-jsdoc-swagger";
import path from "path";

import indexRouter from "@routes/index";
import docMenusRouter from "@routes/docs/menus";
import todoRouter from "@routes/todo";
import uuidRouter from "@routes/uuid";
import authGitHubRouter from "@routes/auth/github";

const app: Express = express();

// cors config
app.all("*", function (req: Request, res: Response, next: NextFunction) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With,Authorization");
  res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
  res.header("X-Powered-By", " 3.2.1");
  // res.header("Content-Type", "application/json;charset=utf-8");
  next();
});

// view engine setup
app.set("views", path.join(__dirname, "../views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

// static files setup
app.use("/public", express.static(path.join(__dirname, "../src/public")));
app.use("/static", express.static(path.join(__dirname, "../static")));

const options = {
  info: {
    title: "Bruce World API",
    version: "1.0.0",
    description: "An API which is used to support the wiki website.",
  },
  security: {
    bearerAuth: {
      type: "apiKey",
      scheme: "bearer",
      bearerFormat: "JWT",
      description:
        "JWT Authorization header using the Bearer scheme. Enter 'Bearer' [space] and then your token in the text input below. Example: 'Bearer 123456abcdef'",
      name: "Authorization",
      in: "header",
    },
  },
  baseDir: __dirname,
  filesPattern: "./**/*.js",
  swaggerUIPath: "/api",
};

swaggerJsdoc(app)(options);

app.use("/", indexRouter);
app.use("/docs/menus", docMenusRouter);
app.use("/todo", todoRouter);
app.use("/uuid", uuidRouter);

// Auth
app.use("/auth/github", authGitHubRouter);

// catch 404 and forward to error handler
app.use(function (
  error: any,
  request: Request,
  response: Response,
  next: NextFunction
) {
  next(createError(404));
});

// error handler
app.use(function (error: any, request: Request, response: Response) {
  // set locals, only providing error in development
  response.locals.message = error.message;
  response.locals.error = request.app.get("env") === "development" ? error : {};
  // render the error page
  response.status(error.status || 500);
  response.render("error");
});

export default app;
