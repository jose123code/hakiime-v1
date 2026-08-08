module.exports = {
  HOST: "localhost",
  USER: "hkmroot",
  PASSWORD: "bi@+%pa1",
  DB: "hkmsystem_development",
  dialect: "mysql",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
};
