module.exports = (sequelize: any, DataTypes: any) => {
  const OTP = sequelize.define(
    "OTP",
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.BIGINT,
        autoIncrement: true,
      },
      user_id: {
        type: DataTypes.BIGINT,
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
        defaultValue: DataTypes.literal("CURRENT_TIMESTAMP + INTERVAL '15 minutes'"),
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
