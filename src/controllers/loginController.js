const Login = require("../models/LoginModel");

exports.index = (req, res) => {
   console.log("Usuário na sessão:", req.session.user);

  if (req.session.user) return res.render("login-logado");
  res.render("login", {
    csrfToken: req.csrfToken(), // Pass the CSRF token to the view
  });
};

// exports.index = (req, res) => {
//   res.render("login");
// };

exports.register = async (req, res) => {
  try {
    const login = new Login(req.body);
    await login.register();

    if (login.errors.length > 0) {
      req.flash("errors", login.errors);
      req.session.save(() => res.redirect("/login"));
      return;
    }

    req.flash("success", "Cadastro realizado com sucesso.");
    req.session.save(() => res.redirect("/login"));
  } catch (e) {
    console.log(e);
    res.render("404");
  }
};

exports.login = async (req, res) => {
  try {
    const login = new Login(req.body);
    await login.login();

    if (login.errors.length > 0) {
      req.flash("errors", login.errors);
      req.session.save(() => {
        return res.redirect("back");
      });
      return;
    }

    req.flash("success", "Você entrou no sistema.");
    req.session.user = login.user;
    req.session.save(() => {
      return res.redirect("/");
    });
  } catch (e) {
    console.log(e);
    return res.render("404");
  }
};

exports.logout = (req, res) => {
  req.session.destroy();
  res.redirect("/");
};
