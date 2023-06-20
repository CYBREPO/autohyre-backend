const fs = require('fs');

exports.Uploads = async (files) => {
    try {
        // const files = req.files;
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


        return imgArray
    }
    catch (ex) {
        return [];
    }

};

exports.SingleUpload = async (file) => {
    try {
        // const file = req.file;
        // if(!file){
        //     const error = new Error('Please choose files');
        //     error.httpStatusCode = 400;
        //     return next(error)
        // }

        // convert images into base64 encoding
        let img = fs.readFileSync(file.path)

        let base64 = img.toString('base64');

        return base64
    }
    catch (ex) {
        return '';
    }

};

exports.removeFiles = async (filePaths) => {

    try {
        filePaths.forEach(filePath => {
            const pathToFile = "uploads\\" + filePath;
            fs.unlinkSync(pathToFile);
        });
        console.log("Successfully deleted the file.");

    } catch (err) {
        console.log("err",err.message);
    }
}