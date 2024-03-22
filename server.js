const mongoose = require("mongoose");
const dotenv = require("dotenv");
const morgan = require("morgan");

const app = require("./app");

dotenv.config({ path: "./config.env" });

const DB = process.env.DATABASE;
const port = process.env.PORT || 4000;

const connectToDB = async () => {
  try {
    await mongoose.connect(DB, {
      autoIndex: true,
    });
    console.log("Connected to Mongodb Atlas");
  } catch (error) {
    console.error(error);
  }
};
connectToDB();

// to handle dataBase errors

const server = app.listen(port, () => {
  console.log(`app running on ${port} in... ${process.env.NODE_ENV} mode`);
});

process.on("unhandledRejection", (err) => {
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
