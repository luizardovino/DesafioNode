module.exports = (app) => {

  app.route('/auth/signin').post(app.routes.auth.signin);
  app.route('/auth/signup').post(app.routes.users.create);

  app.route('/users/:id')
    .get(app.routes.users.findOne);
}
