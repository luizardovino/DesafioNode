module.exports = (app) => {

  app.route('/auth/signin').post(app.routes.auth.signin);
  app.route('/auth/signup').post(app.routes.users.create);

  app.route(`/users/:id`)
    .all(app.config.passport.authenticate()) //incluir em todas as rotas novas
    .get(app.routes.users.findOne); //o get invoca o metodo findOne
}
