require('dotenv').config();
import { Sequelize, DataTypes } from 'sequelize';
import { readdirSync } from 'fs';
import { basename as _basename, join } from 'path';

const env = process.env.NODE_ENV || 'development';
const config = require(join(__dirname, '..', 'config', 'config.js'))[env];

const basename = _basename(__filename);
const db: any = {};

let sequelize: any;

if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable] as string, config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

readdirSync(__dirname)
  .filter((file: any) => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.ts');
  }
  )
  .forEach((file: any) => {
    const model = require(join(__dirname, file))(sequelize, DataTypes);
    db[model.name] = model;
  }
  );

Object.keys(db).forEach((modelName: any) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
}
);

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
