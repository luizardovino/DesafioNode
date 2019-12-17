const request = require('supertest');
const app = require('../../src/app');

const mail = `${Date.now()}@mail.com`
const telefones = JSON.stringify([{ numero: '22222222', ddd: '21' }]);

describe.skip('auth.test', () => {

  test('Deve criar usuário via signup', () => {
    return request(app).post('/auth/signup')
      .send({ name: 'TestUser', mail: mail, passwd: '123456', telefones: telefones })
      .then((res) => {
        expect(res.status).toBe(201);
        expect(res.body.name).toBe('TestUser');
        expect(res.body).toHaveProperty('mail');
        expect(res.body).not.toHaveProperty('passwd');
      });
  });

  //utiliza o usuario criado no signup anterior
  test('Deve receber token ao logar', () => {
    request(app).post('/auth/signin')
      .send({ mail: mail, passwd: '123456' })
      .then((res) => {
        expect(res.status).toBe(200);
        expect(res.body.retUser).toHaveProperty('token');
      });
  });
  //'1576502834003@mail.com'

  test('Não deve autenticar usuário com senha errada', () => {
    request(app).post('/auth/signin')
      .send({ mail: 'inexistente@mail.com', passwd: '654321' })
      .then((res) => {
        expect(res.status).toBe(400);
        expect(res.body.error).toBe('Usuário e/ou senha inválidos');
      });
  });

});



