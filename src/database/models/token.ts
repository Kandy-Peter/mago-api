import * as luxon from "luxon";
import { nanoid } from "nanoid";

module.exports = (sequelize: any, DataTypes: any) => {
  const Token = sequelize.define(
    "Token",
    {
      id: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
        defaultValue: () => nanoid(15),
      },
      token: DataTypes.TEXT,
      os: DataTypes.STRING,
      user_id: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
          model: "User",
          key: "id",
        },
      },
      expires: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: luxon.DateTime.utc().plus({ days: 30 }).toJSDate(),
      },
      blacklisted: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
    },
    {
      tableName: "tokens",
      timestamps: true,
      underscored: true,
    }
  );

  Token.associate = (models: any) => {
    Token.belongsTo(models.User, {
      foreignKey: "user_id",
      as: "user",
    });
  }

  return Token;
}
