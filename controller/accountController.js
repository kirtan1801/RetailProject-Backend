const Acc = require('../model/accountModel');
const Order = require('../model/orderModel');
const fact = require('./handlerFactory');
const bcrypt = require('bcrypt');
const catchAsync = require('../utils/catchAsync');

exports.createBankDetails = catchAsync(async (req, res, next) => {
    // console.log(JSON.stringify(req.user));
    const hashedAccHolderName = await bcrypt.hash(req.body.accHolderName, 10);
    const hashedBankName = await bcrypt.hash(req.body.bankName, 10);
    const hashedBranch = await bcrypt.hash(req.body.branch, 10);
    const hashedIFCS = await bcrypt.hash(req.body.ifscCode, 10);
    const data = await Acc.create({
        idUser: req.user.id,
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
});
