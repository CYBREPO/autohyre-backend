const fs = require('fs');
const fileUpload = require('../models/fileUpload');

exports.Uploads = async (req, vehicleDtls) => {
    try {
        const files = req.files;
        // if(!files){
        //     const error = new Error('Please choose files');
        //     error.httpStatusCode = 400;
        //     return next(error)
        // }

        // convert images into base64 encoding
        let imgArray = files.map((file) => {
            let img = fs.readFileSync(file.path)

            return img.toString('base64')
        })

        let result = imgArray.map(async (src, index) => {

            // create object to store data in the collection
            let finalImg = {
                filename: files[index].originalname,
                contentType: files[index].mimetype,
                imageBase64: src,
                vehicleId: vehicleDtls._id,
            }

            let newUpload = new fileUpload.fileUpload(finalImg);

            let result;
            result = await newUpload.save();

        });
        return { message: "Successfully updated" }
    }
    catch (ex) {
        return { message: ex.message };
    }

};

exports.SingleUpload = async (req, vehicleDtls) => {
    try {
        const file = req.file;
        // if(!files){
        //     const error = new Error('Please choose files');
        //     error.httpStatusCode = 400;
        //     return next(error)
        // }

        // convert images into base64 encoding
        let img = fs.readFileSync(file.path)

        let base64 = img.toString('base64');

        let finalImg = {
            filename: files[index].originalname,
            contentType: files[index].mimetype,
            imageBase64: base64,
        }

        let result = imgArray.map(async (src, index) => {

            // create object to store data in the collection
            let finalImg = {
                filename: files[index].originalname,
                contentType: files[index].mimetype,
                imageBase64: src,
                vehicleId: vehicleDtls._id,
            }

            let newUpload = new fileUpload.fileUpload(finalImg);

            let result;
            result = await newUpload.save();

        });
        return { message: "Successfully updated" }
    }
    catch (ex) {
        return { message: ex.message };
    }

};