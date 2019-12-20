const bcrypt = require('bcrypt-nodejs');
const ValidationError = require('../errors/ValidationError');
const jwt = require('jwt-simple');
const Helper = require('../helpers/helper');
const config = require('../config/configdev');


module.exports = (app) => {


  const findOne = async (filter = {}, tk, res) => {
    console.log(filter);

    if (!filter) throw new ValidationError('Id do usuário é um atributo obrigatório');

    let user;

    const usuario = await getUsers(filter);
    user = { ...usuario[0] };

    if (!user) throw new ValidationError('Usuário não encontrado!');

    if (tk.slice(7, tk.length).trimLeft() != user.token.trim()) {
      return res.status(401).json({ mensagem: 'Usuário Não Autorizado' });
    };

    const dtExpirada = new Date();

    dtExpirada.setMinutes(-30);

    data_login = user.ultimo_login;

    if (data_login < dtExpirada) {
      return res.status(401).json({ mensagem: 'Não Autorizado Expirado' });
    };

    async function getUsers(filter) {
      return await app.db.select(['id', 'name', 'mail', 'passwd', 'data_criacao', 'data_atualizacao', 'ultimo_login', 'token'])
        .from('users')
        .where(filter)
        .limit(1);
    };

    return user
  };





  const findByEmail = (filter = {}) => {
    const user = app.db('users').where(filter).first().select(['id', 'name', 'mail', 'passwd', 'data_criacao', 'data_atualizacao', 'ultimo_login', 'token']);
    if (!user) throw new ValidationError('Usuário não encontrado!');

    return user
  };


  const getPasswdHash = (passwd) => {
    const salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(passwd, salt);
  };


  const save = async (user) => {
    if (!user.name) throw new ValidationError('Nome é um atributo obrigatório');
    if (!user.mail) throw new ValidationError('Email é um atributo obrigatório');
    if (!user.passwd) throw new ValidationError('Senha é um atributo obrigatório');

    const userDb = await findByEmail({ mail: user.mail });
    if (userDb) throw new ValidationError('E-mail já existente');

    const DataUser = new Date().toUTCString();

    let newUser = {
      name: user.name,
      mail: user.mail,
      passwd: getPasswdHash(user.passwd),
      data_criacao: DataUser,
      data_atualizacao: DataUser,
      ultimo_login: DataUser,
      token: jwt.encode(user, config.jwt.secret),
      telefones: user.telefones
    }

    return app.db('users').insert(newUser, ['id', 'name', 'mail', 'data_criacao', 'data_atualizacao', 'ultimo_login', 'token']);
  };



  return { save, findOne };
};
