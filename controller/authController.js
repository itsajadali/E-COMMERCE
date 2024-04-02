/* eslint-disable import/no-extraneous-dependencies */
const asyncHandler = require("express-async-handler");
const { promisify } = require("util");

const jwt = require("jsonwebtoken");

const AppError = require("../utils/appError");
const User = require("../models/userModel");

const createToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

exports.signingUp = asyncHandler(async (req, res, next) => {
  // get user credentials
  const { name, email, password } = req.body;

  const user = await User.create({
    name,
    email,
    password,
  });

  const token = createToken(user._id);

  res.status(201).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
});

exports.loginIn = asyncHandler(async (req, res, next) => {
  // get user credentials
  const { email, password } = req.body;

  // check if the user entered email and password is handled in the val express

  // check if user exists and password is correct
  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.comparePassword(password, user.password)))
    return next(new AppError("invalid credentials", 401));

  const token = createToken(user._id);

  res.status(201).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
});

exports.protects = asyncHandler(async (req, res, next) => {
  // 1) get the token
  let token;

  // 2) check if the token is send
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) return next(new AppError("you are not logged in", 401));

  // 3) verify the token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // 4) check if user still exists
  const user = await User.findById(decoded.id);

  if (!user) return next(new AppError("user no longer exists", 401));

  // 5) check if user changed password after the token was issued
  // if (user.changedPasswordAfter(decoded.iat))
  //   return next(new AppError("user recently changed password", 401));

  req.user = user;

  next();
});

exports.updatePassword = asyncHandler(async (req, res, next) => {
  // 1) get user from collection
  const user = await User.findById(req.user._id).select("+password");

  if (!(await user.comparePassword(req.body.newPassword, user.password)))
    return next(new AppError("your current password is wrong", 401));

  user.password = req.body.newPassword;

  await user.save();

  const token = createToken(user._id);

  res.status(201).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
});
