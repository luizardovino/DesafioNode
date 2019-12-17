const bcrypt = require('bcrypt-nodejs');
const ValidationError = require('../errors/ValidationError');
const jwt = require('jwt-simple');
const Helper = require('../helpers/helper');
const config = require('../config/configdev');

//const Request = require('express');

module.exports = (app) => {

  // Buscar usuário
  // · Chamadas para este endpoint devem conter um header na requisição de Authentication com o valor "Bearer {token}" onde { token } é o valor do token passado na criação ou sign in de um usuário.
  // · Caso o token não exista, retornar erro com status apropriado com a mensagem "Não autorizado".
  // · Caso o token exista, buscar o usuário pelo user_id passado no path e comparar se o token no modelo é igual ao token passado no header.
  // · Caso não seja o mesmo token, retornar erro com status apropriado e mensagem "Não autorizado"
  // · Caso seja o mesmo token, verificar se o último login foi a MENOS que 30 minutos atrás.
  // · Caso não seja a MENOS que 30 minutos atrás, retornar erro com status apropriado com mensagem "Sessão inválida".
  // · Caso tudo esteja ok, retornar o usuário.

  const findOne = async (filter = {}, res) => {
    console.log(filter);

    if (!filter) throw new ValidationError('Id do usuário é um atributo obrigatório');
    //const user = app.db('users').where(filter).first().select(['id', 'name', 'mail', 'passwd', 'data_criacao', 'data_atualizacao', 'ultimo_login', 'token']);

    let user;

    const usuario = await getUsers(filter);
    user = { ...usuario[0] };
    console.log('KNEX1', user);
    if (!user) throw new ValidationError('Usuário não encontrado!');

    const dtExpirada = new Date();
    console.log('dtExpirada1', dtExpirada);

    dtExpirada.setMinutes(-30);

    data_login = user.ultimo_login;

    console.log('data_login', data_login);
    console.log('dtExpirada', dtExpirada);

    if (data_login > dtExpirada) {
      console.log('EXPIROU');
      return res.status(401).json({ mensagem: 'Não Autorizado' });
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



  // · Usar status codes de acordo
  // · Em caso de sucesso irá retornar um usuário mais os campos:
  // ·· id: id do usuário(pode ser o próprio gerado pelo banco, porém seria interessante se fosse um GUID)
  // ·· data_criacao: data da criação do usuário
  // ·· data_atualizacao: data da última atualização do usuário
  // ·· ultimo_login: data do último login(no caso da criação, será a mesma que a criação)
  // ·· token: token de acesso da API(pode ser um GUID ou um JWT)
  // · Caso o e - mail já exista, deverá retornar erro com a mensagem "E-mail já existente".
  // · O token deverá ser persistido junto com o usuário
  const save = async (user) => {
    if (!user.name) throw new ValidationError('Nome é um atributo obrigatório');
    if (!user.mail) throw new ValidationError('Email é um atributo obrigatório');
    if (!user.passwd) throw new ValidationError('Senha é um atributo obrigatório');

    const userDb = await findByEmail({ mail: user.mail });
    if (userDb) throw new ValidationError('E-mail já existente');

    const DataUser = new Date().toUTCString();

    //TODO: Mudar o id para GUID e passar aqui
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
