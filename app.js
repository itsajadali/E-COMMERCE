const express = require("express");
const morgan = require("morgan");
const dotenv = require("dotenv");
const categoryRouter = require("./routes/categoryRoute");
const subcategoryRouter = require("./routes/subCategoryRoutes");
const brandRouter = require("./routes/brandRoute");

const globalErrorHandler = require("./controller/errorHandler");
const AppError = require("./utils/appError");

const app = express();

dotenv.config({ path: "./config.env" });

app.use(express.json());

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use("/api/v1/category", categoryRouter);
app.use("/api/v1/subcategory", subcategoryRouter);
app.use("/api/v1/brand", brandRouter);

app.all("*", (req, res, next) => {
  next(new AppError(`can't get this route: ${req.originalUrl}`, 400));
});

app.use(globalErrorHandler);

module.exports = app;
