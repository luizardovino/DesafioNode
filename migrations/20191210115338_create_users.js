
exports.up = (knex) => {
  return knex.schema.createTable('users', (t) => {
    t.increments('id').primary();
    t.string('name').notNull();
    t.string('mail').notNull().unique();
    t.string('passwd').notNull();
    t.datetime('data_criacao');
    t.datetime('data_atualizacao');
    t.datetime('ultimo_login');
    t.string('token');
    t.string('telefones');
  });
};

exports.down = (knex) => {
  return knex.schema.dropTable('users');
};
