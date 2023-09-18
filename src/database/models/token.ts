import * as luxon from "luxon";

module.exports = (sequelize: any, DataTypes: any) => {
  const Token = sequelize.define(
    "Token",
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.BIGINT,
        autoIncrement: true,
      },
      token: DataTypes.TEXT,
      os: DataTypes.STRING,
      user_id: {
        type: DataTypes.BIGINT,
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
