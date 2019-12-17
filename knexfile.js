module.exports = {
  test: {
    client: 'pg',
    version: '9.6',
    connection: {
      host: 'localhost',
      user: 'postgres',
      password: 'acservic',
      database: 'dbfinanceiro',
    },
    migration: {
      directory: 'src/migrations',
    },
  },

  prod: {
    client: 'pg',
    version: '9.6',
    connection: {
      host: 'localhost',
      user: 'postgres',
      password: 'acservic',
      database: 'dbDesafioProd',
    },
    migration: {
      directory: 'src/migrations',
    },
  },
};
