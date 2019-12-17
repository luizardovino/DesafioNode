const jwt = require('jwt-simple');
const jsonwebtoken = require('jsonwebtoken');
const bcrypt = require('bcrypt-nodejs');
const ValidationError = require('../errors/ValidationError');
const config = require('../config/configdev');

//const secret = 'Segredo!';



module.exports = (app) => {

  const createToken = (user) => {
    const payload = {
      id: user.id,
      name: user.name,
      mail: user.mail,
    };
    const token = jwt.encode(payload, config.jwt.secret);
    //console.log(token);

    return token;
  };

  // const createTokenOLD = (user) => {
  //   let token = false;
  //   var payload = {
  //     id: user.id,
  //     name: user.name,
  //     mail: user.mail
  //   };

  //   token = jsonwebtoken.sign(payload, secret);
  //   return token;
  // };


  const verifyToken = (token) => {
    let result = '';
    try {
      let verify = jsonwebtoken.verify(token, config.jwt.secret); //TODO config.jwt.secret
      //console.log(verify);

      result = verify.data;
    } catch (error) {
      console.log(error);

      result = (error.name !== 'JsonWebTokenError') ? 'error1' : 'error2';
    }
    return result;
  };


  // · Recebe um objeto com e-mail e senha.
  // · Caso o e-mail exista e a senha seja a mesma que a senha persistida, retornar igual ao endpoint de Sign Up.
  // · Caso o e-mail não exista, retornar erro com status apropriado mais a mensagem "Usuário e/ou senha inválidos"
  // · Caso o e-mail exista mas a senha não bata, retornar o status apropriado 401 mais a mensagem "Usuário e/ou senha inválidos"

  // Em caso de sucesso irá retornar um usuário mais os campos:
  // ·· id: id do usuário
  // ·· data_criacao: data da criação do usuário
  // ·· data_atualizacao: data da última atualização do usuário
  // ·· ultimo_login: data do último login
  // ·· token: token de acesso da API

  const signin = (req, res, next) => {
    app.services.user.findByEmail({ mail: req.body.mail })
      .then((user) => {
        if (!user) throw new ValidationError('Usuário não encontrado');
        if (bcrypt.compareSync(req.body.passwd, user.passwd)) {
          const token = createToken(user);

          const DataUltimoLogin = new Date().toUTCString();

          //.update(key, value, [returning])
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

