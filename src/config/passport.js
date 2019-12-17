const passport = require('passport');
const passportJwt = require('passport-jwt');
//const config = require('configdev');

const secret = 'Segredo!';

const Strategy = passportJwt.Strategy;
const ExtractJwt = passportJwt.ExtractJwt;

module.exports = (app) => {

  var opts = {}
  opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
  opts.secretOrKey = secret;

  const strategy = new Strategy(opts, (payload, done) => {
    app.services.user.findOne({ id: payload.id })
      .then((user) => {
        if (user) done(null, { ...payload });
        else done(null, false);
      }).catch(err => done(err, false));
  });

  passport.use(strategy);

  return {
    authenticate: () => passport.authenticate('jwt', { session: false }),
  };
};
