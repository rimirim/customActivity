const express = require("express");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const path = require("path");
const session = require("express-session");
const nunjucks = require("nunjucks");
const dotenv = require("dotenv");
const passport = require("passport");

const { sequelize } = require("./models");

dotenv.config(); // process.env
const pageRouter = require("./routes/page");
const passportConfig = require("./passport");

const app = express();
passportConfig();
app.set("port", process.nextTick.PORT || 8001);
app.set("view engine", "html");

nunjucks.configure("views", {
   express: app,
   watch: true,
});

sequelize
   .sync({ force: true })
   .then(() => {
      console.log("데이터 베이스 연결 성공");
   })
   .catch((err) => {
      console.error(err);
   });
app.use(morgan("dev")); // 자세하게 로깅 combined = 간략하게
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(
   session({
      resave: false,
      saveUninitialized: false,
      secret: process.env.COOKIE_SECRET,
      cookie: {
         httpOnly: true,
         secure: false,
      },
   })
);
app.use(passport.initialize());
app.use(passport.session());

app.use("/", pageRouter);
app.use((req, res, next) => {
   // 404 Not found
   const error = new Error(`${req.method} ${req.url} 라우터가 없습니다`);
   error.status = 404;
   next(error);
});
app.use((err, req, res, next) => {
   res.locals.message = err.message;
   res.locals.error = process.env.NODE_ENV !== "production" ? err : {}; // 에러 로그를 서비스에 넘김
   res.status(err.status || 500);
   res.render("error"); // nunjucks가 views 폴더에서 .html을 찾아서 보여준다
});

app.listen(app.get("port"), () => {
   console.log(app.get("port"), "번 포트에서 대기 중");
});
