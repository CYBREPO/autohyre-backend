const constant = require('../constant/constant').constants;
const errorHandler = (err, req, res, next) => {
    const errStatus = res.statusCode ?? 500;

    switch (errStatus) {
        case constant.FORBIDDEN:
            res.json({ title: "FORBIDDEN", message: err.message, stackTrace: err.stackTrace });
            break;
        case constant.UNAUTHORIZED:
            res.json({ title: "UNAUTHORIZED", message: err.message, stackTrace: err.stackTrace });
            break;
        case constant.NOT_FOUND:
            res.json({ title: "NOT FOUND", message: err.message, stackTrace: err.stackTrace });
            break;
        case constant.SERVER_ERROR:
            res.json({ title: "SERVER ERROR", message: err.message, stackTrace: err.stackTrace });
            break;
        default: 
            break

    }
}

exports.errorHandler = errorHandler