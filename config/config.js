module.exports = {
  development: {
    username: "neondb_owner",
    password: "npg_FrTI0ZqmBl3t",
    database: "neondb",
    host: "ep-raspy-sun-ac0dgrh6-pooler.sa-east-1.aws.neon.tech",
    port: 5432,
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    }
  }
};
