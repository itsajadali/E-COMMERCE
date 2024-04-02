/* eslint-disable import/no-extraneous-dependencies */
const multer = require("multer");
const AppError = require("../utils/appError");

//  1) Disk Storage solution
// specifying the destination
// specifying the filename

// const multerStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "uploads/categories");
//   },
//   filename: (req, file, cb) => {
//     const ext = file.mimetype.split("/")[1];
//     cb(null, `category-${req.body.name}-${Date.now()}.${ext}`);
//   },
// });

// memory storage
// will return a buffer
// sharp is user buffer format to resize

const multerStorage = multer.memoryStorage();

// to allow images only to be uploaded
const multerFilter = (req, file, cb) => {
  if (!file.mimetype.startsWith("image"))
    return cb(
      new AppError("Not an image! Please upload only images.", 400),
      false
    );
  cb(null, true);
};

exports.uploadOneImage = (fieldName) => {
  const upload = multer({ storage: multerStorage, fileFilter: multerFilter });
  return upload.single(fieldName);
};
exports.uploadMixImage = (arrayOfFields) => {
  const upload = multer({ storage: multerStorage, fileFilter: multerFilter });
  return upload.fields(arrayOfFields);
};
