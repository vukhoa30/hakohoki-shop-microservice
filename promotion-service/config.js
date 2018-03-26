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
  //redisLocalPort: process.env.REDIS_PORT || 6379,
  redisConnection: {
    host: 'redis-12106.c10.us-east-1-4.ec2.cloud.redislabs.com',
    port: 12106,
    password: uk5kk4dRB3cZmXJDvqc4LFwFKaLohkxH,
    db: promotion
  }
}
