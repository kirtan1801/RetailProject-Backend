const Promocode = require('../model/promocodeModel');
const fact = require('./handlerFactory');

exports.createPromocode = fact.createOne(Promocode);
exports.deletePromocode = fact.deleteOne(Promocode);
exports.getAllPromocode = fact.getAll(Promocode);

exports.bulkDeactivatePromocode = async (req, res, next) => {
    try {
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
    } catch (err) {
        res.status(400).json({
            status: 'failed',
            error: err,
        });
    }
};
