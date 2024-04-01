const express = require("express");
const path = require("path");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const multer = require("multer");
const app = express();

// 미들웨어 = 함수
// 미들웨어 간 순서 중요
app.set("port", process.env.PORT || 3000);
app.use(morgan("dev"));
//app.use('요청경로',express.static('실제경로')) // css 같은 정적 파일
// 미들웨어 확장법
app.use("/", (req, res, next) => {
   if (req.session.id) {
      express.static(__dirname, "public-3030")(req, res, next);
   } else {
      next();
   }
});
app.use(cookieParser("password"));
app.use(
   session({
      resave: false,
      saveUninitialized: false,
      secret: "password",
      cookie: {
         httpOnly: true,
      },
      name: "connect.sid", //session-cookie
   })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // form submit할 때
app.use(multer().array());
app.use(
   (req, res, next) => {
      console.log("모든 요청에 실행하고 싶어요");
      next(); // 다음 라우터로 넘어가기 위해서
   }
   //    (req, res, next) => {
   //       try {
   //          console.log("에러");
   //       } catch (error) {
   //          next(error);
   //       }
   //    }
);
app.use((req, res, next) => {
   req.data = "비번";
});
//메소드와 주소가 있는 것들 - 라우터
app.get(
   "/",
   (req, res, next) => {
      //    res.send("hello expres");
      req.data; //비번
      req.body.name;
      req.cookies;
      req.signedCookies; //암호화된 경우 사용
      res.sendFile(path.join(__dirname, "index.html"));
      res.cookie("name", encodeURIComponent(name), {
         expires: new Date(),
         httpOnly: true,
         path: "/",
      });
      res.clearCookie("name", encodeURIComponent(name), {
         httpOnly: true,
         path: "/",
      });
      next("route");
   },
   (req, res) => {
      console.log("실행되나요");
   }
);
app.get("/", (req, res) => {
   console.log("라우트 실행");
});
app.post("/", (req, res) => {
   res.send("hello express");
});
app.get("/category/:name", (req, res) => {
   res.send(`hello ${req.params.name}`);
}); // 와일드 카드는 다른 미들웨어 보다 아래에 위치
app.get("/about", (req, res) => {
   res.send("hello express");
});
app.get("*", (req, res) => {
   console.log("hello every body");
});
app.use((req, res, next) => {
   res.status(404).send("404지롱");
});
app.use((err, req, res, next) => {
   // err 미들웨어는 꼭 4가지가 모두 들어가야함
   console.error(err);
   res.status(500).send("에러");
   //기본적으로 status 200으로 되어있기 떄문에 설정
});
app.listen(app.get("port"), () => {
   console.log("익스프레스 서버 실행");
});
