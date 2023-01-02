const Sequelize = require('sequelize');
const db = require('../utils/database');

const project = db.define('orders', {
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
    orderType: {
        type: Sequelize.ENUM('saleOrder', 'returnOrder'),
    },
    idProduct: {
        type: Sequelize.NUMBER,
        allowNull: false,
    },
    quantity: {
        type: Sequelize.NUMBER,
        default: 1,
    },
    grandTotal: {
        type: Sequelize.NUMBER,
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

module.exports = project;
