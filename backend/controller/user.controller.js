const db = require("../model");
const constants = require("../constants/constants");
const User = db.user;
const { user } = require("../model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { has, result } = require("lodash");
require("dotenv").config();

exports.create = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      Email,
      Password,
    } = req.body;
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(Password, salt);

    const tokenDetails = {
      firstname: firstName,
      email: Email,
    };

    const jwttoken = jwt.sign(tokenDetails, process.env.ACCESS_TOKEN_SECRET, {
      noTimestamp: true,
    });


    let responseObj = {
      token: jwttoken,
    };

    await User.create({
      firstname: firstName,
      lastname: lastName,
      email: Email,
      password: hashPassword,
      token: jwttoken,
      expiretoken: ""
    }).then((data) => {
      resobj = {
        status: constants.SUCCESS,
        success: true,
        message: "",
        data: { ...responseObj, user_id: result.user_id },
      };
    }).catch((err) => {
      resobj = {
        status: constants.SERVER_ERROR,
        success: false,
        message: "Some error occurred while creating the Account.",
        data: { ...responseObj, user_id: result.user_id, err },
      };
    });
    return res.send(resobj);

  } catch (err) {
    return res.status(500).send({
      status: constants.SERVER_ERROR,
      success: false,
      message: "Internal error please try again",
      data: {},
    });
  }
}


// User authentication while login

exports.authenticate = async (req, res) => {
  try {

    let resobj = {
      status: "",
      success: false,
      message: "",
      data: {},
    };

    let resData = {};
    const { email, password } = req.body;

    await user.findOne({ where: { email } }).then(async (user, err) => {
      if (err) {
        resobj.status = constants.SERVER_ERROR;
        resobj.success = false;
        resobj.message = "Internal error please try again";
      } else if (!user) {
        resobj.status = constants.UNAUTHORIZED;
        resobj.success = false;
        resobj.message = constants.AUTHENTICATAION_FAILED_MESSGAE;
      } else {
        await bcrypt.compare(password, user.password)
          .then(async (res, err) => {
            if (err) {
              resobj.status = constants.SERVER_ERROR;
              resobj.success = false;
              resobj.message = "Internal error please try again";
            } else if (!res) {
              resobj.status = constants.UNAUTHORIZED;
              resobj.success = false;
              resobj.message = constants.AUTHENTICATAION_FAILED_MESSGAE;
            } else {
              const authHeader = req.headers["authorization"];
              const token = authHeader && authHeader.split(" ")[1];
              if (token == null) {
                const tokenDetails = {
                  firstname: user.firstname,
                  email: email,
                };
                const jwttoken = jwt.sign(
                  tokenDetails,
                  process.env.ACCESS_TOKEN_SECRET,
                  {
                    noTimestamp: true,
                  }
                );
                user.token = jwttoken;
                resData.email = email;
                resData.user_id = user.user_id;
                await user.save().then((result) => {
                   resData.token = jwttoken;
                });
              }
            }
          })
      }
    })
    console.log(resobj);
    return res.send(resobj);
  } catch (error) {
    return res.status(500).send({
      status: constants.SERVER_ERROR,
      success: false,
      message: "Internal error please try again",
      data: {},
    });
  }
}