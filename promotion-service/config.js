module.exports = {
  db: {
    client: 'pg', //postgres
    connection: {
      host: 'baasu.db.elephantsql.com',
      user: 'fahhissl',
      password: 'huXtp67qlCepa_DeaAAwKVV4GHdH8XU2',
      database: 'fahhissl'
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
  messageBrokerAddress: "http://localhost:8000",
  redisPort: process.env.REDIS_PORT || 6379
}
