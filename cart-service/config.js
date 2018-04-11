module.exports = {
  db: {
    client: 'pg', //postgres
    connection: {
      host: 'baasu.db.elephantsql.com',
      user: 'wlgrkbrf',
      password: '3L-Yr_EdlnwGEkVWcGgD4T5k0D-rfJz1',
      database: 'wlgrkbrf'
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
