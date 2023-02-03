const Sequelize = require('sequelize');
const db = require('../utils/database');

const productSchema = db.define('product', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
    productName: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    category: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    varient: {
        type: Sequelize.STRING,
    },
    price: {
        type: Sequelize.NUMBER,
        allowNull: false,
    },
    brand: {
        type: Sequelize.STRING,
    },
    description: {
        type: Sequelize.STRING,
    },
    averageRating: {
        type: Sequelize.NUMBER,
        default: 0,
    },
    totalRatings: {
        type: Sequelize.NUMBER,
        default: 0,
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

module.exports = productSchema;
