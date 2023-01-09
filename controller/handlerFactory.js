const catchAsync = require('../utils/catchAsync');
const APIFeatures = require('../utils/apiFeatures');
const { Model } = require('sequelize');

//done
exports.deleteOne = (Model) => async (req, res, next) => {
    try {
        await Model.destroy({ where: { id: req.params.id } });
        res.status(204).json({
            status: 'success',
        });
    } catch (err) {
        res.status(404).json({
            status: 'failed',
        });
    }
};

//done
exports.createOne = (Model) => async (req, res, next) => {
    try {
        const data = await Model.create(req.body);
        res.status(201).json({
            status: 'success',
            data: {
                data,
            },
        });
    } catch (err) {
        res.status(400).json({
            status: 'failed',
            error: err,
        });
    }
};

exports.getOne = (Model, populateOptions) =>
    catchAsync(async (req, res, next) => {
        let query = Model.findById(req.params.id);
        if (populateOptions) query = query.populate(populateOptions);
        const data = await query;
        if (!data) {
            return next(new AppError('No data found with the given id', 404));
        }
        res.status(200).json({
            status: 'success',
            data: {
                data,
            },
        });
    });

//done
exports.getAll = (Model) => async (req, res, next) => {
    try {
        const queryObj = JSON.stringify(req.query);
        const data = await Model.findAll({ where: JSON.parse(queryObj) });
        res.status(200).json({
            status: 'success',
            results: data.length,
            data: {
                data,
            },
        });
    } catch (err) {
        res.status(404).json({
            status: 'failed',
        });
    }
};
