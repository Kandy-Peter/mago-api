import bcrypt from "bcryptjs";
import luxon from "luxon";
import { nanoid } from "nanoid";

//TODO Add provider for phone_number(this hosuld a be a helper function)

module.exports = (sequelize: any, DataTypes: any) => {
  const User = sequelize.define(
    "User",
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.BIGINT,
        autoIncrement: true,
      },
      full_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: { type: DataTypes.STRING, allowNull: false, unique: true },
      phone_number: { type: DataTypes.STRING, allowNull: true, unique: true },
      password: { type: DataTypes.STRING, allowNull: false },
      is_verified: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      is_active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      is_account_active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      account_type: {
        type: DataTypes.ENUM("personal_account", "forex_bureau"),
        allowNull: false,
        defaultValue: "personal_account",
      },
      terms_accepted: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      public_id: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: () => nanoid(10),
      },
      avatar: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue:
          "https://res.cloudinary.com/dollarmarket/image/upload/v1694705732/mago/1496676191-jd18_84601_arz7ew.png",
      },
      last_login: { type: DataTypes.DATE, allowNull: true },
      provider: {
        type: DataTypes.ENUM("local", "google"),
        allowNull: false,
        defaultValue: "local",
      },
    },
    {
      tableName: "users",
      underscored: true,
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      hooks: {
        beforeCreate: async (user: any) => {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
        },
        beforeUpdate: async (user: any) => {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
        },
      },
    }
  );

  User.associate = (models: any) => {
    User.hasOne(models.ForexBureau, {
      foreignKey: "user_id",
      as: "forex_bureau",
    });
  };

  return User;
};
