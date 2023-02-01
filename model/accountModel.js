const Sequelize = require('sequelize');
const db = require('../utils/database');

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
    idOrder: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    totalAmount: {
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

module.exports = accountSchema;
