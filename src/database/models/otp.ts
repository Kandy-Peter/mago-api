import { nanoid } from "nanoid";
import moment from "moment";

module.exports = (sequelize: any, DataTypes: any) => {
  const OTP = sequelize.define(
    "OTP",
    {
      id: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
        defaultValue: () => nanoid(15),
      },
      user_id: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
          model: "User",
          key: "id",
        },
      },
      otp: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      is_used: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      expires_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: moment().add(15, "minutes").toDate(),
      },
    },
    {
      tableName: "otp",
      timestamps: true,
      underscored: true,
    }
  );

  OTP.associate = (models: any) => {
    OTP.belongsTo(models.User, {
      foreignKey: "user_id",
      as: "user",
    });
  }

  return OTP;
};
