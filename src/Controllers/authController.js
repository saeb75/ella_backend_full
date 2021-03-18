const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const shortid = require("shortid");
const User = require("../Models/user");
var nodemailer = require("nodemailer");
const user = require("../Models/user");
const path = require("path");

exports.getUsers = (req, res) => {
  user.find().exec((err, _user) => {
    if (err) return err;

    if (_user) {
      return res.json(_user);
    }
  });
};

exports.registerUser = (req, res) => {
  let { firstName, lastName, email, password } = req.body;
  let userObj = {
    firstName,
    lastName,
    email,
    password,
    role: "user",
  };
  console.log(firstName, lastName, email, password);

  const error = validationResult(req);
  if (!error.isEmpty()) {
    res.json(error);
  } else {
    user.findOne({ email }).exec((err, myEmail) => {
      if (err) return res.status(400).json(err);
      if (myEmail) {
        return res.json({
          success: false,
          msg: "با این ایمیل قبلا ثبت نام شده است",
        });
      }
      let token = jwt.sign(userObj, process.env.ACTIVATION_JWT, {
        expiresIn: "15m",
      });

      var transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "saebfat@gmail.com",
          pass: "saeb123876",
        },
        tls: {
          // do not fail on invalid certs
          rejectUnauthorized: false,
        },
      });

      var mailOptions = {
        from: "saebfat@gmail.com",
        to: email,
        subject: `hi ${firstName}`,
        text: `this is a email from saeb jafari`,
        html: `<p>hello ${firstName}</p>
              <p>For Activation Click the Activation button</p>

             <a style={padding:'20px',background-color : blue, display:block} href='http://localhost:3000/active/account/${token}'>فعال سازی حساب کاربری</a>
      `,
      };

      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          return res.json({
            err: error,
            error: "دوباره امتحان کنید",
            success: false,
          });
        } else {
          res.json({
            msg: "لینک فعل سازی حساب کاربری به ایمیل شما ارسال شد",
            success: true,
          });
        }
      });
    });
  }
};

exports.activateUserAccount = (req, res) => {
  let { token } = req.body;
  console.log(token);
  if (token) {
    jwt.verify(token, process.env.ACTIVATION_JWT, async (err, decode) => {
      if (err) {
        return res.status(400).json({
          success: false,
          msg: "دوباره امتحان کنید",
        });
      }
      if (decode) {
        const { email, firstName, lastName, role, password, gender } = decode;
        const hashed_password = await bcrypt.hash(password, 10);
        let user = new User({
          email,
          firstName,
          userName: shortid.generate(),
          lastName,
          gender,
          role,
          hashed_password,
        });
        user.save((err, user) => {
          if (err) return res.status(400).json(err);
          if (user) {
            return res.json({
              success: true,
              msg: "ثبت نام شما با موفقیت انجام شد",
            });
          }
        });
      }
    });
  } else {
    return res.status(400).json({ success: false });
  }
};

exports.getAllEmail = (req, res) => {
  user
    .find({})
    .select("email")
    .exec((err, emails) => {
      if (err) return err;
      if (emails) {
        return res.json(emails);
      }
    });
};

exports.signinUser = (req, res) => {
  const { email, password } = req.body;

  user.findOne({ email }).exec((err, user) => {
    if (err || !user)
      return res.status(400).json({
        success: false,
        msg: "هیچ کاربری با این ایمیل وجود ندارد لطفا ثبت نام کنید",
      });
    if (user) {
      const {
        _id,
        email,
        role,
        fullName,
        firstName,
        lastName,
        profilePicture,
      } = user;

      if (user.authenticate(req.body.password) && role == "user") {
        let token = jwt.sign(
          { user: { _id, role, email, firstName, lastName, profilePicture } },
          process.env.LOGIN_JWT,
          {
            expiresIn: "24h",
          }
        );
        return res.json({
          token,
          msg: "با موفقیت ثبت نام کردید",
        });
      } else {
        return res
          .status(400)
          .json({ msg: "رمز و یا نام کاربری شما اشتباه است" });
      }
    }
  });
};
