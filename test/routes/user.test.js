const request = require('supertest');
const jwt = require('jwt-simple');

const app = require('../../src/app');

const mail = `${Date.now()}@mail.com`
const telefones = JSON.stringify([{ numero: '22222222', ddd: '21' }]);

let user;

beforeAll(async () => {
  const res = await app.services.user.save({ name: 'User Test', mail: `${Date.now()}@mail.com`, passwd: '123456' });
  user = { ...res[0] };
  //user.token = jwt.encode(user, 'Segredo!'); 
  let auth = app.routes.auth;
  user.token = auth.createToken(user);
  //console.log(user.token);
});

test('Deve buscar o usuário', () => {
  return request(app).get(`/users/${user.id}`) //http://localhost:3001/users
    .set('authorization', `bearer ${user.token}`)
    .then((res) => {
      expect(res.status).toBe(200);
      //expect(res.body.length).toBeGreaterThan(0);
      //expect(res.body.id).toBe(user.id);
    });
});


test('Deve inserir usuário com sucesso', () => {
  return request(app).post('/auth/signup')
    .send({ name: 'TestUser', mail: mail, passwd: '123456', telefones: telefones })
    .then((res) => {
      expect(res.status).toBe(201);
      expect(res.body.name).toBe('TestUser');
      expect(res.body).not.toHaveProperty('passwd');
    });
});

test('Deve armazenar senha criptografada', async () => {
  const res = await request(app).post('/auth/signup')
    .send({ name: 'Walter Mitty', mail: `${Date.now()}@mail.com`, passwd: '123456', telefones: telefones })
  expect(res.status).toBe(201);

  const { id } = res.body; //verifica se tem um id dentro do body e retorna direto apara a variavel
  const userDB = await app.services.user.findOne({ id });
  expect(userDB.passwd).not.toBeUndefined();
  expect(userDB.passwd).not.toBe('123456');
});


//Usando request e then
test('Não deve inserir usuário sem nome', () => {
  return request(app).post('/auth/signup')
    .send({ mail: 'walter@mail.com', passwd: '123456', telefones: telefones })
    .then((res) => {
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Nome é um atributo obrigatório');
    });
});

//Usando async e await
test('Não deve inserir usuário sem email', async () => {
  const result = await request(app).post('/auth/signup')
    .send({ name: 'Walter Mitty', passwd: '123456', telefones: telefones })
  expect(result.status).toBe(400);
  expect(result.body.error).toBe('Email é um atributo obrigatório');
});

//outra forma de fazer usando o Done
test('Não deve inserir usuário sem senha', (done) => {
  request(app).post('/auth/signup')
    .send({ name: 'Walter Mitty', mail: 'walter@mail.com', telefones: telefones })
    .then((res) => {
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Senha é um atributo obrigatório');
      done(); //requisição foi finalizada
    }).catch(err => done.fail(err));
});

test('Não deve inserir usuário com email existente', () => {
  return request(app).post('/auth/signup')
    .send({ name: 'Walter Mitty', mail: mail, passwd: '123456', telefones: telefones })
    .then((res) => {
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('E-mail já existente');
    });
});
