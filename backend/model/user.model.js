module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define(
      "user",
      {
        user_id: {
          type: Sequelize.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        firstname: {
          type: Sequelize.STRING,
        },
        lastname: {
          type: Sequelize.STRING,
        },
        email: {
          type: Sequelize.STRING,
          unique: true,
        },
        password: {
          type: Sequelize.STRING,
          unique: true,
        },
        token: {
          type: Sequelize.STRING,
        },
        expiretoken: {
          type: Sequelize.STRING,
        },

      },
      {
        tableName: "user",
        timestamps: true, // disable the automatic adding of createdAt and    updatedAt columns
        underscored: true,
      }
    );
    return User;
  };
  