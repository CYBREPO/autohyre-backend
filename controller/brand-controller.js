const req = require('express/lib/request');
const model = require('../models/brands');
const constant = require('../constant/constant').constants;
const carModel = require('../models/carModel').carModel;
const asyncHandler = require('express-async-handler');

let brandModel = model.vehicle_brand;

exports.getBrandById = asyncHandler(async (req, res) => {
    let id = req.query.id;
    if (id != null && id != "") {
        let result = await brandModel.findOne({ _id: id }).populate('models').exec();
        return res.status(constant.OK).json({ success: true, data: result });
    }
    res.status(constant.VALIDATION_ERROR);
    throw new Error("Invalid request");
});

exports.getAllBrands = asyncHandler(async (req, res) => {
    let { pageSize, pageIndex, searchText} = req.body;
    let query = {};
    if (searchText && searchText != "") {
        query['$text'] = {$search: searchText};
    }
    const totalCount = await brandModel.countDocuments(query);
    if (totalCount > pageSize && pageSize > 0) {
        const result = await brandModel.find(query).skip((pageIndex - 1) * pageSize).limit(pageSize).exec();
        return res.status().json({ success: true, data: result, count: totalCount });
    }
    const result = await brandModel.find(query).exec();
    return res.status(constant.OK).json({ success: true, data: result, count: totalCount });

});

exports.getAllModels = asyncHandler(async (req, res) => {
    let { pageSize, pageIndex, searchText} = req.body;
    let query = {};
    if (searchText && searchText != "") {
        query['$text'] = {$search: searchText};
    }
    const totalCount = await carModel.countDocuments(query);
    if (pageSize) {
        let data = [];
        let result = await carModel.find(query).skip((pageIndex - 1) * pageSize).limit(pageSize).exec();
        let ids = result.map(m => m._id);
        const brands = await brandModel.find({ models: { $in: ids } }).exec();
    
        result.forEach(m => {
            let b = brands.find(x => (x.models?.length??0) > 0 ?  x.models.toString().includes(m._id.toString()) : false);

            data.push({_id: m._id.toString(),name: m.name,carCompany : b?.name??"",carCompanyId: b?._id??""})
  
        });
        return res.status(constant.OK).json({ success: true, data: data, count: totalCount });
    }

});

exports.setBrands = asyncHandler(async (req, res) => {
    if (req.body) {
        let finalImg = {
            image: req.file.path.split('uploads\\')[1],
            name: req.body.name,
            models: [],
            createdBy: req.user._id
        }

        let brand = new brandModel(finalImg);

        let result;
        result = await brand.save();

        if (result) {
            return res.status(constant.OK).json({ success: true, message: "Success" });
        }
    }
    res.status(constant.VALIDATION_ERROR);
    throw new Error("Invalid request");

});

exports.updateBrand = asyncHandler(async (req, res) => {
    if (req.body) {
        let update = {};
        if (req.file) {
            update['image'] = req.file.path.split('uploads\\')[1];
        }

        if (req.body.name != "" && req.body.name != null) {
            update['name'] = req.body.name;
        }

        update['modifiedBy'] = req.user._id;

        let result = await brandModel.findByIdAndUpdate(req.body.id, update, { new: true });

        if (result) {
            return res.status(constant.OK).json({ success: true, message: "data updated successfully" });
        }
        res.status(constant.VALIDATION_ERROR);
        throw new Error("Error occured");
    }
    res.status(constant.VALIDATION_ERROR);
    throw new Error("Invalid request");
});

exports.deleteBrand = asyncHandler(async (req, res) => {
    if (req.body) {

        let del = await brandModel.findByIdAndDelete(req.body.id);

        if (del) {
            //deleting models linked to the brand
            result = await carModel.deleteMany({ _id: { $in: del.models } });

            return res.status(200).json({ success: true, message: "Record deleted successfully" });
        }
        res.status(constant.VALIDATION_ERROR);
        throw new Error("Error occured");
    }
    res.status(constant.VALIDATION_ERROR);
    throw new Error("Invalid request");
});

exports.setModels = asyncHandler(async (req, res) => {
    if (req.body) {

        let result;
        let params = [];
        req.body.forEach(m => {
            params.push({ name: m.name });
        });

        //delete Previous ref
        let del = await brandModel.findByIdAndUpdate(req.body[0].brandId, { $pull: { models: {} } }, { new: true });

        if (del) {
            //delete Previous Records 
            result = await carModel.deleteMany({ _id: { $in: del.models } });

            //Add new record
            result = await carModel.insertMany(params);

            if (result) {
                let ids = result.map(x => x._id);
                //adding referance to brand
                await brandModel.findOneAndUpdate({ _id: req.body[0].brandId }, { $set: { models: ids } });
                return res.status(constant.OK).json({ success: true, message: "Success" });
            }
            res.status(constant.VALIDATION_ERROR);
            throw new Error("Error occured");
        }
        res.status(constant.VALIDATION_ERROR);
        throw new Error("Error occured");
    }
    res.status(constant.VALIDATION_ERROR);
    throw new Error("Invalid request");

});

exports.saveModel = asyncHandler(async (req, res) => {
    if (req.body) {

        let result;

        result = await carModel.create({name: req.body.name, createdBy: req.user._id});

        if (result) {
            const b = await brandModel.findByIdAndUpdate(req.body.brandId, { $push: { models: result._id } });
            
            return res.status(constant.OK).json({ success: true, message: "Success" });
        }
        res.status(constant.VALIDATION_ERROR);
        throw new Error("Error occured");
    }
    res.status(constant.VALIDATION_ERROR);
    throw new Error("Invalid request");

});

exports.updateModel = asyncHandler(async (req, res) => {
    if (req.body) {

        let result;

        result = await carModel.findByIdAndUpdate(req.body.id, {name: req.body.name, modifiedBy: req.user._id}).exec();

        if (result) {
            return res.status(constant.OK).json({ success: true, message: "Success" });
        }
        res.status(constant.VALIDATION_ERROR);
        throw new Error("Error occured");
    }
    res.status(constant.VALIDATION_ERROR);
    throw new Error("Invalid request");

});

exports.deleteModel = asyncHandler(async (req,res) => {
    if(req.query.id){
        let models = await carModel.findByIdAndDelete(req.query.id).exec();

        if(models){
            await brandModel.findOneAndUpdate({$pull : { models: {$in: models._id }}});

            return res.status(constant.OK).json({ success: true, message: "Success" });
        }
        res.status(constant.VALIDATION_ERROR);
        throw new Error("Error occured");
    }
    res.status(constant.VALIDATION_ERROR);
    throw new Error("Invalid request");
})