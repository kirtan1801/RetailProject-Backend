const Acc = require('../model/accountModel');
const Order = require('../model/orderModel');
const fact = require('./handlerFactory');
const bcrypt = require('bcrypt');

exports.createBankDetails = async (req, res, next) => {
    try {
        console.log(JSON.stringify(req.user));
        const hashedAccHolderName = await bcrypt.hash(
            req.body.accHolderName,
            10
        );
        const hashedBankName = await bcrypt.hash(req.body.bankName, 10);
        const hashedBranch = await bcrypt.hash(req.body.branch, 10);
        const hashedIFCS = await bcrypt.hash(req.body.ifscCode, 10);
        const orderDetails = await Order.findOne({
            where: { id: req.body.idOrder },
        });
        const data = await Acc.create({
            idUser: req.user.id,
            idOrder: orderDetails.id,
            totalAmount: orderDetails.grandTotal,
            accHolderName: hashedAccHolderName,
            bankName: hashedBankName,
            branch: hashedBranch,
            ifscCode: hashedIFCS,
        });
        res.status(201).json({
            status: 'success',
            data: {
                data,
            },
        });
    } catch (err) {
        res.status(404).json({
            status: 'failed',
            message: err,
        });
    }
};
