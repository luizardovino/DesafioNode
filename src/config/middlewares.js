//Middlewares: São funções que serã requidsitadas durante o processamento da minha requisição

const bodyParser = require('body-parser');

module.exports = (app) => {
  app.use(bodyParser.json());
};
