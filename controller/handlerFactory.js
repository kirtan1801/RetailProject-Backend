const catchAsync = require('../utils/catchAsync');
const APIFeatures = require('../utils/apiFeatures');
const { Model } = require('sequelize');

exports.deleteOne = (Model) =>
    catchAsync(async (req, res, next) => {
        await Model.destroy({ where: { id: req.params.id } });
        res.status(204).json({
            status: 'success',
        });
    });

exports.createOne = (Model) =>
    catchAsync(async (req, res, next) => {
        const data = await Model.create(req.body);
        res.status(201).json({
            status: 'success',
            data: {
                data,
            },
        });
    });

exports.getAll = (Model) =>
    catchAsync(async (req, res, next) => {
        const queryObj = JSON.stringify(req.query);
        const data = await Model.findAll({ where: JSON.parse(queryObj) });
        res.status(200).json({
            status: 'success',
            results: data.length,
            data: {
                data,
            },
        });
    });
