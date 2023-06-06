const model = require('../models/brands');
const constant = require('../constant/constant').constants;
const fs = require('fs');

let brandModel = model.vehicle_brand;

exports.getBrands = async (req, res) => {
    try {
        let id = req.params.id;
        if (id > 0) {
            let v = await brandModel.findOne({ id: id }).exec();
            return res.status(constant.OK).json(v);
        }

    }
    catch (ex) {
        return res.status(constant.VALIDATION_ERROR).json({ errorMessage: ex.message });
    }

}
exports.getAllBrands = async (req, res) => {
    try {
        // let id = req.params.id;
        // {
        let v = await brandModel.find().exec();
        return res.status(constant.OK).json(v);
        // }

    }
    catch (ex) {
        return res.status(constant.VALIDATION_ERROR).json({ errorMessage: ex.message });
    }

}

exports.setBrands = async (req, res) => {
    try {
        if (req.body) {
            let img = fs.readFileSync(req.file.path)

            let base64 = img.toString('base64');

            let finalImg = {
                image: {
                    filename: req.file.originalname,
                    contentType: req.file.mimetype,
                    imageBase64: base64
                },
                name: req.body.name,
            }

            let brand = new brandModel(finalImg);

            let result;
            result = await brand.save();

            if (result) {
                return res.status(constant.OK).json({ "message": "Success" });
            }

            return res.status(constant.VALIDATION_ERROR).json({ "message": "Error" });
        }


    }
    catch (ex) {
        return res.status(constant.VALIDATION_ERROR).json({ errorMessage: ex.message });
    }

}