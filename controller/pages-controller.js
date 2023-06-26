const asyncHandler = require('express-async-handler');
const pageModel = require('../models/pages').page;
const constant = require('../constant/constant').constants;
const aboutusModel = require('../models/aboutus').aboutus;
const homeModel = require('../models/home').home;
const fileUploadController = require('./fileUpload-controller');


exports.getPages = asyncHandler(async (req, res) => {
    let result = await pageModel.find().exec();
    const totalCount = await pageModel.countDocuments();

    if (result) {
        return res.status(constant.OK).json({ success: true, data: result, count: totalCount });
    }
    res.status(constant.VALIDATION_ERROR);
    throw new Error("Something went wrong");
});

exports.deletePages = asyncHandler(async (req, res) => {
    if (req.query.id) {
        let result = pageModel.findByIdAndDelete(req.query.id).exec();

        if (result) {
            return res.status(constant.OK).json({ success: true, data: result });
        }
        res.status(constant.VALIDATION_ERROR);
        throw new Error("Something went wrong");
    }
    res.status(constant.VALIDATION_ERROR);
    throw new Error("Invalid Request");

});

exports.savePage = asyncHandler(async (req, res) => {
    if (req.body) {
        let images = [];
        if (req.files) {
            // const arr = await fileUploadController.Uploads(req.files);

            // arr.map((src, index) => {
            //     images.push({
            //         filename: req.files[index].originalname,
            //         contentType: req.files[index].mimetype,
            //         imageBase64: src
            //     });
            // });

        }

        let result = pageModel.create({
            name: req.body.name,
            description: req.body.description,
            images: images,

        });

        if (result)
            return res.status(constant.OK).json({ success: true, message: 'Data saved' });

        res.status(constant.VALIDATION_ERROR);
        throw new Error('Something went wrong');

    }
    res.status(constant.VALIDATION_ERROR);
    throw new Error("Invalid Request");
});

exports.updatePage = asyncHandler(async (req, res) => {
    if (req.body) {
        let images = [];
        if (req.files) {
            // const arr = await fileUploadController.Uploads(req.files);

            // arr.map((src, index) => {
            //     images.push({
            //         filename: req.files[index].originalname,
            //         contentType: req.files[index].mimetype,
            //         imageBase64: src
            //     });
            // });

        }

        let result = pageModel.findByIdAndUpdate(req.body.id, {
            name: req.body.name,
            description: req.body.description,
            images: images,

        });

        if (result)
            return res.status(constant.OK).json({ success: true, message: 'Data saved' });

        res.status(constant.VALIDATION_ERROR);
        throw new Error('Something went wrong');

    }
    res.status(constant.VALIDATION_ERROR);
    throw new Error("Invalid Request");
});

exports.getAboutus = asyncHandler(async (req, res) => {
    const result = await aboutusModel.findOne().exec();
    if (result) {
        return res.status(constant.OK).json({ success: true, data: result });
    }
    res.status(constant.VALIDATION_ERROR);
    throw new Error("Not Found");
});

exports.saveAboutus = asyncHandler(async (req, res) => {
    if (req.body) {
        const { bannerImg, mainImg } = req.files;

        const result = await aboutusModel.create({
            header: req.body.header,
            bannerImg: bannerImg[0].path.replace('\\','/').split('uploads/')[1],
            mainImg: mainImg[0].path.replace('\\','/').split('uploads/')[1],
            body: req.body.body,
            footer: req.body.footer,
        });

        if (result) {
            return res.status(constant.OK).json({ success: true, message: "About us saved successfully" });
        }
        res.status(constant.VALIDATION_ERROR);
        throw new Error('Something went wrong');

    }
    res.status(constant.VALIDATION_ERROR);
    throw new Error('Invalid request');
});

exports.updateAboutus = asyncHandler(async (req, res) => {
    if (req.body) {

        const { bannerImg, mainImg } = req.files;

        let param = {
            header: req.body.header,
            body: req.body.body,
            footer: req.body.footer,
        };

        if (bannerImg)
            param["bannerImg"] = bannerImg[0].path.replace('\\','/').split('uploads/')[1];

        if (mainImg)
            param["mainImg"] = mainImg[0].path.replace('\\','/').split('uploads/')[1];

        const result = await aboutusModel.updateOne({ _id: req.body.id }, { $set: param });

        if (result) {
            let imgs = [];
            if (result.bannerImg && bannerImg)
                imgs.push(result.bannerImg);

            if (result.mainImg && mainImg)
                imgs.push(result.mainImg);

            if (imgs && imgs.length > 0)
                fileUploadController.removeFiles(imgs);
            return res.status(constant.OK).json({ success: true, message: "about us saved successfully" });
        }
        res.status(constant.VALIDATION_ERROR);
        throw new Error('Something went wrong');

    }
    res.status(constant.VALIDATION_ERROR);
    throw new Error('Invalid request');
});

exports.getHome = asyncHandler(async (req, res) => {
    const result = await homeModel.findOne({}).exec();
    if (result) {
        return res.status(constant.OK).json({ success: true, data: result });
    }
    res.status(constant.VALIDATION_ERROR);
    throw new Error("Not Found");
});

exports.saveHome = asyncHandler(async (req, res) => {
    if (req.body) {
        const { bannerImages, mainImg } = req.files;

        const result = await homeModel.create({
            bannerContent: req.body.bannerContent,
            header: req.body.header,
            bannerImages: bannerImages.map(m => m.path.replace('\\','/').split('uploads/')[1]),
            mainImg: mainImg[0].path.replace('\\','/').split('uploads/')[1],
            body: req.body.body,
            footer: req.body.footer,
        });

        if (result) {
            return res.status(constant.OK).json({ success: true, message: "Home page saved successfully" });
        }
        res.status(constant.VALIDATION_ERROR);
        throw new Error('Something went wrong');

    }
    res.status(constant.VALIDATION_ERROR);
    throw new Error("Invalid Request");
});

exports.updateHome = asyncHandler(async (req, res) => {
    if (req.body) {
        const { bannerImages, mainImg } = req.files;
        console.log(req.files);
        let param = {
            bannerContent: req.body.bannerContent,
            header: req.body.header,
            body: req.body.body,
            footer: req.body.footer,
        }

        if (bannerImages && bannerImages.length > 0) {
            param['bannerImages'] = bannerImages.map(m => m.path.replace('\\','/').split('uploads/')[1]);
        }

        if (mainImg) {
            param['mainImg'] = mainImg[0].path.replace('\\','/').split('uploads/')[1];
        }


        const result = await homeModel.updateOne({ _id: req.body.id }, param);

        if (result) {
            let imgs = [];
            if (result.bannerImages && bannerImages && bannerImages.length > 0)
                imgs.push(...result.bannerImages);

            if (result.mainImg && mainImg)
                imgs.push(result.mainImg);

            if (imgs && imgs.length > 0)
                fileUploadController.removeFiles(imgs);

            return res.status(constant.OK).json({ success: true, message: "Home page Updated successfully" });
        }
        res.status(constant.VALIDATION_ERROR);
        throw new Error('Something went wrong');

    }
    res.status(constant.VALIDATION_ERROR);
    throw new Error("Invalid Request");
});