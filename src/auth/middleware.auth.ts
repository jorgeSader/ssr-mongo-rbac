export function isLoggedIn (req, res, next) {
  req.isAuthenticated()
    ? next()
    : res.redirect('/auth/login');
}

export function isLoggedOut (req, res, next) {
  req.isAuthenticated()
    ? res.redirect('back')
    : next();
}
