const Sequelize = require('sequelize');
const db = require('../utils/database');

const promocodeSchema = db.define('promocode', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
    promocode: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    discount: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    validTill: {
        type: Sequelize.DATE,
        allowNull: false,
    },
    active: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
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

module.exports = promocodeSchema;
