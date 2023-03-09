const Promocode = require('../model/promocodeModel');
const catchAsync = require('../utils/catchAsync');
const fact = require('./handlerFactory');

exports.createPromocode = fact.createOne(Promocode);
exports.deletePromocode = fact.deleteOne(Promocode);
exports.getAllPromocode = fact.getAll(Promocode);

exports.bulkDeactivatePromocode = catchAsync(async (req, res, next) => {
    const data = req.body.id;
    await Promocode.update(
        {
            active: false,
        },
        {
            where: { id: data },
        }
    );
    res.status(200).json({
        status: 'success',
        message: 'promocode deactivated successfully',
    });
});
