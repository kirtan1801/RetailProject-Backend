const Sequelize = require('sequelize');
const db = require('../utils/database');

const userSchema = db.define('users', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    email: {
        // need to check. Even if this got failed, id got incremented.
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
    },
    phoneNumber: {
        type: Sequelize.NUMBER,
        allowNull: false,
    },
    alternateNumber: {
        type: Sequelize.NUMBER,
    },
    address: {
        type: Sequelize.JSON,
        allowNull: false,
    },
    role: {
        type: Sequelize.ENUM('admin', 'user'),
    },
    password: {
        //need to validate password
        type: Sequelize.STRING,
        allowNull: false,
    },
    passwordChangedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
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

module.exports = userSchema;
