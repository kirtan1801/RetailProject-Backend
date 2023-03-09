const Sequelize = require('sequelize');
const db = require('../utils/database');
const User = require('./userModel');

const accountSchema = db.define('accs', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
    idUser: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    accHolderName: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    bankName: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    branch: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    ifscCode: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    createdAt: {
        defaultValue: Sequelize.fn('now'),
        type: Sequelize.DATE,
    },
    updatedAt: {
        defaultValue: Sequelize.fn('now'),
        type: Sequelize.DATE,
    },
});

User.hasMany(accountSchema, { foreignKey: 'idUser', targetKey: 'id' });
accountSchema.belongsTo(User, { foreignKey: 'idUser', targetKey: 'id' });

module.exports = accountSchema;
