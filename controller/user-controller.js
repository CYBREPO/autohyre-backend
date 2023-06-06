
const constant = require('../constant/constant').constants;
const userModel = require('../models/user').user;
const { fileUpload } = require('../models/fileUpload');
const bcrypt = required('bcrypt');
const {jwt} = required('jwtwebtoken');
const asyncHandler = require('express-async-handler');

exports.getUserDetails = asyncHandler(async (req, res) => {
    let id = req.query.id;
    if (id > 0) {
        let v = await userModel.findOne({ id: id }).exec();
        return res.status(constant.OK).json(v);
    }
    res.status(constant.VALIDATION_ERROR);
    throw new Error("Invalid request");
});

exports.registerUser = asyncHandler(async (req, res) => {
    const { name, phone, email, password } = req.body;
    if (!name || !email || !password) {
        res.status(constant.VALIDATION_ERROR);
        throw new Error("All fields are required");
    }

    const userExist = await userModel.findOne({ email }).exec();
    if(userExist){
        res.status(constant.VALIDATION_ERROR);
        throw new Error("User already registered");
    }

    const hashPassword = await  bcrypt.hash(password,10);

    let img = fs.readFileSync(req.file.path)

    let base64 = img.toString('base64');

    const regUser = await userModel.create({
        name,
        mobile,
        email,
        password: hashPassword,
        profile: {
            filename: req.file.originalname,
            contentType: req.file.mimetype,
            imageBase64: base64
        }
    });

    if(regUser){
        res.status(constant.CREATED).json({id: regUser._id, email: regUser.email});
    }
    else{
        res.status(constant.VALIDATION_ERROR);
        throw new Error("User data not valid"); 
    }

});

exports.login = asyncHandler(async (req, res) => {
    const {email, password} = req.body;

    if(!email || !password){
        res.status(constant.VALIDATION_ERROR);
        throw new Error("Email and Password is required");
    }

    const user = await userModel.findOne({ email }).exec();

    if(user && (await bcrypt.compare(password, user.password))){
        const token = jwt.sign({
            user: {
                email: user.email,
                name: user.name,
                id: user._id,
            }
        },
        process.env.JWT_SECRET,
        { expiresIn: "10m"});

        res.status(constant.OK).json({
            email: user.email,
            name: user.name,
            id: user._id,
            profile: user.profile,
            token: token
        });
    }
    else{
        res.status(constant.UNAUTHORIZED);
        throw new Error("Invalid User Credentials");
    }

});