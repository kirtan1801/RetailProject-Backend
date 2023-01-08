const { Sequelize } = require('sequelize');
const sequelize = require('sequelize');
const db = require('../utils/database');

const reviewSchema = db.define('reviews', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
    idProduct: {
        type: sequelize.INTEGER,
        // allowNull: false,
    },
    idUser: {
        type: Sequelize.INTEGER,
        // allowNull: false,
    },
    rating: {
        type: Sequelize.INTEGER,
        // allowNull: false,
    },
    description: {
        type: Sequelize.STRING,
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

module.exports = reviewSchema;
