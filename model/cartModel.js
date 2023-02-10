const Sequelize = require('sequelize');
const db = require('../utils/database');

const cart = db.define('cart', {
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
    idProduct: {
        type: Sequelize.NUMBER,
        allowNull: false,
    },
    quantity: {
        type: Sequelize.NUMBER,
        default: 1,
    },
    total: {
        type: Sequelize.NUMBER,
        allowNull: false,
    },
    orderFlag: {
        type: Sequelize.NUMBER,
        default: false,
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

module.exports = cart;
