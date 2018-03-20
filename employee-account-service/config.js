module.exports = {
  db: {
    client: 'pg', //postgres
    connection: {
      host: 'stampy.db.elephantsql.com',
      user: 'mxxsdeqt',
      password: 'RrIDhy6eZDGD2sEjQcysLp2g4LE9GGuS',
      database: 'mxxsdeqt'
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
  secretjwt: 'sensitivecontentpleasedontreadthxbye',
  messageBrokerAddress: "http://localhost:8000"
}
