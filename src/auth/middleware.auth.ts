export function isLoggedIn (req: any, res: any, next: any) {
  req.isAuthenticated()
    ? next()
    : res.redirect('/auth/login');
}

export function isLoggedOut (req: any, res: any, next: any) {
  req.isAuthenticated()
    ? res.redirect('back')
    : next();
}
