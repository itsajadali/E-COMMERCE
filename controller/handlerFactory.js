const slugify = require("slugify");
const asyncHandler = require("express-async-handler");
const APIfeatures = require("../utils/apifeatures");

const AppError = require("../utils/appError");

exports.deleteOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const document = await Model.findByIdAndDelete(id);

    if (!document) {
      return next(new AppError(`No document for this id ${id}`, 404));
    }

    res.status(204).json({
      status: "success",
      data: null,
    });
  });

exports.updateOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    if (req.body.title) req.body.slug = slugify(req.body.title);
    if (req.body.name) req.body.slug = slugify(req.body.name);

    const document = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!document) {
      return next(
        new AppError(`No document for this id ${req.params.id}`, 404)
      );
    }
    res.status(200).json({
      statues: "Success",
      data: document,
    });
  });

exports.createOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    if (req.body.title) req.body.slug = slugify(req.body.title);
    if (req.body.name) req.body.slug = slugify(req.body.name);

    const document = await Model.create(req.body);

    res.status(201).json({
      statues: "Success",
      data: document,
    });
  });

exports.getOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    const document = await Model.findById(req.params.id);

    if (!document) {
      return next(
        new AppError(`No document for this id ${req.params.id}`, 404)
      );
    }
    res.status(200).json({ data: document });
  });

exports.getAll = (Model) =>
  asyncHandler(async (req, res) => {
    const documentsCount = await Model.countDocuments();

    const features = new APIfeatures(Model.find(), req.query)
      .filter()
      .limitsField()
      .search()
      .sort()
      .paginate(documentsCount);

    const { query, paginationResults } = features;
    const documents = await query;

    res.status(200).json({
      statues: "Success",
      results: documents.length,
      paginationResults,
      data: documents,
    });
  });
