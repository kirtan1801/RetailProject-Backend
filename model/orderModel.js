const Sequelize = require('sequelize');
const db = require('../utils/database');
const User = require('./userModel');

const order = db.define('orders', {
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
    orderJson: {
        type: Sequelize.JSON,
        allowNull: false,
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

User.hasMany(order, { foreignKey: 'idUser', targetKey: 'id' });
order.belongsTo(User, { foreignKey: 'idUser', targetKey: 'id' });

module.exports = order;
