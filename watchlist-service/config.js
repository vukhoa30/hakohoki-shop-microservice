module.exports = {
  db: {
    client: 'pg', //postgres
    connection: {
      host: 'stampy.db.elephantsql.com',
      user: 'qipvtuhp',
      password: '-_0cbDVcfQQ4nLMFVXBCymjxhEa7Mz3J',
      database: 'qipvtuhp'
    },
    pool: {
      afterCreate: function (conn, done) {
        conn.query('SET timezone="UTC+7";', function (err) {
          if (err) {
            done(err, conn);
          } else {
            conn.query('SELECT set_limit(0.01);', function (err) {
              done(err, conn);
            });
          }
        });
      }
    }
  },
  amqpAddress: "amqp://localhost",
  defaultLimit: 15
}
