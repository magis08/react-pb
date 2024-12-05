module.exports = {
    development: {
      username: 'agis',
      password: '12345',
      database: 'db_pb',
      host: 'localhost',
      dialect: 'postgres'
    },
    test: {
      username: 'root',
      password: null,
      database: 'db_test',
      host: '127.0.0.1',
      dialect: 'postgres'
    },
    production: {
      username: 'root',
      password: null,
      database: 'db_prod',
      host: '127.0.0.1',
      dialect: 'postgres'
    }
  };
  