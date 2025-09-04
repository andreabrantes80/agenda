require("dotenv").config();

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const cookieParser = require("cookie-parser");
const csrf = require("csurf");
const routes = require("./routes");
const path = require("path");
const middleware = require("./src/middlewares/middleware");

// 📦 Conexão com MongoDB
mongoose
  .connect(process.env.CONNECTIONSTRING)
  .then(() => {
    console.log("MongoDB connected successfully");
    app.emit("ready");
  })
  .catch((e) => console.log("Error connecting to MongoDB:", e));

// 📄 Configurações básicas
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.resolve(__dirname, "public")));

app.use(cookieParser());

// 🧠 Sessão e Flash
app.use(
  session({
    secret: "assasdsdsddsdsds qwre qwe qwqwe qwqwqw",
    store: MongoStore.create({
      mongoUrl: process.env.CONNECTIONSTRING,
      ttl: 1000 * 60 * 60 * 24 * 7,
    }),
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7,
      httpOnly: true,
    },
  })
);
app.use(flash());

// 🖼️ Views
app.set("views", path.resolve(__dirname, "src", "views"));
app.set("view engine", "ejs");

// 🛡️ CSRF
app.use(csrf({ cookie: true }));

// 🧩 Middlewares personalizados
app.use(middleware.globalMiddleware);
app.use(middleware.csrfMiddleware);
app.use(middleware.checkCsrfError);


// 🚦 Rotas
app.use(routes);

//🚫 404
app.use((req, res) => {
  res.status(404).render("404", {
    user: req.session.user || null,
    errors: req.flash("errors"),
    success: req.flash("success"),
    csrfToken: req.csrfToken(),
  });
});


// 🚀 Inicialização
app.on("ready", () => {
  app.listen(3000, () => {
    console.log("Server is running on http://localhost:3000");
  });
});
