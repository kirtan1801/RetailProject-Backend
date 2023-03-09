const Sequelize = require('sequelize');
const db = require('../utils/database');
const User = require('./userModel');
const Product = require('./productsModels');
const Promocode = require('./promocodeModel');

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
        type: Sequelize.INTEGER,
    },
    quantity: {
        type: Sequelize.NUMBER,
        default: 1,
    },
    idPromocode: {
        type: Sequelize.STRING,
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

User.hasMany(cart, { foreignKey: 'idUser', targetKey: 'id' });
cart.belongsTo(User, { foreignKey: 'idUser', targetKey: 'id' });

Product.hasMany(cart, { foreignKey: 'idProduct', targetKey: 'id' });
cart.belongsTo(Product, { foreignKey: 'idProduct', targetKey: 'id' });

Promocode.hasMany(cart, { foreignKey: 'idPromocode', targetKey: 'id' });
cart.belongsTo(Promocode, { foreignKey: 'idPromocode', targetKey: 'id' });

module.exports = cart;
