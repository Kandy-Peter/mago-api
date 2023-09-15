module.exports = (sequelize: any, DataTypes: any) => {
  const ForexBureau = sequelize.define(
    "ForexBureau",
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
      country: { type: DataTypes.STRING, allowNull: false },
      bureau_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      bureau_email: { type: DataTypes.STRING, allowNull: false, unique: true },
      bureau_phone_number: { type: DataTypes.STRING, allowNull: true, unique: true },
      is_forex_verified: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      is_forex_account_active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      forex_avatar: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: "https://res.cloudinary.com/dollarmarket/image/upload/v1694708974/mago/money_dhei7j.png",
      },
      locations: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: false,
        defaultValue: [],
      },
    },
    {
      tableName: "forex_bureaus",
      timestamps: true,
      underscored: true,
    }
  );

  ForexBureau.associate = (models: any) => {
    ForexBureau.belongsTo(models.User, {
      foreignKey: "user_id",
      as: "user",
    });
  }

  return ForexBureau;
};

