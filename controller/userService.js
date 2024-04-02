/* eslint-disable import/no-extraneous-dependencies */
const asyncHandler = require("express-async-handler");

const User = require("../models/userModel");
const factory = require("./handlerFactory");

exports.getUsers = factory.getAll(User);
exports.getUser = factory.getOne(User);
exports.createUser = factory.createOne(User);
exports.updateUser = factory.updateOne(User);
exports.deleteUser = factory.deleteOne(User);
