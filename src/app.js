const app = require('express')();
const consign = require('consign');
const knex = require('knex');
const knexfile = require('../knexfile');
//const knexLogger = require('knex-logger');
const bodyParser = require('body-parser');


app.use(bodyParser.json())

//TODO criar chaveamento dinâmico
app.db = knex(knexfile.test);

//app.use(knexLogger(app.db));

consign({ cwd: 'src' }) //informa o diretorio padrão src
  .include('./config/passport.js')
  .then('./config/middlewares.js') //inclui o arquivo dentro da app
  .then('./services')
  .then('./routes') //adicionei todas as rotas dentro do app
  .then('./config/routes.js')
  .into(app);

app.get('/', (req, res) => {
  res.status(200).send();
});

app.use((err, req, res, next) => {
  const { name, message, stack } = err;
  if (name == 'ValidationError') res.status(400).json({ error: message });
  else res.status(500).json({ name, message, stack });
  next(err);
});

/* //outra forma de LOGAR sem usar o knex-logger
app.db.on('query', (query) => {
  //console.log({ sql: query.sql, bindings: query.bindings ? query.bindings.join(',') : '' });
}).on('query-response', (response) => {
  //console.log(response);
}).on('error', error => console.log(error));
 */

module.exports = app;
