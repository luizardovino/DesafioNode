const bcrypt = require('bcrypt-nodejs');
const ValidationError = require('../errors/ValidationError');
const jwt = require('jwt-simple');
const Helper = require('../helpers/helper');
const config = require('../config/configdev');

//const Request = require('express');

module.exports = (app) => {

  const findAll = () => {
    return app.db('users').select(['id', 'name', 'mail', 'data_criacao', 'data_atualizacao', 'ultimo_login', 'token']);
  };

  // Buscar usuário
  // · Chamadas para este endpoint devem conter um header na requisição de Authentication com o valor "Bearer {token}" onde { token } é o valor do token passado na criação ou sign in de um usuário.
  // · Caso o token não exista, retornar erro com status apropriado com a mensagem "Não autorizado".
  // · Caso o token exista, buscar o usuário pelo user_id passado no path e comparar se o token no modelo é igual ao token passado no header.
  // · Caso não seja o mesmo token, retornar erro com status apropriado e mensagem "Não autorizado"
  // · Caso seja o mesmo token, verificar se o último login foi a MENOS que 30 minutos atrás.
  // · Caso não seja a MENOS que 30 minutos atrás, retornar erro com status apropriado com mensagem "Sessão inválida".
  // · Caso tudo esteja ok, retornar o usuário.

  const findOne = (filter = {}, tk, res) => {
    console.log(filter, tk);

    if (!filter) throw new ValidationError('Id do usuário é um atributo obrigatório');
    //const user = app.db('users').where(filter).first().select(['id', 'name', 'mail', 'passwd', 'data_criacao', 'data_atualizacao', 'ultimo_login', 'token']);

    let user;

    async function getUsers() {
      return await app.db.select(['id', 'name', 'mail', 'passwd', 'data_criacao', 'data_atualizacao', 'ultimo_login', 'token'])
        .from('users')
        .where(filter)
        .limit(1);
    }
    //It is working fine with 0.11.5
    //"Error: Undefined binding(s) detected when compiling SELECT query: select \"id\", \"name\", \"mail\", \"passwd\", \"data_criacao\", \"data_atualizacao\", \"ultimo_login\", \"token\" from \"users\" where \"id\" = ? limit ?\n    at QueryCompiler_PG.toSQL 

    async function buscaUsuario() {
      const usuario = await getUsers();
      user = { ...usuario[0] };
      console.log('KNEX', user);
      //console.log('TOKEN', user.token);

      // if (!user) {
      //   return res.status(400).json({ mensagem: 'Usuário não encontrado!' });
      // };

      return user;
    };

    user = buscaUsuario();



    if (!user) {
      return res.status(400).json({ mensagem: 'Usuário não encontrado!' });
    };

    //let http = Helper.http_status;
    // if (user.token != tk) {
    //   return res.status(401).json({ mensagem: 'Não Autorizado 1' });//http.UNAUTHORIZED
    // }
    // else {
    const dtExpirada = new Date();
    dtExpirada.setMinutes(-30)

    data_login = user.ultimo_login;

    if (data_login > dtExpirada) {
      return res.status(401).json({ mensagem: 'Não Autorizado 2' });
    };
    //};

    return user;
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



  return { findAll, save, findOne };
};
