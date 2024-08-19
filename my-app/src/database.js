const db = require('knex')({
    client: 'sqlite3', 
    connection: {
      filename: './mydb.sqlite',
    },
  });



  // Create users table if it doesn't exist
  db.schema.hasTable('users').then(function (exists) {
    if (!exists) {
      return db.schema.createTable('users', function (t) {
        table.increments('id').primary();
        table.string('username').notNullable().unique();
        table.string('password').notNullable();
      });
    }
  });

module.exports = db;