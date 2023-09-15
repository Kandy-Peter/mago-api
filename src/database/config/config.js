require('dotenv').config();

const pool = {
  max: 25,
  min: 0,
  acquire: 60000,
  idle: 10000,
}

const config = {
  development: {
    use_env_variable: 'DATABASE_URL',
    dialect: 'postgres',
    logging: false,
    seederStorage: 'sequelize',
    pool,
  },
  test: {
    use_env_variable: 'DATABASE_URL_TEST',
    dialect: 'postgres',
    logging: false,
    seederStorages: 'sequelize',
    pool,
  },
  production: {
    use_env_variable: 'DATABASE_URL',
    dialect: 'postgres',
    logging: false,
    seedStorage: 'sequelize',
    pool,
  },
};

module.exports = config;