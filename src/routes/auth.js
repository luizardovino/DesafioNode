const jwt = require('jwt-simple');
const jsonwebtoken = require('jsonwebtoken');
const bcrypt = require('bcrypt-nodejs');
const ValidationError = require('../errors/ValidationError');
const config = require('../config/configdev');

module.exports = (app) => {


  const createToken = (user) => {
    let token = false;
    var payload = {
      id: user.id,
      name: user.name,
      mail: user.mail
    };

    token = jsonwebtoken.sign(payload, config.jwt.secret);
    return token;
  };


  const verifyToken = (token) => {
    let result = '';
    try {

      let verify = jsonwebtoken.verify(token.slice(7, token.length).trimLeft(), config.jwt.secret);

      result = verify.data;
    } catch (error) {
      console.log(error);

      result = (error.name !== 'JsonWebTokenError') ? 'error1' : 'error2';
    }
    return result;
  };


  const signin = (req, res, next) => {
    app.services.user.findByEmail({ mail: req.body.mail })
      .then((user) => {
        if (!user) throw new ValidationError('Usuário não encontrado');
        if (bcrypt.compareSync(req.body.passwd, user.passwd)) {
          const token = createToken(user);

          const DataUltimoLogin = new Date().toUTCString();

          app.db('users').update(user.id, { ultimo_login: DataUltimoLogin, token: token });

          const retUser = {
            id: user.id,
            name: user.name,
            mail: user.mail,
            data_criacao: user.data_criacao,
            data_atualizacao: user.data_atualizacao,
            ultimo_login: DataUltimoLogin,
            token: token
          };

          res.status(200).json({ retUser });
        } else {
          throw new ValidationError('Usuário e/ou senha inválidos');
        }
      }).catch(err => next(err));
  }


  return { signin, verifyToken, createToken };
};

