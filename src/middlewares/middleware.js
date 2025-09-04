function globalMiddleware(req, res, next) {
  res.locals.errors = req.flash("errors");
  res.locals.success = req.flash("success");
  res.locals.user = req.session.user;
  next();
}

exports.outroMiddleware = (req, res, next) => {
  next();
};

function checkCsrfError(err, req, res, next) {
  if (err) {
    return res.render("404");
  }
  next();
}

function csrfMiddleware(req, res, next) {
  res.locals.csrfToken = req.csrfToken();
  next();
}

function loginRequired(req, res, next)  {
  if(!req.session.user) {
    req.flash('errors', 'Você precisa fazer login para acessar essa página.');
    req.session.save(() => res.redirect('/login/index'));
    return;
  }

  next();
}

module.exports = {
  globalMiddleware,
  checkCsrfError,
  csrfMiddleware,
  loginRequired
};
